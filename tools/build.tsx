import { readFileSync } from "node:fs";
import { resolve } from "path";
import type { ReactNode } from "react";
import ReactDOMServer from "react-dom/server";
import { ArchivePageContent } from "../src/pages/blog/ArchivePage";
import { getBlogPostList } from "./contentServices";
import { PostPageContent } from "../src/pages/blog/PostPage";

const writeFile = (element: ReactNode, path: string, staticProps: string) => {
  let template = readFileSync(
    resolve(import.meta.dir, "..", "index.html"),
    "utf-8",
  );

  try {
    const html = ReactDOMServer.renderToString(<div>{element}</div>);
    template = template.replace(
      '<div id="root"></div>',
      `<div id="root">${html}</div><script>window.__STATIC_PROPS__ = ${staticProps}</script>`,
    );
    Bun.write(`./dist${path}/index.html`, template);
  } catch (error) {}
};

const buildBlog = async () => {
  const postList = await getBlogPostList();
  writeFile(
    <ArchivePageContent postList={postList.map((post) => post.metadata)} />,
    "/blog",
    JSON.stringify({ postList: postList.map((post) => post.metadata) }),
  );

  postList.forEach((post) => {
    writeFile(
      <PostPageContent metadata={post.metadata} content={post.content} />,
      `/blog/${post.metadata.pathname}`,
      JSON.stringify({ post }),
    );
  });
};

const buildFrontPage = async () => {
  const postList = await getBlogPostList();
  const lastPost = postList[0];
  writeFile(
    <PostPageContent metadata={lastPost.metadata} content={lastPost.content} />,
    "/",
    JSON.stringify({ post: lastPost }),
  );
};

const build = async () => {
  await buildBlog();
  await buildFrontPage();

  try {
    await Bun.build({
      entrypoints: ["./src/index.tsx"],
      outdir: "./dist",
      naming: { entry: "[name].[ext]", asset: "[name].[ext]" },
      target: "browser",
      minify: false,
      sourcemap: "inline",
    });
  } catch (error) {
    console.error("Build failed:", error);
  }
};

await Bun.$`rm -rf ./dist`;
await build();
