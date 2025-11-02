import { Amp, type CustomBlock } from "@asukawang/amp";

const youtubeRegexp = new RegExp(
  /^!\[\]\(https:\/\/www\.youtube\.com\/watch\?v=(.+?)\)/,
);
export type YoutubeBlock = CustomBlock<
  "youtube",
  {
    id: string;
    start?: string;
  }
>;
const youtubeParser = (input: string): YoutubeBlock => {
  const match = input.match(youtubeRegexp);
  if (!match) {
    throw new Error("Invalid match");
  }
  const url = new URL(`https://www.youtube.com/watch?v=${match[1]}`);
  const id = url.searchParams.get("v");
  if (!id) {
    throw new Error("Invalid YouTube video ID");
  }
  const start = url.searchParams.get("t") ?? undefined;
  return {
    type: "custom",
    customType: "youtube",
    id,
    start,
  };
};

export const amp = new Amp().extend([youtubeRegexp, youtubeParser]);
export type Block = ReturnType<typeof amp.parse>["blocks"][number];
