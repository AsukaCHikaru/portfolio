import { test, expect } from "@playwright/test";

// All main routes defined in Router.tsx
// Titles reflect post-hydration state: Helmet overrides document.title on list subpages
// hasLayout: false for pages that intentionally omit the site header/footer (e.g. print-friendly resume)
const ROUTES = [
  { path: "/", titlePattern: /Asuka Wang/, hasLayout: true },
  { path: "/blog", titlePattern: /Blog/, hasLayout: true },
  { path: "/about", titlePattern: /Asuka Wang/, hasLayout: true },
  { path: "/resume", titlePattern: /Resume/, hasLayout: false },
  { path: "/list", titlePattern: /List/, hasLayout: true },
  { path: "/list/music-awards", titlePattern: /Music Awards/, hasLayout: true },
  { path: "/list/video-game-index", titlePattern: /Video Game Index/, hasLayout: true },
  { path: "/list/bucket-list", titlePattern: /Bucket List/, hasLayout: true },
];

test.describe("Static routes", () => {
  for (const { path, titlePattern } of ROUTES) {
    test(`${path} loads with correct title`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).not.toBe(404);
      await expect(page).toHaveTitle(titlePattern);
    });
  }
});

test.describe("Header navigation", () => {
  test("header is present on layout pages", async ({ page }) => {
    test.setTimeout(60000);
    for (const { path, hasLayout } of ROUTES) {
      if (!hasLayout) continue;
      await page.goto(path);
      await expect(page.locator("header")).toBeVisible({ timeout: 10000 });
    }
  });

  test("footer is present on layout pages", async ({ page }) => {
    test.setTimeout(60000);
    for (const { path, hasLayout } of ROUTES) {
      if (!hasLayout) continue;
      await page.goto(path);
      await expect(page.locator("footer")).toBeVisible({ timeout: 10000 });
    }
  });

  test("nav links navigate via client-side router", async ({ page }) => {
    await page.goto("/");
    // Wait for React to hydrate
    await page.waitForLoadState("networkidle");

    await page.click('nav a[href="/blog"]');
    await expect(page).toHaveURL("/blog");
    await expect(page).toHaveTitle(/Blog/);
  });

  test("logo link navigates home from blog", async ({ page }) => {
    await page.goto("/blog");
    await page.waitForLoadState("networkidle");

    await page.click('h1 a[href="/"]');
    await expect(page).toHaveURL("/");
  });

  test("nav link navigates to list page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.click('nav a[href="/list"]');
    await expect(page).toHaveURL("/list");
    await expect(page).toHaveTitle(/List/);
  });

  test("nav link navigates to about page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.click('nav a[href="/about"]');
    await expect(page).toHaveURL("/about");
  });
});

test.describe("Blog navigation", () => {
  test("clicking a post in archive navigates to post page", async ({
    page,
  }) => {
    await page.goto("/blog");
    await page.waitForLoadState("networkidle");

    // Get the first post link
    const firstPostLink = page
      .locator('a[href^="/blog/"]:not([href="/blog/feed.xml"])')
      .first();
    const href = await firstPostLink.getAttribute("href");
    expect(href).toBeTruthy();

    await firstPostLink.click();
    await expect(page).toHaveURL(href!);
  });
});
