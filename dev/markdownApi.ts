import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "path";
import { parseMarkdownFrontmatter } from "./markdownParser";

const markdownFolderPath = resolve(import.meta.dir, "..", "public", "contents");

export const getBlogPostList = () => {
  const filePaths = readdirSync(markdownFolderPath);

  const list: Record<string, string>[] = [];

  filePaths.forEach((filePath) => {
    const frontmatter = parseMarkdownFrontmatter(
      readFileSync(resolve(markdownFolderPath, filePath)),
    );
    list.push(frontmatter);
  });
  return JSON.stringify(list);
};

export const getBlogPost = (postTitle: string) => {
  try {
    const file = readFileSync(
      resolve(markdownFolderPath, `${decodeURI(postTitle)} (blog).md`),
    );
    return file.toString("utf-8");
  } catch (error) {
    console.error(error);
  }
};
