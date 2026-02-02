import type { Block } from "../tools/markdownParser";

export type PostMetaData = {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
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

export type FurtherReading =
  | {
      type: "category";
      posts: Post[];
    }
  | {
      type: "recent";
      posts: Post[];
    };

export type RecordNominee = {
  title: string;
  artist: string;
  feat?: string;
  isWinner: boolean;
};
type ArtistNominee = {
  artist: string;
  isWinner: boolean;
};
export type MusicAwardNominee = RecordNominee | ArtistNominee;
export type MusicAwardList = {
  year: string;
  categories: {
    category: string;
    nominees: MusicAwardNominee[];
  }[];
}[];

export type List<T> = {
  name: string;
  description: string;
  pathname: string;
  list: T;
};
