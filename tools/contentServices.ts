import { readdir } from "node:fs/promises";
import { parsePost } from "./contentUtils";

const BLOG_FOLDER_PATH = import.meta.dir + "/../public/contents/blog";
const ABOUT_PATH = import.meta.dir + "/../public/contents/about/about-page.md";
const LIST_MUSIC_AWARDS_PATH =
  import.meta.dir + "/../public/contents/list/musicAwards.json";
const LIST_VIDEO_GAME_INDEX_PATH =
  import.meta.dir + "/../public/contents/list/videoGameIndex.json";

export const getBlogPostList = async () => {
  const files = await readdir(BLOG_FOLDER_PATH);

  return Promise.all(
    files.map(async (file) => await parsePost(BLOG_FOLDER_PATH + "/" + file)),
  ).then((posts) =>
    posts.sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() -
        new Date(a.metadata.publishedAt).getTime(),
    ),
  );
};

export const getAbout = async () => parsePost(ABOUT_PATH);

export const getList = async () => {
  const musicAwards = await import(LIST_MUSIC_AWARDS_PATH);
  const videoGameIndex = await import(LIST_VIDEO_GAME_INDEX_PATH);

  return { musicAwards, videoGameIndex };
};
