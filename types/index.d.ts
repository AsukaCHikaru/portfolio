export type BlogPostLanguage = "en-US" | "zh-TW";

export type BlogPostMeta = {
  category: string;
  description?: string;
  language: BlogPostLanguage;
  pathname: string;
  published: string;
  updated?: string;
  title: string;
};
