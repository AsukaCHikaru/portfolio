import { resolve } from "node:path";
import { checkSymlinkExist } from "./contentUtils";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { amp } from "./markdownParser";

const videoGameIndexFolderPath = "./symbolicLinks/list/videoGameIndexFolder";
const indexFilePath = "./symbolicLinks/list/videoGameIndex";
const outputPath = "./public/contents/list/videoGameIndex.json";

const run = () => {
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
        finished: new Date(
          frontmatter.finished || frontmatter.started,
        ).toLocaleDateString("en-US", {
          year: "numeric",
        }),
        platform: frontmatter.portfolio_list_play_platform,
        review: frontmatter.portfolio_list_game_review_url,
        rating: frontmatter.rating,
      };
    })
    .filter((frontmatter) => frontmatter.rating !== undefined)
    .sort((prev, next) => Number(next.released) - Number(prev.released));

  const indexFile = readFileSync(resolve(indexFilePath), "utf-8");
  const { frontmatter } = amp.parse(indexFile);

  writeFileSync(
    outputPath,
    JSON.stringify(
      {
        name: frontmatter.portfolio_list_name,
        description: frontmatter.portfolio_list_description,
        pathname: frontmatter.portfolio_list_pathname,
        list: rated,
      },
      null,
      2,
    ),
  );
  console.log(`Video game index data written to JSON file ${outputPath}`);
};

if (import.meta.main) {
  run();
}
