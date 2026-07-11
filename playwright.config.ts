import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry flakiness in CI, but never locally (forces devs to fix their tests) */
  retries: process.env.CI ? 2 : 0,

  /* CI runners often choke on CPU-heavy browser processes. Limit workers in CI. */
  workers: process.env.CI ? 1 : undefined,

  /*
   * QoL: Use 'list' for a clean terminal output.
   * Generate an 'html' report, but don't auto-open it every time a test fails locally.
   */
  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    /* Points to your Parcel dev server. Simplifies navigation: await page.goto('/') */
    baseURL: "http://localhost:1234",

    /* SDET Best Practice: Capture full debugging context ONLY when tests fail to save CI disk space */
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  /* Automatically manage the Parcel server lifecycle */
  webServer: {
    command: "npm run start",
    url: "http://localhost:1234",
    reuseExistingServer: !process.env.CI,
    /* 2 minutes: gives Parcel plenty of time for initial caching/bundling on a cold start */
    timeout: 120 * 1000,
  },
});
