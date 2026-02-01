import { createContext } from "react";
import type { MusicAwardNominee, Post } from "../types";

export type ContextData = {
  postList: Post[];
  about: Post | null;
  list: {
    musicAwards: {
      year: {
        category: string;
        nominees: MusicAwardNominee[];
      }[];
    }[];
  };
};

export const DataContext = createContext<ContextData>({
  postList: [],
  about: null,
  list: {
    musicAwards: [],
  },
});
