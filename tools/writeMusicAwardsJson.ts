import { existsSync, readdirSync, readFileSync } from "fs";
import { writeFile } from "fs/promises";
import type { MusicAwardNominee } from "../src/types";

const musicAwardsFolderPath = "./symbolicLinks/list/musicAwards";

const checkSymlinkExist = (path: string) => {
  if (existsSync(path)) {
    return;
  }
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

const mapLineToNominee = (
  items: string[],
  category: string,
): MusicAwardNominee => {
  const isWinner = items[0] === "O";
  const trimmed = isWinner ? items.slice(2) : items;

  return category.includes("Artist")
    ? {
        artist: trimmed[0],
        isWinner,
      }
    : {
        title: trimmed[0],
        artist: trimmed[1],
        feat: trimmed[2] || undefined,
        isWinner,
      };
};

const groupByCategory = (items: string[][]) => {
  const grouped: string[][][] = [];
  items.forEach((item) => {
    if (item[0] === "O") {
      grouped.push([item]);
    } else {
      grouped[grouped.length - 1].push(item);
    }
  });

  const categories: Record<string, MusicAwardNominee[]> = {};
  grouped.forEach((group) => {
    const category = group[0][1];
    group.forEach((item) => {
      if (item[0] === "O") {
        categories[category] = [mapLineToNominee(item, category)];
      } else {
        categories[category].push(mapLineToNominee(item, category));
      }
    });
  });

  return categories;
};

const parseTable = (table: string) => {
  const lines = table
    .split("\n")
    .filter((line) => line.startsWith("|"))
    .slice(2)
    .map(parseTableLine);

  const parsed = groupByCategory(lines);
  return parsed;
};

const parseTableLine = (line: string) =>
  line
    .replace(/\[\[([\s\S]+?)\]\]/g, "$1") // trim obsidian link brackets
    .split("|")
    .map((cell) => cell.trim())
    .filter((cell) => cell !== "");

const run = async () => {
  checkSymlinkExist(musicAwardsFolderPath);

  const files = getFileList(musicAwardsFolderPath);
  const sortedFiles = files.sort(sortYearDescending);

  const yearMap = new Map<string, Record<string, MusicAwardNominee[]>>();
  sortedFiles.forEach((file) => {
    const content = readFileSync(`${musicAwardsFolderPath}/${file}`, "utf8");
    const table = content.match(/#\sList\n[^#]+/)?.[0];
    if (!table) {
      throw new Error(`No table found in ${file}`);
    }
    const parsed = parseTable(table);
    const year = file.match(/\d{4}/)?.[0];
    if (!year) {
      throw new Error(`No year found in ${file}`);
    }
    yearMap.set(year, parsed);
  });

  await writeFile(
    "./public/contents/list/musicAwards.json",
    JSON.stringify(Object.fromEntries(yearMap), null, 2),
  );
  console.log(
    `Music awards markdown data written to JSON file ${"./public/contents/list/musicAwards.json"}`,
  );
};

if (import.meta.main) {
  run();
}
