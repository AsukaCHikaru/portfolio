import type { CodeBlock } from "@asukawang/amp";
import js from "@shikijs/langs/javascript";
import ts from "@shikijs/langs/typescript";
import tsx from "@shikijs/langs/tsx";
import json from "@shikijs/langs/json";
import csharp from "@shikijs/langs/csharp";
import css from "@shikijs/langs/css";
import gruvBoxLightSoft from "@shikijs/themes/gruvbox-light-soft";
import {
  createHighlighterCoreSync,
  createJavaScriptRegexEngine,
  type StringLiteralUnion,
} from "shiki";

export const Code = ({ block }: { block: CodeBlock }) => {
  const shiki = createHighlighterCoreSync({
    themes: [gruvBoxLightSoft],
    langs: [js, ts, json, tsx, csharp, css],
    engine: createJavaScriptRegexEngine(),
  });

  const html = shiki.codeToHtml(block.body, {
    lang: block.lang as StringLiteralUnion<
      "javascript" | "typescript" | "tsx" | "json" | "csharp" | "css",
      string
    >,
    theme: "gruvbox-light-soft",
  });

  shiki.dispose();

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
