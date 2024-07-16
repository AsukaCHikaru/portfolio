import type { BlogPostLanguage, BlogPostMeta } from "../types";

export const convertFrontmatterToBlogPostMeta = (
  input: Record<string, string>,
): BlogPostMeta => {
  return {
    category: input.category,
    title: input.title,
    pathname: input.pathname,
    description: input.description,
    published: input.published,
    updated: input.updated || input.published,
    language: input.language as BlogPostLanguage,
  };
};
