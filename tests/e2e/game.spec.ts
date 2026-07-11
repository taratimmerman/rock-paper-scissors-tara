import { test } from "../baseTest";
import { GamePage, Move } from "../models/GamePage";
import { LandingPage } from "../models/LandingPage";

test.describe("Core Gameplay", () => {
  test.beforeEach(async ({ page }) => {
    const landingPage = new LandingPage(page);
    await landingPage.startMatch();
  });

  test("should update UI when the player selects Rock", async ({ page }) => {
    const gamePage = new GamePage(page);
    const playerMove = Move.ROCK;

    await gamePage.choosePlayerAction(playerMove);
    await gamePage.verifyPlayerActionAnnouncement(playerMove);
  });
});
