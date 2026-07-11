import { test } from "../baseTest";
import { GamePage } from "../models/GamePage";
import { LandingPage } from "../models/LandingPage";

test("should load the initial game UI successfully", async ({ page }) => {
  const gamePage = new GamePage(page);
  const landingPage = new LandingPage(page);

  await landingPage.verifyHeadingVisible();
  await landingPage.startMatch();
  await landingPage.verifyHeadingVisible(false);

  await gamePage.verifyPlayerButtonsVisible();
  await gamePage.verifyTaraEnabled(false);
});
