import { mkdirSync, readFileSync } from "node:fs";
import * as fontkit from "fontkit";
import sharp from "sharp";

const TITLE_FONT_PATH = "./public/fonts/NotoSerifJP_Bold.woff2";
const TEMPLATE_PATH = "./tools/opg_template.svg";
const OUTPUT_DIR = "./dist/opg";

const TITLE_FONT_SIZE = 90;
const LINE_HEIGHT = 100;
const WIDTH = 1200;
const PADDING = 60;
const CONTENT_MAX_WIDTH = WIDTH - PADDING * 2;
const FIRST_BASELINE_Y = PADDING + TITLE_FONT_SIZE;
const FONT_COLOR = "#27221F";

const font = fontkit.openSync(TITLE_FONT_PATH) as fontkit.Font;
const scale = TITLE_FONT_SIZE / font.unitsPerEm;

const isWiderThanContainer = (input: string) =>
  font.layout(input).positions.reduce((sum, pos) => sum + pos.xAdvance, 0) *
    scale >
  CONTENT_MAX_WIDTH;

const wrapTitle = (text: string) =>
  text.split(" ").reduce((lines, word) => {
    const last = lines.at(-1);
    const newLine = last ? `${last} ${word}` : word;
    return last && isWiderThanContainer(newLine)
      ? [...lines, word]
      : [...lines.slice(0, -1), newLine];
  }, [] as string[]);

const renderLine = (line: string, baselineY: number) => {
  const run = font.layout(line);
  const paths: string[] = [];
  let penX = 0;

  run.glyphs.forEach((glyph, i) => {
    const pos = run.positions[i];
    const x = PADDING + (penX + pos.xOffset) * scale;
    const y = baselineY - pos.yOffset * scale;
    paths.push(
      `<path d="${glyph.path.toSVG()}" transform="translate(${x} ${y}) scale(${scale} ${-scale})" fill="${FONT_COLOR}"/>`,
    );
    penX += pos.xAdvance;
  });

  return paths.join("");
};

const renderTitle = (text: string) =>
  wrapTitle(text)
    .map((line, i) => renderLine(line, FIRST_BASELINE_Y + i * LINE_HEIGHT))
    .join("");

export const buildOpg = async (title: string, slug: string) => {
  const template = readFileSync(TEMPLATE_PATH, "utf-8");
  const svg = template.replace("//{title}", renderTitle(title));

  mkdirSync(OUTPUT_DIR, { recursive: true });
  await sharp(Buffer.from(svg)).png().toFile(`${OUTPUT_DIR}/${slug}.png`);
};
