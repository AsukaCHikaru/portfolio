export const parseMarkdownFrontmatter = (buf: Buffer) => {
  const string = buf.toString("utf-8");
  const frontmatterStarterRemoved = string.split(/\n/).slice(1);
  const frontmatterEnderIndex = frontmatterStarterRemoved.findIndex(
    (item) => item === "---",
  );
  const frontmatterItemList = frontmatterStarterRemoved.slice(
    0,
    frontmatterEnderIndex,
  );

  const map = new Map();

  frontmatterItemList.forEach((item) => {
    const match = /^(\w+):\s(.+)$/.exec(item);
    if (match === null) {
      return;
    }
    const [_, key, value] = match;
    map.set(key, value);
  });

  return Object.fromEntries(map);
};
