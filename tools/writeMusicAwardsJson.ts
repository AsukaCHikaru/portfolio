import { existsSync, readdirSync, readFileSync } from "fs";
import { writeFile } from "fs/promises";
import type { MusicAwardNominee } from "../src/types";
import { resolve } from "path";
import { amp } from "./markdownParser";

const musicAwardsFolderPath = "./symbolicLinks/list/musicAwards";

const checkSymlinkExist = (path: string) => {
  if (existsSync(path)) {
    return;
  }
  process.exit(0);
};

const getAnnualFileList = (folderPath: string) => {
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

  const categories: Record<
    string,
    { category: string; nominees: MusicAwardNominee[] }
  > = {};
  grouped.forEach((group) => {
    const category = group[0][1];
    group.forEach((item) => {
      if (item[0] === "O") {
        categories[category] = {
          category,
          nominees: [mapLineToNominee(item, category)],
        };
      } else {
        categories[category].nominees.push(mapLineToNominee(item, category));
      }
    });
  });

  return Object.values(categories);
};

const parseTable = (table: string) => {
  const lines = table
    .split("\n")
    .filter((line) => line.startsWith("|"))
    .slice(2)
    .map(parseTableLine);

  return groupByCategory(lines);
};

const parseTableLine = (line: string) =>
  line
    .replace(/\[\[([\s\S]+?)\]\]/g, "$1") // trim obsidian link brackets
    .split("|")
    .map((cell) => cell.trim())
    .filter((cell) => cell !== "");

const run = async () => {
  checkSymlinkExist(musicAwardsFolderPath);
  const fileContent = readFileSync(
    resolve(musicAwardsFolderPath, "Music Awards.md"),
    "utf-8",
  );
  const { frontmatter } = amp.parse(fileContent);
  const files = getAnnualFileList(musicAwardsFolderPath);
  const sortedFiles = files.sort(sortYearDescending);

  const yearList: {
    year: string;
    categories: { category: string; nominees: MusicAwardNominee[] }[];
  }[] = [];
  sortedFiles.forEach((file) => {
    const content = readFileSync(`${musicAwardsFolderPath}/${file}`, "utf-8");
    const table = content.match(/#\sList\n[^#]+/)?.[0];
    if (!table) {
      throw new Error(`No table found in ${file}`);
    }
    const categories = parseTable(table);
    const year = file.match(/\d{4}/)?.[0];
    if (!year) {
      throw new Error(`No year found in ${file}`);
    }
    yearList.push({
      year,
      categories: categories,
    });
  });

  await writeFile(
    "./public/contents/list/musicAwards.json",
    JSON.stringify(
      {
        name: frontmatter.portfolio_list_name,
        description: frontmatter.portfolio_list_description,
        pathname: frontmatter.portfolio_list_pathname,
        list: yearList,
      },
      null,
      2,
    ),
  );
  console.log(
    `Music awards markdown data written to JSON file ${"./public/contents/list/musicAwards.json"}`,
  );
};

if (import.meta.main) {
  run();
}
