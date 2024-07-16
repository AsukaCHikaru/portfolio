import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "path";
import { parseMarkdown, parseMarkdownFrontmatter } from "./markdownParser";

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

export const getBlogPost = (postPath: string) => {
  const filePaths = readdirSync(markdownFolderPath);

  const list: Record<string, string>[] = [];

  filePaths.forEach((filePath) => {
    const frontmatter = parseMarkdownFrontmatter(
      readFileSync(resolve(markdownFolderPath, filePath)),
    );
    list.push(frontmatter);
  });

  const post = list.find((post) => post.pathname === postPath);

  if (!post) {
    throw new Error("Post not found");
  }

  try {
    const file = readFileSync(
      resolve(markdownFolderPath, `${decodeURI(post.title)} (blog).md`),
    );
    return JSON.stringify(parseMarkdown(file.toString("utf-8")));
  } catch (error) {
    console.error(error);
  }
};
