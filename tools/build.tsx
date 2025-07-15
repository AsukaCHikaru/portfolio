import { readFileSync } from "node:fs";

import { resolve } from "path";
import type { ReactNode } from "react";
import ReactDOMServer from "react-dom/server";
import { ArchivePageContent } from "../src/pages/blog/ArchivePage";
import { getAbout, getBlogPostList } from "./contentServices";
import { PostPageContent } from "../src/components/PostPageContent";
import { ResumePage } from "../src/pages/resume/ResumePage";
import { FrontPageContent } from "../src/pages/frontpage/FrontPage";
import { buildRssFeed } from "./rss";
import type { FurtherReading } from "../src/types";

const writeFile = (
  element: ReactNode,
  path: string,
  staticProps: string,
  metadata: string,
) => {
  let template = readFileSync(
    resolve(import.meta.dir, "..", "index.html"),
    "utf-8",
  );

  try {
    const html = ReactDOMServer.renderToString(<div>{element}</div>);
    const escapedStaticProps = staticProps
      .replace(/\u2028/g, "\\u2028") // Line separator
      .replace(/\u2029/g, "\\u2029") // Paragraph separator
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026");

    template = template
      .replace(
        "</head>",
        `<script>window.__STATIC_PROPS__ = ${escapedStaticProps}</script></head>`,
      )
      .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

    template = template.replace("<head>", `<head>${metadata}`);

    if (process.env.PHASE === "dev") {
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
    }

    Bun.write(`./dist${path}/index.html`, template);
  } catch (error) {
    console.error("Error writing file:", error);
  }
};

const generateMetadata = (title: string, description: string) => {
  return `
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="author" content="Asuka Wang">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
  `;
};

const buildBlog = async () => {
  const lastCommitDate = await getLastCommitDate();
  const postList = await getBlogPostList();
  try {
    writeFile(
      <ArchivePageContent
        postList={postList.map((post) => post.metadata)}
        categoryFilter={null}
      />,
      "/blog",
      JSON.stringify({
        blog: { postList: postList.map((post) => post.metadata) },
        lastUpdated: lastCommitDate,
      }),
      generateMetadata("Blog | Asuka Wang", "Asuka Wang's blog"),
    );
    postList.forEach((post) => {
      writeFile(
        <PostPageContent metadata={post.metadata} content={post.content} />,
        `/blog/${post.metadata.pathname}`,
        JSON.stringify({ blog: { post }, lastUpdated: lastCommitDate }),
        generateMetadata(
          `${post.metadata.title} | Asuka Wang`,
          post.metadata.description,
        ),
      );
    });
  } catch (error) {
    console.error("Error building blog:", error);
  }
};

const buildAboutPage = async () => {
  const lastCommitDate = await getLastCommitDate();
  const about = await getAbout();
  writeFile(
    <PostPageContent metadata={about.metadata} content={about.content} />,
    "/about",
    JSON.stringify({ about, lastUpdated: lastCommitDate }),
    generateMetadata("Asuka Wang", "About Asuka Wang"),
  );
};

const buildResumePage = async () => {
  writeFile(
    <ResumePage />,
    "/resume",
    "",
    generateMetadata("Resume | Asuka Wang", "Asuka Wang's resume"),
  );
};

const buildFrontPage = async () => {
  const lastCommitDate = await getLastCommitDate();
  const postList = await getBlogPostList();
  const lastPost = postList[0];
  const sameCategoryPosts = postList.filter(
    (post) => post.metadata.category === lastPost.metadata.category,
  );
  const furtherReading: FurtherReading =
    sameCategoryPosts.length > 1
      ? {
          type: "category",
          posts: [...sameCategoryPosts].slice(0, 5),
        }
      : {
          type: "recent",
          posts: [...postList].slice(1, 6),
        };
  const categories = [...postList]
    .reduce(
      (acc, post, _, array) => {
        if (acc.some((c) => c.name === post.metadata.category)) {
          return acc;
        }
        const category = post.metadata.category;
        const count = array.filter(
          (p) => p.metadata.category === category,
        ).length;
        return [...acc, { name: category, count }];
      },
      [] as { name: string; count: number }[],
    )
    .sort((a, b) => b.count - a.count);
  const featuredReading = postList.find((p) => p.metadata.featured);

  writeFile(
    <FrontPageContent
      leadStory={lastPost}
      lastUpdated={lastCommitDate}
      furtherReading={furtherReading}
      categories={categories}
      featuredReading={featuredReading}
    />,
    "/",
    JSON.stringify({
      frontPage: {
        leadStory: lastPost,
        furtherReading,
        categories,
        featuredReading,
      },
      lastUpdated: lastCommitDate,
    }),
    generateMetadata("Asuka Wang", "Asuka Wang's personal website"),
  );
};

const writeFontCss = async () => {
  const file = await Bun.file("./src/fonts.css").text();
  const replaced = file.replace(/\.\.\/public/g, ".");
  Bun.write("./dist/fonts.css", replaced);
};

const writeData = async () => {
  const postList = await getBlogPostList();
  const about = await getAbout();
  await Bun.write(
    "./dist/data.json",
    JSON.stringify(
      {
        postList,
        about,
      },
      null,
      2,
    ),
  );
};

const runSubfont = async () => {
  const postList = await getBlogPostList();
  const cjkPosts = postList.filter(
    (post) => post.metadata.language !== "en-US",
  );
  for (const post of cjkPosts) {
    const filePath = resolve(
      import.meta.dir,
      "..",
      "dist",
      "blog",
      post.metadata.pathname,
      "index.html",
    );
    await Bun.$`subfont ${filePath} -i --root ./dist`;
  }
};

const getLastCommitDate = async () => {
  const output = await Bun.$`git log -1 --format=%cd --date=short`.text();
  return output.trim();
};

export const build = async () => {
  await Bun.$`rm -rf ./dist`;
  await buildBlog();
  await buildFrontPage();
  await buildAboutPage();
  await buildResumePage();
  await writeFontCss();
  await writeData();
  await buildRssFeed();
  await Bun.$`cp -r ./public/fonts ./dist`;
  await Bun.$`mkdir -p ./dist/public`;
  await Bun.$`cp -r ./public/images ./dist/public`;
  await Bun.$`cp -r ./public/asuka-wang_resume_ja.pdf ./dist`;

  try {
    await Bun.build({
      entrypoints: [
        "./src/index.tsx",
        "./src/style.css",
        "./node_modules/modern-normalize/modern-normalize.css",
      ],
      outdir: "./dist",
      naming: { entry: "[name].[ext]", asset: "[name].[ext]" },
      target: "browser",
      minify: process.env.PHASE === "prod",
      sourcemap: process.env.PHASE === "prod" ? "none" : "inline",
    });
  } catch (error) {
    console.error("Build failed:", error);
  }

  if (process.env.PHASE === "prod") {
    await runSubfont();
  }
};

await build();
