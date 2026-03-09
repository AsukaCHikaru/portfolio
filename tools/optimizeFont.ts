import { resolve } from "path";
import { getBlogPostList } from "./contentServices";

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

await runSubfont();
