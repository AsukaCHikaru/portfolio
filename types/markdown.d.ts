type TextBlockTypes = "plain" | "strong" | "italic" | "inlineCode";

type LinkTextBlock = {
  type: "link";
  text: string;
  url: string;
};

type TextBlock =
  | {
      type: TextBlockTypes;
      text: string;
    }
  | LinkTextBlock;

type HeadingBlock = {
  type: "heading";
  children: TextBlock[];
  depth: number;
};

type ParagraphBlock = {
  type: "paragraph";
  children: TextBlock[];
};

type ImageBlock = {
  type: "image";
  url: string;
  caption: string | null;
  alt: string | null;
};

type ListItemBlock = {
  type: "listItem";
  children: TextBlock[];
};

type ListBlock = {
  type: "list";
  children: ListItemBlock[];
  ordered: boolean;
};

type CodeBlock = {
  type: "code";
  lang?: string;
  text: string;
};

type QuoteBlock = {
  type: "quote";
  children: TextBlock[];
};

type ThematicBreakBlock = {
  type: "thematicBreak";
};

export type MarkdownBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | ListBlock
  | CodeBlock
  | QuoteBlock
  | ThematicBreakBlock;
