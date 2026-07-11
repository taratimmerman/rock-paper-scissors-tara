import { test } from "../baseTest";
import { Participant } from "../models/GamePage";

test("loads default match UI with no saved game state", async ({
  gamePage,
  landingPage,
}) => {
  const defaultStats = {
    availableTaraMoves: 0,
    health: 100,
    wins: "00",
    commonMove: null,
  };

  const defaultProgress = {
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
