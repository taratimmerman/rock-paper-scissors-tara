import { test as base } from "@playwright/test";
import { LandingPage } from "./models/LandingPage";
import { GamePage } from "./models/GamePage";
import { GameStateSeed, seedStorage } from "./utils/localStorageSeed";

type Page = {
  landingPage: LandingPage;
  gamePage: GamePage;
  seed: (data: GameStateSeed) => Promise<void>;
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
  seed: async ({ page }, use) => {
    await use(async (data: GameStateSeed) => {
      await seedStorage(page, data);
    });
  },
});

export { expect } from "@playwright/test";
