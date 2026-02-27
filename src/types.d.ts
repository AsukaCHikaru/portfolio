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

export type VideoGameIndexList = {
  title: string;
  developer: string;
  publisher: string;
  released: string;
  played: string;
  platform: string;
  rating: string;
  reviewUrl?: string;
}[];

export type BucketList = {
  category: string;
  tasks: { isDone: boolean; doneDate: string | undefined; value: Block[] }[];
}[];

export type List<T> = {
  name: string;
  description: string;
  pathname: string;
  list: T;
};

export type FrontPageData = {
  section: "front_page";
  data: {
    leadStory: Post;
    lastUpdated: string;
    furtherReading: FurtherReading;
    categories: { name: string; count: number }[];
    featuredReading: Post | undefined;
  };
};

export type BlogArchiveData = {
  section: "blog_archive";
  data: {
    postList: {
      metadata: PostMetaData;
    }[];
  };
};

export type BlogData = {
  section: "blog";
  data: {
    metadata: PostMetaData;
    content: Block[];
  };
};

export type AboutData = {
  section: "about";
  data: Post;
};

export type ListData = {
  section: "list";
  data: {
    musicAwards: List<MusicAwardList>;
    videoGameIndex: List<VideoGameIndexList>;
    bucketList: List<BucketList>;
  };
};

export type MusicAwardsData = {
  section: "list_music_awards";
  data: { musicAwards: List<MusicAwardList> };
};

export type VideoGameIndexData = {
  section: "list_video_game_index";
  data: { videoGameIndex: List<VideoGameIndexList> };
};

export type BucketListData = {
  section: "list_bucket_list";
  data: { bucketList: List<BucketList> };
};

export type SiteData =
  | FrontPageData
  | BlogArchiveData
  | BlogData
  | AboutData
  | ListData
  | MusicAwardsData
  | VideoGameIndexData
  | BucketListData;
