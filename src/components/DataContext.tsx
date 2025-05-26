import { createContext } from "react";
import type { PostMetaData } from "../types";
import type { Block } from "@asukawang/amp";

export const DataContext = createContext<{
  postList: { metadata: PostMetaData; content: Block[] }[];
  about: { metadata: PostMetaData; content: Block[] } | null;
}>({
  postList: [],
  about: null,
});
