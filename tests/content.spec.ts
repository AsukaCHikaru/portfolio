import { test, expect } from "@playwright/test";
import { readdirSync, readFileSync } from "fs";
import path from "path";

const BLOG_DIR = path.join(process.cwd(), "public/contents/blog");

// Read all published blog post pathnames from markdown frontmatter
const blogPosts = readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith(".md"))
  .map((file) => {
    const content = readFileSync(path.join(BLOG_DIR, file), "utf-8");
    const pathnameMatch = content.match(/^pathname:\s*(.+)$/m);
    const publishedMatch = content.match(/^published:\s*(.+)$/m);
    return {
      file,
      pathname: pathnameMatch?.[1].trim() ?? null,
      published: publishedMatch?.[1].trim() ?? null,
    };
  })
  .filter((p) => p.pathname !== null && p.published !== null);

test.describe("Blog post pages", () => {
  test(`all ${blogPosts.length} blog posts are accessible`, async ({
    page,
  }) => {
    const failures: string[] = [];

    for (const { pathname } of blogPosts) {
      const response = await page.goto(`/blog/${pathname}`);
      if (!response || response.status() === 404) {
        failures.push(`/blog/${pathname} returned 404`);
        continue;
      }
      const h1 = page.locator("h1, article h2").first();
      const isVisible = await h1.isVisible().catch(() => false);
      if (!isVisible) {
        failures.push(`/blog/${pathname} loaded but has no heading`);
      }
    }

    expect(failures, `Failed posts:\n${failures.join("\n")}`).toHaveLength(0);
  });

  test("blog archive lists all posts", async ({ page }) => {
    await page.goto("/blog");
    // Each post appears as a link in the archive (excluding feed.xml)
    const postLinks = page.locator(
      'a[href^="/blog/"]:not([href="/blog/feed.xml"])',
    );
    const count = await postLinks.count();
    expect(count).toBeGreaterThanOrEqual(blogPosts.length);
  });
});

test.describe("List pages", () => {
  const listPages = [
    { path: "/list", heading: /list/i },
    { path: "/list/music-awards", heading: /music/i },
    { path: "/list/video-game-index", heading: /game/i },
    { path: "/list/bucket-list", heading: /bucket/i },
  ];

  for (const { path, heading } of listPages) {
    test(`${path} has content`, async ({ page }) => {
      await page.goto(path);
      // Use main h1 to avoid matching the site header logo ("ASUKA WANG")
      const h1 = page.locator("main h1").first();
      await expect(h1).toBeVisible();
      await expect(h1).toHaveText(heading);
    });
  }
});

test.describe("Static pages", () => {
  test("about page has content", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page.locator("article, main, .post-content").first(),
    ).toBeVisible();
  });

  test("resume page has content", async ({ page }) => {
    await page.goto("/resume");
    await expect(page.locator("main, article, h1, h2").first()).toBeVisible();
  });
});
