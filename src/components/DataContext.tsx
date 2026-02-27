import { createContext } from "react";
import type {
  BucketList,
  List,
  MusicAwardList,
  Post,
  VideoGameIndexList,
} from "../types";

export type ContextData = {
  lastCommitDate: string;
  postList: Post[];
  about: Post | null;
  list: {
    musicAwards: List<MusicAwardList>;
    videoGameIndex: List<VideoGameIndexList>;
    bucketList: List<BucketList>;
  };
};

export const DataContext = createContext<ContextData>({
  lastCommitDate: "",
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
    bucketList: {
      name: "",
      description: "",
      pathname: "",
      list: [],
    },
  },
});
