import { readFileSync } from "node:fs";

import { resolve } from "path";
import type { ReactNode } from "react";
import ReactDOMServer from "react-dom/server";
import { ArchivePageContent } from "../src/pages/blog/ArchivePage";
import { getAbout, getBlogPostList, getList } from "./contentServices";
import { PostPageContent } from "../src/components/PostPageContent";
import { ResumePage } from "../src/pages/resume/ResumePage";
import { FrontPageContent } from "../src/pages/frontpage/FrontPage";
import { buildRssFeed } from "./rss";
import type { FurtherReading, SiteData } from "../src/types";
import { ListPageContent } from "../src/pages/list/ListPage";
import { MusicAwardsListPageContent } from "../src/pages/list/MusicAwardsListPage";
import { VideoGameIndexListPageContent } from "../src/pages/list/VideoGameIndexListPage";
import { BucketListPageContent } from "../src/pages/list/BucketListPage";

const writeFile = (
  element: ReactNode,
  path: string,
  metadata: string,
  pageData?: SiteData,
) => {
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

    template = template.replace("<head>", `<head>${metadata}`);

    if (pageData) {
      const json = JSON.stringify(pageData).replace(/<\//g, "<\\/");
      template = template.replace(
        "</head>",
        `<script type="application/json" id="__DATA__">${json}</script>\n</head>`,
      );
      Bun.write(`./dist${path}/data.json`, JSON.stringify(pageData));
    }

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
  const postList = await getBlogPostList();
  try {
    writeFile(
      <ArchivePageContent
        postList={postList.map((post) => post.metadata)}
        categoryFilter={null}
      />,
      "/blog",
      generateMetadata("Blog | Asuka Wang", "Asuka Wang's blog"),
      {
        section: "blog_archive",
        data: {
          postList: postList.map((post) => ({ metadata: post.metadata })),
        },
      },
    );
    postList.forEach((post) => {
      const path = `/blog/${post.metadata.pathname}`;
      writeFile(
        <PostPageContent metadata={post.metadata} content={post.content} />,
        path,
        generateMetadata(
          `${post.metadata.title} | Asuka Wang`,
          post.metadata.description,
        ),
        {
          section: "blog",
          data: { metadata: post.metadata, content: post.content },
        },
      );
    });
  } catch (error) {
    console.error("Error building blog:", error);
  }
};

const buildAboutPage = async () => {
  const about = await getAbout();
  writeFile(
    <PostPageContent metadata={about.metadata} content={about.content} />,
    "/about",
    generateMetadata("Asuka Wang", "About Asuka Wang"),
    { section: "about", data: about },
  );
};

const buildResumePage = async () => {
  writeFile(
    <ResumePage />,
    "/resume",
    generateMetadata("Resume | Asuka Wang", "Asuka Wang's resume"),
  );
};

const buildFrontPage = async () => {
  const lastCommitDate = await getLastCommitDate();
  const postList = await getBlogPostList();
  const lastPost = postList[0];
  const sameCategoryPosts = postList.filter(
    (post) =>
      post.metadata.category === lastPost.metadata.category &&
      post.metadata.pathname !== lastPost.metadata.pathname,
  );
  const furtherReading: FurtherReading =
    sameCategoryPosts.length > 0
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
    generateMetadata("Asuka Wang", "Asuka Wang's personal website"),
    {
      section: "front_page",
      data: {
        leadStory: lastPost,
        lastUpdated: lastCommitDate,
        furtherReading,
        categories,
        featuredReading,
      },
    },
  );
};

const buildList = async () => {
  const { musicAwards, videoGameIndex, bucketList } = await getList();

  writeFile(
    <ListPageContent
      musicAwards={musicAwards}
      videoGameIndex={videoGameIndex}
      bucketList={bucketList}
    />,
    "/list",
    generateMetadata("List | Asuka Wang", "Asuka Wang's lists"),
    { section: "list", data: { musicAwards, videoGameIndex, bucketList } },
  );

  writeFile(
    <MusicAwardsListPageContent musicAwards={musicAwards} />,
    "/list/music-awards",
    generateMetadata(
      `${musicAwards.name} | Asuka Wang`,
      musicAwards.description,
    ),
    { section: "list_music_awards", data: { musicAwards } },
  );

  writeFile(
    <VideoGameIndexListPageContent videoGameIndex={videoGameIndex} />,
    "/list/video-game-index",
    generateMetadata(
      `${videoGameIndex.name} | Asuka Wang`,
      videoGameIndex.description,
    ),
    { section: "list_video_game_index", data: { videoGameIndex } },
  );

  writeFile(
    <BucketListPageContent bucketList={bucketList} />,
    "/list/bucket-list",
    generateMetadata(`${bucketList.name} | Asuka Wang`, bucketList.description),
    { section: "list_bucket_list", data: { bucketList } },
  );
};

const writeFontCss = async () => {
  const file = await Bun.file("./src/fonts.css").text();
  const replaced = file.replace(/\.\.\/public/g, ".");
  Bun.write("./dist/fonts.css", replaced);
};

const writeData = async () => {
  const lastCommitDate = await getLastCommitDate();
  const postList = await getBlogPostList();
  const about = await getAbout();
  const { videoGameIndex, musicAwards, bucketList } = await getList();
  await Bun.write(
    "./dist/data.json",
    JSON.stringify(
      {
        lastCommitDate,
        postList,
        about,
        list: {
          videoGameIndex,
          musicAwards,
          bucketList,
        },
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
  await buildList();
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
