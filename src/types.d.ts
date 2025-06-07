import type { Block } from "@asukawang/amp";

export type PostMetaData = {
  title: string;
  description: string;
  publishedAt: string;
  pathname: string;
  category: string;
  topic: string;
  language: string;
  featured: boolean;
  thumbnail?: string;
  thumbnailDirection?: "landscape" | "portrait";
};

export type Post = {
  metadata: PostMetaData;
  content: Block[];
};
