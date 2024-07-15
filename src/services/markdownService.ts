import type { BlogPostMeta } from "../types";
import { parseBlogPostMeta } from "../utils/markdownUtils";
import { request } from "./apiCore";

export const getBlogList = async (): Promise<BlogPostMeta[]> => {
  const data = await request("/api/blogList");
  return data.map(parseBlogPostMeta);
};
