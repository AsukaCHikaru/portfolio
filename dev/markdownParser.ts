export const parseMarkdownFrontmatter = (buf: Buffer) => {
  const string = buf.toString("utf-8");
  const frontmatterStarterRemoved = string.slice(4);
  const frontmatterEnderIndex = frontmatterStarterRemoved.indexOf("---");
  const frontmatterString = frontmatterStarterRemoved.slice(
    0,
    frontmatterEnderIndex,
  );

  const map = new Map();
};
