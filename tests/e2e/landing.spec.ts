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

test("resets game state", async ({ gamePage, landingPage, page, seed }) => {
  const initialProgress: Progress = {
    match: 4,
    round: 5,
  };

  const initialPlayerStats: Stats = {
    availableTaraMoves: 2,
    commonMove: null,
    health: 90,
    wins: 3,
  };

  const initialComputerStats: Stats = {
    availableTaraMoves: 1,
    commonMove: Move.ROCK,
    health: 30,
    wins: 1,
  };

  await seed({
    progress: initialProgress,
    playerStats: initialPlayerStats,
    computerStats: initialComputerStats,
  });

  await test.step("Verify initial UI", async () => {
    await Promise.all([
      landingPage.verifyStartButtonVisible(false),
      landingPage.verifyContinueButtonVisible(),
      landingPage.verifyResetButtonVisible(),
    ]);

    await landingPage.continueMatch();

    await Promise.all([
      gamePage.verifyStats(Participant.PLAYER, initialPlayerStats),
      gamePage.verifyProgress(initialProgress),
      gamePage.verifyStats(Participant.COMPUTER, initialComputerStats),
      gamePage.verifyTaraEnabled(),
    ]);
  });

  await test.step("Reset game state", async () => {
    await page.reload();
    await landingPage.resetGame();
  });

  await test.step("Verify game state was reset", async () => {
    await Promise.all([
      await landingPage.verifyContinueButtonVisible(false),
      await landingPage.verifyResetButtonVisible(),
    ]);

    await landingPage.startMatch();

    await Promise.all([
      gamePage.verifyStats(Participant.PLAYER, defaultStats),
      gamePage.verifyProgress(defaultProgress),
      gamePage.verifyStats(Participant.COMPUTER, defaultStats),
      gamePage.verifyTaraEnabled(false),
    ]);
  });
});
