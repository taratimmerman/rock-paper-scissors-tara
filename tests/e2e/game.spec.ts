import { test } from "../baseTest";
import { Move } from "../models/GamePage";

test.describe("Core Gameplay", () => {
  test.beforeEach(async ({ landingPage }) => {
    await landingPage.startMatch();
  });

  for (const playerMove of [Move.ROCK, Move.PAPER, Move.SCISSORS]) {
    test(`should annnounce when the player selects ${playerMove}`, async ({
      gamePage,
    }) => {
      await gamePage.choosePlayerAction(playerMove);
      await gamePage.verifyPlayerActionAnnouncement(playerMove);
    });
  }
});
