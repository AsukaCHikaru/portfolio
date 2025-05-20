import type { PostMetaData } from "./contentServices";


export const convertFrontmatterToPostMetaData = (frontmatter: Record<string, string>): PostMetaData => {
  return {
    title: frontmatter.title,
    description: frontmatter.description,
    publishedAt: frontmatter.published,
    pathname: frontmatter.pathname,
    category: frontmatter.category,
    topic: frontmatter.topic,
  };
}