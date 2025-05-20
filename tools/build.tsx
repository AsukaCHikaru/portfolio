import { readFileSync } from "node:fs";
import { resolve } from "path";
import type { ReactNode } from "react";
import ReactDOMServer from "react-dom/server";
import { ArchivePage } from "../src/pages/blog/ArchivePage";
import { getBlogPostList } from "./contentServices";
import { PostPage } from "../src/pages/blog/PostPage";

const writeFile = (element: ReactNode, path: string) => {
  let template = readFileSync(
    resolve(import.meta.dir, "..", "index.html"),
    "utf-8",
  );

  try {
    const html = ReactDOMServer.renderToString(<div>{element}</div>);
    template = template.replace(
      '<div id="root"></div>',
      `<div id="root">${html}</div>`,
    );
    Bun.write(`./dist${path}/index.html`, template);
  } catch (error) {}
};

const buildBlog = async () => {
  const postList = await getBlogPostList();
  writeFile(
    <ArchivePage postList={postList.map((post) => post.metadata)} />,
    "/blog",
  );

  postList.forEach((post) => {
    writeFile(
      <PostPage postMetadata={post.metadata} content={post.content} />,
      `/blog/${post.metadata.pathname}`,
    );
  });
};

const build = () => {
  buildBlog();

  Bun.build({ entrypoints: ["./src/main.tsx"], outdir: "./dist" });
};

build();
