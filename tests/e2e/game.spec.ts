import { test } from "../baseTest";
import { Move } from "../models/GamePage";

test.describe("Core Gameplay", () => {
  test.beforeEach(async ({ landingPage }) => {
    await landingPage.startMatch();
  });

  test("should update UI when the player selects Rock", async ({
    gamePage,
  }) => {
    const playerMove = Move.ROCK;

    await gamePage.choosePlayerAction(playerMove);
    await gamePage.verifyPlayerActionAnnouncement(playerMove);
  });
});
