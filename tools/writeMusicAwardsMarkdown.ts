import { existsSync, readdirSync, readFileSync } from "fs";

const musicAwardsFolderPath = "./symbolicLinks/musicAwards";

const checkSymlinkExist = (path: string) => {
  if (existsSync(path)) {
    return;
  }
  console.log(`Symbolic link at ${path} does not exist.`);
  process.exit(0);
};

const getFileList = (folderPath: string) => {
  const years = readdirSync(folderPath).filter((file) =>
    /\d{4}\.md$/.test(file),
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
  return line
    .replace(/\|\s+\|/g, "|") // trim empty cells
    .replace(/\|\s([\s\S]+?)\s{2,}/g, "$1|") // trim spaces in cells
    .replace(/\[\[([\s\S]+?)\]\]/g, "$1") // trim obsidian hyperlink brackets
    .replace(/(\s?\|)+$/g, "") // trim trailing pipes and spaces
    .replace(/^(\s\|)+/g, "") // trim leading pipes and spaces
    .replace(/\|{2,}/g, "|");
};

const groupByFive = (items: string[]) => {
  const grouped: string[][] = [];
  for (let i = 0; i < items.length; i += 5) {
    grouped.push(items.slice(i, i + 5));
  }
  return grouped;
};

const parseCategory = (lines: string[]) => {
  const category = lines[0].split("|")[1].trim();
  console.log(`Category: ${category}`);
  const nominees = [
    lines[0].split("|").slice(2),
    ...lines.slice(1).map((line) => line.split("|")),
  ];
  console.log(`Nominees: ${JSON.stringify(nominees)}`);
};

const run = async () => {
  checkSymlinkExist(musicAwardsFolderPath);

  const files = getFileList(musicAwardsFolderPath);
  const sortedFiles = files.sort(sortYearDescending);

  sortedFiles.forEach((file) => {
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
    console.log(categories);
  });
};

if (import.meta.main) {
  run();
}
