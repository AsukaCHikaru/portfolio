import type { BlogPostMeta } from "../../types";
import type { MarkdownBlock } from "../../types/markdown";
import { request } from "./apiCore";

export const getBlogPostList = async (): Promise<BlogPostMeta[]> => {
  const data = await request<BlogPostMeta[]>("/api/blog");
  return data;
};

export const getBlogPost = async (
  postPath: string,
): Promise<{ content: MarkdownBlock[] }> => {
  const data = await request<{ content: MarkdownBlock[] }>(
    `/api/blog/${postPath}`,
  );
  return data;
};
