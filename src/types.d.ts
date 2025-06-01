import type { Block } from "@asukawang/amp";

export type PostMetaData = {
  title: string;
  description: string;
  publishedAt: string;
  pathname: string;
  category: string;
  topic: string;
  language: string;
};

export type Post = {
  metadata: PostMetaData;
  content: Block[];
};
