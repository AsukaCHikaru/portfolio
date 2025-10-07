import { Amp } from "@asukawang/amp";
import type { PostMetaData } from "../src/types";

export const convertFrontmatterToPostMetaData = (
  frontmatter: Record<string, string>,
): PostMetaData => {
  return {
    title: frontmatter.title,
    description: frontmatter.description,
    publishedAt: frontmatter.published,
    updatedAt: frontmatter.updated ?? undefined,
    pathname: frontmatter.pathname,
    category: frontmatter.category,
    topic: frontmatter.topic,
    language: frontmatter.language,
    featured: frontmatter.featured === "true",
    thumbnail: frontmatter.thumbnail,
    thumbnailDirection: frontmatter[
      "thumbnail-direction"
    ] as PostMetaData["thumbnailDirection"],
  };
};

const amp = new Amp();

export const parsePost = async (filePath: string) => {
  const fileContent = await Bun.file(filePath).text();
  const { frontmatter, blocks } = amp.parse(fileContent);
  return {
    metadata: convertFrontmatterToPostMetaData(frontmatter),
    content: blocks,
  };
};
