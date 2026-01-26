import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

const sourcePath = "./symbolicLinks/list/bucketList";
const outputPath = "./public/contents/list/bucket-list.md";

const run = () => {
  if (!existsSync(sourcePath)) {
    console.log(`Source file at ${sourcePath} does not exist.`);
    process.exit(0);
  }

  const content = readFileSync(sourcePath, "utf8");

  // Remove frontmatter
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---\n/, "");

  // Trim date at end of each task line (format: YYYY/M/DD or YYYY/MM/DD)
  const trimmedContent = withoutFrontmatter.replace(
    /^(- \[.\] .+?)\s+\d{4}\/\d{1,2}\/\d{1,2}$/gm,
    "$1",
  );

  mkdirSync("./public/contents/list", { recursive: true });
  writeFileSync(outputPath, trimmedContent);

  console.log(`Successfully wrote bucket list to ${outputPath}`);
};

if (import.meta.main) {
  run();
}
