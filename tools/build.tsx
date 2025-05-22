import { readFileSync } from "node:fs";

import { resolve } from "path";
import type { ReactNode } from "react";
import ReactDOMServer from "react-dom/server";
import { ArchivePageContent } from "../src/pages/blog/ArchivePage";
import { getAbout, getBlogPostList } from "./contentServices";
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
    template = template.replace(
      "</body>",
      `
<script>
  // Hot reload client script
  (function() {
    console.log("Hot reload client initialized");
    
    // First get the WebSocket port from the server
      const ws = new WebSocket('ws://localhost:3001');
      
      ws.onopen = () => {
        console.log("Hot reload WebSocket connected on port", 3001);
      };
      
      ws.onclose = () => {
        console.log("Hot reload WebSocket disconnected. Attempting to reconnect in 2s...");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      };
      
      ws.onerror = (error) => {
        console.error("Hot reload WebSocket error:", error);
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "reload") {
            console.log("Hot reload triggered, refreshing page...");
            window.location.reload();
          }
        } catch (e) {
          console.error("Error parsing hot reload message:", e);
        }
      };
  })();
</script>
</body>`,
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

const buildAboutPage = async () => {
  const about = await getAbout();
  writeFile(
    <PostPageContent metadata={about.metadata} content={about.content} />,
    "/about",
    JSON.stringify({ about }),
  );
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

export const build = async () => {
  await Bun.$`rm -rf ./dist`;
  await buildBlog();
  await buildFrontPage();
  await buildAboutPage();
  await Bun.$`cp -r ./public/fonts ./dist`;

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

await build();
