import { createContext } from "react";

export const PathParamContext = createContext<{
  pathParam: {
    key: string;
    value: string;
  }[];
} | null>(null);
