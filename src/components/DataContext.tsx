import { createContext } from "react";
import type { Post } from "../types";

export const DataContext = createContext<{
  postList: Post[];
  about: Post | null;
}>({
  postList: [],
  about: null,
});
