import { request } from "./apiCore";

export const getBlogList = async () => {
  const data = await request("/api/blogList");
  return data;
};
