import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "path";
import { parseMarkdown, parseMarkdownFrontmatter } from "./markdownParser";
import type { BlogPostMeta } from "../types";

const markdownFolderPath = resolve(import.meta.dir, "..", "public", "contents");

export const getBlogPostList = () => {
  const filePaths = readdirSync(markdownFolderPath);

  const list: BlogPostMeta[] = [];

  filePaths.forEach((filePath) => {
    const { frontmatter } = parseMarkdown(
      readFileSync(resolve(markdownFolderPath, filePath)).toString("utf-8"),
    );
    list.push(frontmatter);
  });

  const sortedList = list.sort(
    (prev, next) =>
      new Date(next.published).getTime() - new Date(prev.published).getTime(),
  );

  return JSON.stringify(sortedList);
};

export const getBlogPost = (postPath: string) => {
  const filePaths = readdirSync(markdownFolderPath);

  const list: BlogPostMeta[] = [];

  filePaths.forEach((filePath) => {
    const { frontmatter } = parseMarkdown(
      readFileSync(resolve(markdownFolderPath, filePath)).toString("utf-8"),
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
