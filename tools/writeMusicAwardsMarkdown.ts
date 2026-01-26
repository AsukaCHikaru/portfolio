import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";

interface Nominee {
  song: string;
  artist: string;
  feat: string;
  link: string;
  isWinner: boolean;
}

interface ParsedCategory {
  name: string;
  nominees: Nominee[];
}

interface YearData {
  year: string;
  categories: ParsedCategory[];
}

const musicAwardsFolderPath = "./symbolicLinks/list/musicAwards";

const checkSymlinkExist = (path: string) => {
  if (existsSync(path)) {
    return;
  }
  console.log(`Symbolic link at ${path} does not exist.`);
  process.exit(0);
};

const getFileList = (folderPath: string) => {
  const years = readdirSync(folderPath).filter((file) =>
    /Music Awards \d{4}\.md$/.test(file),
  );
  return years;
};

const sortYearDescending = (a: string, b: string) => {
  const yearA = a.match(/\d{4}/)?.[0];
  const yearB = b.match(/\d{4}/)?.[0];
  if (yearA === undefined || yearB === undefined) {
    return 0;
  }
  return parseInt(yearB) - parseInt(yearA);
};

const trimSpaceInLine = (line: string) => {
  let result = line
    .replace(/\|\s([\s\S]+?)\s{2,}/g, "$1|") // trim spaces in cells
    .replace(/\[\[([\s\S]+?)\]\]/g, "$1") // trim obsidian hyperlink brackets
    .replace(/(\s?\|)+$/g, "") // trim trailing pipes and spaces
    .replace(/^(\s\|)+/g, ""); // trim leading pipes and spaces

  // Collapse empty cells repeatedly (handles consecutive empty cells)
  let prev = "";
  while (prev !== result) {
    prev = result;
    result = result.replace(/\|\s*\|/g, "|");
  }

  return result;
};

const groupByFive = (items: string[]) => {
  const grouped: string[][] = [];
  for (let i = 0; i < items.length; i += 5) {
    grouped.push(items.slice(i, i + 5));
  }
  return grouped;
};

/**
 * Extract feat and link from extra parts after song/artist.
 * Links start with "http", everything else is treated as featuring artist.
 */
const extractExtras = (parts: string[]): { feat: string; link: string } => {
  let feat = "";
  let link = "";
  for (const part of parts) {
    if (part.startsWith("http")) {
      link = part;
    } else if (part) {
      feat = part;
    }
  }
  return { feat, link };
};

const parseCategory = (lines: string[]): ParsedCategory => {
  // First line: "O|Category Name|Song|Artist|..." or "O|Category Name|Artist" (for Favorite Artist)
  // Other lines: "Song|Artist|..." or single value (artist-only or song-only)
  const firstLineParts = lines[0].split("|").map((p) => p.trim());
  const categoryName = firstLineParts[1]?.replace(/<br>/g, "").trim() || "";
  const isArtistOnly =
    categoryName === "Favorite Artist" ||
    categoryName === "Favorite New Artist";

  const nominees: Nominee[] = lines.map((line, index) => {
    let parts = line.split("|").map((p) => p.trim());

    // Strip leading <br> placeholder from subsequent lines
    if (index > 0 && parts[0] === "<br>") {
      parts = parts.slice(1);
    }

    const isFirstLine = index === 0;
    const isWinner = isFirstLine && parts[0] === "O";

    // Normalize: first line has extra columns (winner marker, category name) to skip
    const dataParts = isFirstLine ? parts.slice(2) : parts;

    // Parse based on category type
    let song = "";
    let artist = "";

    if (isArtistOnly) {
      artist = dataParts[0] || "";
    } else if (dataParts.length === 1) {
      // Single value means song only (artist was empty in source)
      song = dataParts[0] || "";
    } else {
      song = dataParts[0] || "";
      artist = dataParts[1] || "";
    }

    // Extra parts (after song/artist) may contain feat or link
    const extraStartIndex = isArtistOnly ? 1 : 2;
    const { feat, link } = extractExtras(dataParts.slice(extraStartIndex));

    return { song, artist, feat, link, isWinner };
  });

  return { name: categoryName, nominees };
};

const formatNominee = (nominee: Nominee, isArtistOnly: boolean): string => {
  const checkbox = nominee.isWinner ? "[x]" : "[ ]";

  // Build main content: artist-only categories show just artist, others show "Song" - Artist
  let content = isArtistOnly
    ? nominee.artist
    : [nominee.song ? `"${nominee.song}"` : "", nominee.artist]
        .filter(Boolean)
        .join(" - ");

  // Append feat (strip redundant prefix variants: "feat.", "ft.", "(feat.", "(with", etc.)
  if (nominee.feat) {
    const featText = nominee.feat
      .replace(/^\(?(?:feat\.?|ft\.?|with)\s*/i, "")
      .replace(/\)$/, "");
    content += ` (feat. ${featText})`;
  }

  // Append link
  if (nominee.link) {
    content += ` ([Link](${nominee.link}))`;
  }

  return `- ${checkbox} ${content}`;
};

const formatCategory = (category: ParsedCategory): string => {
  const isArtistOnly =
    category.name === "Favorite Artist" ||
    category.name === "Favorite New Artist";
  const header = `## ${category.name}`;
  const nominees = category.nominees
    .map((nominee) => formatNominee(nominee, isArtistOnly))
    .join("\n");
  return `${header}\n${nominees}`;
};

const formatYear = (yearData: YearData): string => {
  const header = `# ${yearData.year}`;
  const categories = yearData.categories
    .map((category) => formatCategory(category))
    .join("\n\n");
  return `${header}\n\n${categories}`;
};

const run = async () => {
  checkSymlinkExist(musicAwardsFolderPath);

  const files = getFileList(musicAwardsFolderPath);
  const sortedFiles = files.sort(sortYearDescending);

  const allYears: YearData[] = sortedFiles.map((file) => {
    const content = readFileSync(`${musicAwardsFolderPath}/${file}`, "utf8");
    const table = content.match(/#\sList\n[^#]+/)?.[0];
    if (!table) {
      throw new Error(`No table found in ${file}`);
    }
    const lines = table
      .split("\n")
      .filter((line) => line.startsWith("|"))
      .slice(2)
      .map(trimSpaceInLine);
    const linesByCategory = groupByFive(lines);
    const categories = linesByCategory.map(parseCategory);

    // Extract year from filename (e.g., "Music Awards 2025.md" -> "2025")
    const year = file.match(/\d{4}/)?.[0] || "";

    return {
      year,
      categories,
    };
  });

  // Format all years to markdown
  const markdown = allYears.map(formatYear).join("\n\n");

  // Write to output file
  mkdirSync("./public/contents/list", { recursive: true });
  writeFileSync("./public/contents/list/music-awards.md", markdown);

  console.log(
    "Successfully wrote music awards markdown to ./public/contents/list/music-awards.md",
  );
};

if (import.meta.main) {
  run();
}
