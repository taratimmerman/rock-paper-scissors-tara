import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,

  /* Prevent merging skipped test suites with test.only active */
  forbidOnly: !!process.env.CI,

  /* Retry failures on CI to mitigate network or infrastructure flakiness */
  retries: process.env.CI ? 2 : 0,

  /* Limit resource consumption on single-core CI runners */
  workers: process.env.CI ? 1 : undefined,

  /* Output test status to stdout and generate an HTML report without auto-opening */
  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: "http://localhost:1234",

    /* Capture debugging contexts only on failure to optimize CI artifact storage */
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },

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

  /* Automate the local Parcel server lifecycle during execution */
  webServer: {
    command: "npm run start",
    url: "http://localhost:1234",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000 /* Allow sufficient time for cold start bundling */,
  },
});
