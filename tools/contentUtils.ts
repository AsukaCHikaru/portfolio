import { parse } from "@asukawang/amp";
import type { PostMetaData } from "../src/types";

export const convertFrontmatterToPostMetaData = (
  frontmatter: Record<string, string>,
): PostMetaData => {
  return {
    title: frontmatter.title,
    description: frontmatter.description,
    publishedAt: frontmatter.published,
    pathname: frontmatter.pathname,
    category: frontmatter.category,
    topic: frontmatter.topic,
    language: frontmatter.language,
  };
};

export const parsePost = async (filePath: string) => {
  const fileContent = await Bun.file(filePath).text();
  const { frontmatter, blocks } = parse(fileContent);
  return {
    metadata: convertFrontmatterToPostMetaData(frontmatter),
    content: blocks,
  };
};
