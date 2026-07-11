import { test as base } from "@playwright/test";

// Extend the base test to automatically navigate to '/'
export const test = base.extend({
  page: async ({ page }, use) => {
    // This code runs before each test that uses this custom 'test'
    await page.goto("/");

    // Pass the page to the test
    await use(page);
  },
});

export { expect } from "@playwright/test";
