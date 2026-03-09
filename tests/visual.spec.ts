import { test, expect } from "@playwright/test";

// One representative URL per page type — covers every distinct template
const PAGES = [
  { name: "frontpage", url: "/" },
  { name: "blog-archive", url: "/blog" },
  { name: "blog-post", url: "/blog/dark-souls" },
  { name: "about", url: "/about" },
  { name: "resume", url: "/resume" },
  { name: "list", url: "/list" },
  { name: "list-music-awards", url: "/list/music-awards" },
  { name: "list-video-game-index", url: "/list/video-game-index" },
  { name: "list-bucket-list", url: "/list/bucket-list" },
];

for (const { name, url } of PAGES) {
  test(`${name} matches snapshot`, async ({ page }) => {
    // Large list pages (music-awards, video-game-index) need more time
    test.setTimeout(60000);
    await page.goto(url);
    // Wait for fonts and images to settle before screenshotting
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      // Allow up to 1% pixel diff to tolerate minor anti-aliasing variance
      maxDiffPixelRatio: 0.01,
      timeout: 30000,
    });
  });
}
