import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  outputDir: "./tests/test-results",
  snapshotPathTemplate:
    "./tests/snapshots/{testFilePath}/{projectName}/{arg}{ext}",
  use: {
    baseURL: "http://localhost:3333",
  },
  webServer: {
    command: "bunx serve dist -l 3333",
    port: 3333,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 5"] },
    },
  ],
});
