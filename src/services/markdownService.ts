import type { BlogPostMeta } from "../../types";
import { parseBlogPostMeta } from "../utils/markdownUtils";
import { request } from "./apiCore";

export const getBlogPostList = async (): Promise<BlogPostMeta[]> => {
  const data = await request("/api/blog");
  return data.map(parseBlogPostMeta);
};

export const getBlogPost = async (postPath: string): Promise<unknown> => {
  const data = await request(`/api/blog/${postPath}`);
  return data;
};
