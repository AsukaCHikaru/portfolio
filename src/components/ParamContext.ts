import { createContext } from "react";

export const ParamContext = createContext<{
  pathParam: {
    key: string;
    value: string;
  }[];
  searchParam: {
    [key: string]: string;
  } | null;
} | null>(null);
