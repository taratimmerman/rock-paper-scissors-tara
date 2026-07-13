import { test } from "../baseTest";
import {
  defaultProgress,
  defaultStats,
  Move,
  Participant,
  Progress,
  Stats,
} from "../utils/data";

test("loads default match UI with no saved game state", async ({
  gamePage,
  landingPage,
}) => {
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

test("resets an active game to default state", async ({
  gamePage,
  landingPage,
  page,
  seed,
}) => {
  const customProgress: Progress = { match: 4, round: 5 };
  const customPlayerStats: Stats = {
    availableTaraMoves: 2,
    commonMove: null,
    health: 90,
    wins: 3,
  };
  const customComputerStats: Stats = {
    availableTaraMoves: 1,
    commonMove: Move.ROCK,
    health: 30,
    wins: 1,
  };

  await seed({
    progress: customProgress,
    playerStats: customPlayerStats,
    computerStats: customComputerStats,
  });

  await test.step("Verify seeded game allows continuation", async () => {
    await landingPage.verifyStartButtonVisible(false);
    await landingPage.verifyContinueButtonVisible(true);
    await landingPage.verifyResetButtonVisible(true);

    await landingPage.continueMatch();

    await gamePage.verifyProgress(customProgress);
    await gamePage.verifyStats(Participant.PLAYER, customPlayerStats);
    await gamePage.verifyStats(Participant.COMPUTER, customComputerStats);
    await gamePage.verifyTaraEnabled(true);
  });

  await test.step("Reset game state", async () => {
    await page.reload();
    await landingPage.resetGame();
  });

  await test.step("Verify game defaults are restored", async () => {
    await landingPage.verifyContinueButtonVisible(false);
    await landingPage.verifyResetButtonVisible();

    await landingPage.startMatch();

    await gamePage.verifyProgress(defaultProgress);
    await gamePage.verifyStats(Participant.PLAYER, defaultStats);
    await gamePage.verifyStats(Participant.COMPUTER, defaultStats);
    await gamePage.verifyTaraEnabled(false);
  });
});
