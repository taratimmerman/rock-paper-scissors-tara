import { test } from "../baseTest";
import { Move, Participant, Progress, Stats } from "../models/GamePage";

test("loads default match UI with no saved game state", async ({
  gamePage,
  landingPage,
}) => {
  const defaultStats: Stats = {
    availableTaraMoves: 0,
    commonMove: null,
    health: 100,
    wins: 0,
  };

  const defaultProgress: Progress = {
    match: 1,
    round: 1,
  };

  await test.step("Start match from landing page", async () => {
    await landingPage.verifyHeadingVisible();
    await landingPage.startMatch();
    await landingPage.verifyHeadingVisible(false);
  });

  await test.step("Verify default initial game state", async () => {
    await Promise.all([
      gamePage.verifyStats(Participant.PLAYER, defaultStats),
      gamePage.verifyProgress(defaultProgress),
      gamePage.verifyStats(Participant.COMPUTER, defaultStats),
      gamePage.verifyPlayerButtonsVisible(),
      gamePage.verifyTaraEnabled(false),
    ]);
  });
});

test("loads custom match UI with seeded game state", async ({
  gamePage,
  landingPage,
  seed,
}) => {
  const expectedProgress: Progress = {
    match: 2,
    round: 2,
  };

  const expectedPlayerStats: Stats = {
    availableTaraMoves: 3,
    commonMove: Move.ROCK,
    health: 100,
    wins: 1,
  };

  const expectedComputerStats: Stats = {
    availableTaraMoves: 0,
    commonMove: Move.SCISSORS,
    health: 50,
    wins: 0,
  };

  await seed({
    progress: expectedProgress,
    playerStats: expectedPlayerStats,
    computerStats: expectedComputerStats,
  });

  await test.step("Continue match from landing page", async () => {
    await landingPage.verifyHeadingVisible();
    await landingPage.continueMatch();
    await landingPage.verifyHeadingVisible(false);
  });

  await test.step("Verify UI renders with expected progress and stats", async () => {
    await Promise.all([
      gamePage.verifyStats(Participant.PLAYER, expectedPlayerStats),
      gamePage.verifyProgress(expectedProgress),
      gamePage.verifyStats(Participant.COMPUTER, expectedComputerStats),
      gamePage.verifyPlayerButtonsVisible(),
      gamePage.verifyTaraEnabled(),
    ]);
  });
});
