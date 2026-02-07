import { resolve } from "node:path";
import { checkSymlinkExist } from "./contentUtils";
import { readdirSync, readFileSync } from "node:fs";
import { amp } from "./markdownParser";
import type { VideoGameIndexList } from "../src/types";

const videoGameIndexFolderPath = "./symbolicLinks/list/videoGameIndexFolder";
const indexFilePath = "./symbolicLinks/list/videoGameIndex";

export const getVideoGameIndexList = () => {
  checkSymlinkExist(videoGameIndexFolderPath);
  checkSymlinkExist(indexFilePath);

  const files = readdirSync(videoGameIndexFolderPath);
  const rated = files
    .map((file) => {
      const fileContent = readFileSync(
        resolve(videoGameIndexFolderPath, file),
        "utf-8",
      );
      const { frontmatter } = amp.parse(fileContent);
      return {
        title: frontmatter.portfolio_list_game_title,
        developer: frontmatter.developer,
        publisher: frontmatter.publisher,
        released: frontmatter.released,
        played: new Date(
          frontmatter.finished || frontmatter.started,
        ).toLocaleDateString("en-US", {
          year: "numeric",
        }),
        platform: frontmatter.portfolio_list_play_platform,
        reviewUrl: frontmatter.portfolio_list_game_review_url,
        rating: frontmatter.rating,
      } satisfies VideoGameIndexList[number];
    })
    .filter((frontmatter) => frontmatter.rating !== undefined)
    .sort((prev, next) => Number(next.released) - Number(prev.released));

  const indexFile = readFileSync(resolve(indexFilePath), "utf-8");
  const { frontmatter } = amp.parse(indexFile);

  return {
    name: frontmatter.portfolio_list_name,
    description: frontmatter.portfolio_list_description,
    pathname: frontmatter.portfolio_list_pathname,
    list: rated,
  };
};
