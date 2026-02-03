import { createContext } from "react";
import type { List, MusicAwardList, Post, VideoGameIndexList } from "../types";

export type ContextData = {
  postList: Post[];
  about: Post | null;
  list: {
    musicAwards: List<MusicAwardList>;
    videoGameIndex: List<VideoGameIndexList>;
  };
};

export const DataContext = createContext<ContextData>({
  postList: [],
  about: null,
  list: {
    musicAwards: {
      name: "",
      description: "",
      pathname: "",
      list: [],
    },
    videoGameIndex: {
      name: "",
      description: "",
      pathname: "",
      list: [],
    },
  },
});
