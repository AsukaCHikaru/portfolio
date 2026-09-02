import { createContext } from "react";
import type { InlineContent } from "@asukawang/amp";
import type { Block } from "../../tools/markdownParser";

export type SidenoteMap = Record<string, InlineContent[]>;

export const SidenoteContext = createContext<SidenoteMap | null>(null);

export const collectSidenotes = (blocks: Block[]): SidenoteMap =>
  Object.fromEntries(
    blocks
      .filter((block) => block.type === "footnote")
      .flatMap((block) => block.items)
      .map((item) => [item.label, item.body]),
  );
