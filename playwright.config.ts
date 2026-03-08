import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  outputDir: "./tests/test-results",
  snapshotPathTemplate:
    "./tests/snapshots/{testFilePath}/{arg}{ext}",
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
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
