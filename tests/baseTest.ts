import { test as base } from "@playwright/test";
import { LandingPage } from "./models/LandingPage";
import { GamePage } from "./models/GamePage";

type Page = {
  landingPage: LandingPage;
  gamePage: GamePage;
};

export const test = base.extend<Page>({
  page: async ({ page }, use) => {
    await page.goto("/");
    await use(page);
  },
  landingPage: async ({ page }, use) => {
    await use(new LandingPage(page));
  },
  gamePage: async ({ page }, use) => {
    await use(new GamePage(page));
  },
});

export { expect } from "@playwright/test";
