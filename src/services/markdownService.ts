import type { BlogPostMeta } from "../../types";
import type { MarkdownBlock } from "../../types/markdown";
import { parseBlogPostMeta } from "../utils/markdownUtils";
import { request } from "./apiCore";

export const getBlogPostList = async (): Promise<BlogPostMeta[]> => {
  const data = await request("/api/blog");
  return data.map(parseBlogPostMeta);
};

export const getBlogPost = async (
  postPath: string,
): Promise<{ content: MarkdownBlock[] }> => {
  const data = await request(`/api/blog/${postPath}`);
  console.log(data);
  return data;
};
