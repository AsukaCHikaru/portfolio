import {
  lstatSync,
  readdirSync,
  copyFileSync,
  realpathSync,
  readFileSync,
  renameSync,
  rmSync,
  existsSync,
} from "fs";
import { resolve } from "path";

const sourceBlogFolderPath = realpathSync("blogFolderSymbolicLink");

const localBlogFolderPath = resolve(
  process.cwd(),
  "public",
  "contents",
  "blog"
);

const checkSymlinkExist = () => {
  if (existsSync(localBlogFolderPath)) {
    return;
  }
  console.log("Blog folder symbolic link not found");
  process.exit(0);
};

const getMarkdownFileList = (blogFolderPath: string) => {
  const markdownFiles = readdirSync(
    resolve(process.cwd(), blogFolderPath)
  ).filter(
    (file) =>
      lstatSync(resolve(blogFolderPath, file)).isFile() && file.endsWith(".md")
  );
  return markdownFiles;
};

const clearFolder = (path: string) =>
  readdirSync(path).forEach((file) => rmSync(resolve(path, file)));
const copyFiles = (pathFrom: string, pathTo: string) =>
  getMarkdownFileList(pathFrom).forEach((file) => {
    copyFileSync(resolve(pathFrom, file), resolve(pathTo, file));
  });

const renameLocalBlogFiles = (blogFolderPath: string) => {
  getMarkdownFileList(blogFolderPath).forEach((file) => {
    const content = readFileSync(resolve(blogFolderPath, file), "utf8");
    const postPath = /pathname:\s(.+)/.exec(content)?.[1];
    if (!postPath) {
      return;
    }
    renameSync(
      resolve(blogFolderPath, file),
      resolve(blogFolderPath, `${postPath}.md`)
    );
  });
};

checkSymlinkExist();
clearFolder(localBlogFolderPath);
console.log("Copying post files...");
copyFiles(sourceBlogFolderPath, localBlogFolderPath);
console.log("Renaming post files...");
renameLocalBlogFiles(localBlogFolderPath);
console.log("Completed!");
