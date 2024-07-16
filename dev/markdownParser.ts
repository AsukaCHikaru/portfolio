import type { ListBlock, MarkdownBlock, TextBlock } from "../types/markdown";
import type { Content, PhrasingContent, Paragraph, List, Yaml } from "mdast";
import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { convertFrontmatterToBlogPostMeta } from "./markdownUtils";
import type { BlogPostMeta } from "../types";

export const parseMarkdownFrontmatter = (buf: Buffer) => {
  const string = buf.toString("utf-8");
  const frontmatterStarterRemoved = string.split(/\n/).slice(1);
  const frontmatterEnderIndex = frontmatterStarterRemoved.findIndex(
    (item) => item === "---",
  );
  const frontmatterItemList = frontmatterStarterRemoved.slice(
    0,
    frontmatterEnderIndex,
  );

  const map = new Map();

  frontmatterItemList.forEach((item) => {
    const match = /^(\w+):\s(.+)$/.exec(item);
    if (match === null) {
      return;
    }
    const [_, key, value] = match;
    map.set(key, value);
  });

  return Object.fromEntries(map);
};

const parseFrontmatter = (rawFrontmatter: Yaml): BlogPostMeta => {
  const map = new Map();
  rawFrontmatter.value.split("\n").forEach((entry) => {
    const match = /^(\w+):\s["']?(.+?)["']?$/.exec(entry);
    if (match === null) {
      return;
    }
    const [_, key, value] = match;
    map.set(key, value);
  });
  return convertFrontmatterToBlogPostMeta(Object.fromEntries(map));
};

const parseParagraphContent = (content: Paragraph): MarkdownBlock => {
  if (content.children[0].type === "image") {
    return {
      type: "image",
      caption: content.children[0].title ?? null,
      url: content.children[0].url,
      alt: content.children[0].alt ?? null,
    };
  }
  if (
    content.children[0].type === "text" &&
    /^!\[\[.+\]\]/.test(content.children[0].value)
  ) {
    const match = /^!\[\[(.+)\]\]\n(.*)$/.exec(content.children[0].value);
    if (match?.length) {
      return {
        type: "image",
        url: match[1],
        caption: match[2],
        alt: null,
      };
    }
  }
  return {
    type: "paragraph",
    children: parseTextBlock(content.children),
  };
};

const parseListContent = (content: List): ListBlock => {
  return {
    type: "list",
    ordered: !!content.ordered,
    children: content.children.map((child) => ({
      type: "listItem",
      children: (child.children as Paragraph[]).flatMap((child) =>
        parseTextBlock(child.children),
      ),
    })),
  };
};

const parseTextBlock = (contents: PhrasingContent[]): TextBlock[] => {
  return contents
    .map((content) => {
      if (content.type === "text") {
        return {
          type: "plain",
          text: content.value,
        };
      }
      if (content.type === "strong") {
        return {
          type: "strong",
          text: parseTextBlock(content.children)[0].text,
        };
      }
      if (content.type === "emphasis") {
        return {
          type: "italic",
          text: parseTextBlock(content.children)[0].text,
        };
      }
      if (content.type === "link") {
        return {
          type: "link",
          text: parseTextBlock(content.children)[0].text,
          url: content.url,
        };
      }
      if (content.type === "inlineCode") {
        return {
          type: "inlineCode",
          text: content.value,
        };
      }
    })
    .filter((block) => block) as TextBlock[];
};

const parseRawContent = (rawContent: Content[]): MarkdownBlock[] => {
  const result: MarkdownBlock[] = [];

  rawContent.forEach((content) => {
    if (content.type === "heading") {
      result.push({
        type: "heading",
        children: parseTextBlock(content.children),
        depth: content.depth,
      });
    }

    if (content.type === "paragraph") {
      result.push(parseParagraphContent(content));
    }

    if (content.type === "list") {
      result.push(parseListContent(content));
    }

    if (content.type === "code") {
      result.push({
        type: "code",
        lang: content.lang ?? undefined,
        text: content.value,
      });
    }

    if (content.type === "blockquote") {
      result.push({
        type: "quote",
        children: parseTextBlock(
          (
            content.children.filter(
              (c) => c.type === "paragraph",
            )[0] as Paragraph
          ).children,
        ),
      });
    }

    if (content.type === "thematicBreak") {
      result.push({
        type: "thematicBreak",
      });
    }
  });

  return result;
};

export const parseMarkdown = (raw: string) => {
  const rawMDAST = unified().use(remarkParse).use(remarkFrontmatter).parse(raw);
  const [rawFrontmatter, ...rawContent] = rawMDAST.children;
  const frontmatter = parseFrontmatter(rawFrontmatter as Yaml);
  const content = parseRawContent(rawContent);

  return { frontmatter, content };
};
