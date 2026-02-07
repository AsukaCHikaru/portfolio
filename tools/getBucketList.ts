import { existsSync, readFileSync } from "fs";
import type { BucketList, List } from "../src/types";
import { amp } from "./markdownParser";

const sourcePath = "./symbolicLinks/list/bucketList";

export const getBucketList = () => {
  if (!existsSync(sourcePath)) {
    console.log(`Source file at ${sourcePath} does not exist.`);
    process.exit(0);
  }

  const content = readFileSync(sourcePath, "utf8");
  const { frontmatter } = amp.parse(content);

  // Remove frontmatter
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---\n/, "");
  const lines = withoutFrontmatter.split(/\n/);

  const grouped: Record<string, BucketList[number]["tasks"]> = {};
  let currentCategory = "";
  lines.forEach((line) => {
    if (line.startsWith("#")) {
      currentCategory = line.replace(/#\s/, "");
      grouped[currentCategory] = [];
    } else {
      const match = line.match(
        /^-\s\[([\sx])\]\s([\s\S]+?)\s\d{4}\/\d{1,2}\/\d{1,2}(?:\s(\d{4}\/\d{1,2}\/\d{1,2}))?/,
      );
      if (!match) {
        throw new Error();
      }
      const [, check, task, doneDate] = match;
      grouped[currentCategory] = [
        ...grouped[currentCategory],
        {
          isDone: check === "x",
          doneDate,
          value: amp.parse(task).blocks,
        },
      ];
    }
  });

  const list = {
    name: frontmatter.portfolio_list_name,
    description: frontmatter.portfolio_list_description,
    pathname: frontmatter.portfolio_list_pathname,
    list: Object.entries(grouped).map(([category, tasks]) => ({
      category,
      tasks,
    })),
  } satisfies List<BucketList>;

  return list;
};
