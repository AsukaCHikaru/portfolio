import type { PostMetaData } from "../types";

type RowSize = 4 | 8 | 12 | 16;

export type PostTile = {
  size: RowSize;
  post: PostMetaData;
};

export const generateArchiveTileList = (
  postList: PostMetaData[],
): PostTile[][] => {
  if (postList.length === 0) {
    return [];
  }
  if (postList.length < 4) {
    return [postList.map((post) => ({ size: 4, post }))];
  }

  const thisRow = [...postList].slice(0, 4).map((post) => ({
    size: 4,
    post,
  })) satisfies PostTile[];

  return [thisRow, ...generateArchiveTileList([...postList].slice(4))];
};
