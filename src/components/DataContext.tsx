import { createContext } from "react";
import type { List, MusicAwardList, Post } from "../types";

export type ContextData = {
  postList: Post[];
  about: Post | null;
  list: {
    musicAwards: List<MusicAwardList>;
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
  },
});
