import { lstatSync, readdirSync, readFileSync, renameSync } from "fs";
import { resolve } from "path";
import { $ } from "bun";
import { checkSymlinkExist } from "./contentUtils";

const sourceBlogFolderPath = "./symbolicLinks/blog/";
const localBlogFolderPath = "./public/contents/blog/";
const sourceBlogImageFolderPath = "./symbolicLinks/blogImage/";
const localBlogImageFolderPath = "./public/images/blog/";

const sourceAboutPagePath = "./symbolicLinks/about";
const localAboutPagePath = "./public/contents/about/";

const getMarkdownFileList = (blogFolderPath: string) => {
  const markdownFiles = readdirSync(
    resolve(process.cwd(), blogFolderPath),
  ).filter(
    (file) =>
      lstatSync(resolve(blogFolderPath, file)).isFile() && file.endsWith(".md"),
  );
  return markdownFiles;
};

const renameLocalBlogFiles = (blogFolderPath: string) => {
  getMarkdownFileList(blogFolderPath).forEach((file) => {
    const content = readFileSync(resolve(blogFolderPath, file), "utf8");
    const postPath = /pathname:\s(.+)/.exec(content)?.[1];
    if (!postPath) {
      return;
    }
    renameSync(
      resolve(blogFolderPath, file),
      resolve(blogFolderPath, `${postPath}.md`),
    );
  });
};

const copyBlog = async () => {
  console.log("Copying blog post files...");
  checkSymlinkExist(sourceBlogFolderPath);
  await $`rm -rf ${localBlogFolderPath}`;
  await $`mkdir -p ${localBlogFolderPath}`;
  await $`find -P ${sourceBlogFolderPath} -maxdepth 1 -type f -name '*.md' -exec cp {} ${localBlogFolderPath} \;`;
  await $`find -P ${sourceBlogFolderPath} -maxdepth 1 -type f -name '*.md' -exec cp {} ${localBlogFolderPath} \;`;
  renameLocalBlogFiles(localBlogFolderPath);

  // images
  checkSymlinkExist(sourceBlogImageFolderPath);
  await $`rm -rf ${localBlogImageFolderPath}`;
  await $`mkdir -p ${localBlogImageFolderPath}`;
  await $`find -P ${sourceBlogImageFolderPath} -maxdepth 1 -type f -exec cp {} ${localBlogImageFolderPath} \;`;
  console.log("Blog post files copied successfully.");
};

const copyAbout = async () => {
  console.log("Copying about page file...");
  checkSymlinkExist(sourceAboutPagePath);
  await $`rm -rf ${localAboutPagePath}`;
  await $`mkdir -p ${localAboutPagePath}`;
  await $`cp ${sourceAboutPagePath} ${localAboutPagePath}/about-page.md`;
  console.log("About page file copied successfully.");
};

if (import.meta.main) {
  await copyBlog();
  await copyAbout();
}
