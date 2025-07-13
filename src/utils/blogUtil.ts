import type { PostMetaData } from "../types";

type RowSize = 4 | 8 | 12 | 16;

export type PostTile = {
  size: RowSize;
  position: 1 | 5 | 9 | 13;
  post: PostMetaData;
};

const TILE_SIZE_TITLE_WORD_COUNT = 40;
const TILE_SIZE_DESCRIPTION_WORD_COUNT = 140;

export const generateArchiveTileList = (
  postList: PostMetaData[],
): PostTile[][] => {
  if (postList.length === 0) {
    return [];
  }
  if (postList.length < 4) {
    return [
      postList.reduce((acc, cur) => {
        return [
          ...acc,
          {
            post: cur,
            size: getTileSize(cur),
            position: getSizeSum(acc) + 1,
          } as PostTile,
        ];
      }, [] as PostTile[]),
    ];
  }

  const candidates = [...postList].slice(0, 4).reduce((acc, cur) => {
    return [
      ...acc,
      {
        post: cur,
        size: getTileSize(cur),
        position: getSizeSum(acc) + 1,
      } as PostTile,
    ];
  }, [] as PostTile[]);

  const thisRow = candidates.reduce(
    (acc, cur) => {
      if (acc.space === 0) {
        return acc;
      }
      if (acc.space < cur.size) {
        const smallestItem = [...acc.tiles].sort((a, b) => a.size - b.size)[0];
        return {
          space: 0,
          tiles: acc.tiles.reduce((a, c, _, array) => {
            return [
              ...a,
              c.post.pathname === smallestItem.post.pathname
                ? ({
                    post: smallestItem.post,
                    size:
                      array.length === 1
                        ? 16
                        : getTileSize(smallestItem.post) + 4,
                    position: getSizeSum(a) + 1,
                  } as PostTile)
                : ({
                    ...c,
                    position: getSizeSum(a) + 1,
                  } as PostTile),
            ];
          }, [] as PostTile[]),
        };
      }
      return {
        space: acc.space - cur.size,
        tiles: [...acc.tiles, cur] as PostTile[],
      };
    },
    {
      space: 16,
      tiles: [] as PostTile[],
    },
  );

  return [
    thisRow.tiles,
    ...generateArchiveTileList([...postList].slice(thisRow.tiles.length)),
  ];
};

const getTileSize = (post: PostMetaData): RowSize => {
  const baseSize = 4;
  const thumbnailSize = post.thumbnail ? 4 : 0;
  const titleSize =
    post.title.length > TILE_SIZE_TITLE_WORD_COUNT ||
    (post.description &&
      post.description.length > TILE_SIZE_DESCRIPTION_WORD_COUNT &&
      post.thumbnailDirection === "landscape")
      ? 4
      : 0;

  return (baseSize + thumbnailSize + titleSize) as RowSize;
};
const getSizeSum = (tiles: PostTile[]): number =>
  tiles.reduce((acc, cur) => acc + cur.size, 0);
