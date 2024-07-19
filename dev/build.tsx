import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "path";
import ReactDOMServer from "react-dom/server";
import BlogPostListPage from "../src/pages/blog/BlogPostListPage";
import { getBlogPost, getBlogPostList } from "../src/services/markdownService";
import { Layout } from "../src/components/Layout";
import type { ReactNode } from "@tanstack/react-router";
import { parseMarkdown } from "./markdownParser";
import BlogPostPage from "../src/pages/blog/BlogPostPage";

const markdownFolderPath = resolve(import.meta.dir, "..", "public", "contents");

const writeFile = (element: ReactNode, path: string) => {
  let template = readFileSync(
    resolve(import.meta.dir, "..", "index.html"),
    "utf-8",
  );

  try {
    const html = ReactDOMServer.renderToString(<Layout>{element}</Layout>);
    template = template.replace(
      '<div id="root"></div>',
      `<div id="root">${html}</div>`,
    );
    Bun.write(`./dist${path}/index.html`, template);
  } catch (error) {}
};

const buildBlog = async () => {
  const list = await getBlogPostList();
  writeFile(<BlogPostListPage.Element blogPostList={list} />, "/blog");

  const blogFiles = readdirSync(markdownFolderPath);
  blogFiles.forEach(async (filePath) => {
    const file = readFileSync(resolve(markdownFolderPath, filePath), "utf-8");
    const { meta } = parseMarkdown(file);
    const post = await getBlogPost(meta.pathname);
    console.log(`Writing post ${meta.title}`);
    if (post) {
      writeFile(
        <BlogPostPage.Element content={post.content} meta={post.meta} />,
        `/blog/${meta.pathname}`,
      );
    }
  });
};
const build = () => {
  buildBlog();

  Bun.build({
    entrypoints: ["./src/main.tsx"],
    outdir: "./dist",
  });
};

build();
