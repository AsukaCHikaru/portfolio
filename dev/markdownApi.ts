import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "path";
import { parseMarkdownFrontmatter } from "./markdownParser";

const markdownFolderPath = resolve(import.meta.dir, "..", "public", "contents");

export const getBlogList = () => {
  const filePaths = readdirSync(markdownFolderPath);

  filePaths.forEach((filePath) => {
    const frontmatter = parseMarkdownFrontmatter(
      readFileSync(resolve(markdownFolderPath, filePath)),
    );
  });
  return JSON.stringify({ foo: "bar" });
};
