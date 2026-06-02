import { mkdirSync, readFileSync } from "node:fs";
import * as fontkit from "fontkit";
import sharp from "sharp";

const TITLE_FONT_PATH = "./public/fonts/NotoSerifJP_Bold.woff2";
const CJK_TITLE_FONT_PATH =
  "./public/fonts/subset_cjk_NotoSerifJP_Regular.woff2";
const DATE_FONT_PATH = "./public/fonts/subset_latin_NotoSans_ExtraLight.woff2";
const TEMPLATE_PATH = "./tools/opg_template.svg";
const OUTPUT_DIR = "./dist/opg";

const TITLE_FONT_SIZE = 90;
const LINE_HEIGHT = 100;
const DATE_FONT_SIZE = 36;
const DATE_PAD_TOP = 36;
const WIDTH = 1200;
const PADDING = 60;
const CONTENT_MAX_WIDTH = WIDTH - PADDING * 2;
const FIRST_BASELINE_Y = PADDING + TITLE_FONT_SIZE;
const FONT_COLOR = "#27221F";

const latinFont = fontkit.openSync(TITLE_FONT_PATH) as fontkit.Font;
const cjkFont = fontkit.openSync(CJK_TITLE_FONT_PATH) as fontkit.Font;
const dateFont = fontkit.openSync(DATE_FONT_PATH) as fontkit.Font;

const hasCjk = (text: string) =>
  /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(text);

const scaleOf = (font: fontkit.Font, fontSize: number) =>
  fontSize / font.unitsPerEm;

const isWiderThanContainer = (font: fontkit.Font, input: string) =>
  font.layout(input).positions.reduce((sum, pos) => sum + pos.xAdvance, 0) *
    scaleOf(font, TITLE_FONT_SIZE) >
  CONTENT_MAX_WIDTH;

const segmenter = new Intl.Segmenter("ja", { granularity: "word" });

const wrapTitle = (font: fontkit.Font, text: string) =>
  [...segmenter.segment(text)]
    .map((s) => s.segment)
    .reduce((lines, unit) => {
      const last = lines.at(-1) ?? "";
      const candidate = last + unit;
      return last && isWiderThanContainer(font, candidate.trimEnd())
        ? [...lines, unit.trimStart()]
        : [...lines.slice(0, -1), candidate];
    }, [] as string[]);

const renderLine = (
  font: fontkit.Font,
  fontSize: number,
  line: string,
  baselineY: number,
) => {
  const scale = scaleOf(font, fontSize);
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

export const buildOpg = async (title: string, date: string, slug: string) => {
  const titleFont = hasCjk(title) ? cjkFont : latinFont;
  const lines = wrapTitle(titleFont, title);
  const titleSvg = lines
    .map((line, i) =>
      renderLine(
        titleFont,
        TITLE_FONT_SIZE,
        line.trimEnd(),
        FIRST_BASELINE_Y + i * LINE_HEIGHT,
      ),
    )
    .join("");

  const lastTitleBaselineY = FIRST_BASELINE_Y + (lines.length - 1) * LINE_HEIGHT;
  const dateBaselineY = lastTitleBaselineY + DATE_PAD_TOP + DATE_FONT_SIZE;
  const dateSvg = renderLine(dateFont, DATE_FONT_SIZE, date, dateBaselineY);

  const template = readFileSync(TEMPLATE_PATH, "utf-8");
  const svg = template
    .replace("//{title}", titleSvg)
    .replace("//{date}", dateSvg);

  mkdirSync(OUTPUT_DIR, { recursive: true });
  await sharp(Buffer.from(svg)).png().toFile(`${OUTPUT_DIR}/${slug}.png`);
};
