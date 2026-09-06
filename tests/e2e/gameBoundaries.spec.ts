import { test } from "../baseTest";
import { Move, Participant, Progress, Stats } from "../utils/data";

test.describe("Match boundaries", () => {
  test("Cannot exceed 99 matches", async ({
    gamePage,
    landingPage,
    page,
    seed,
  }) => {
    const movePlayer = Move.PAPER;
    const moveComputer = Move.ROCK;
    const initialProgress: Progress = {
      match: 99,
      round: 2,
    };

    await seed({
      progress: initialProgress,
    });

    await landingPage.continueMatch();

    await test.step("Verify match initially 99", async () => {
      await Promise.all([
        gamePage.verifyProgress(initialProgress),
        gamePage.verifyNewMatchButtonVisible(false),
      ]);
    });

    await test.step(`Participant moves: Player (${movePlayer}) vs Computer (${moveComputer})`, async () => {
      await gamePage.setComputerMove(moveComputer);
      await gamePage.choosePlayerAction(movePlayer);
      await gamePage.verifyStatus(
        new RegExp(
          `you played ${movePlayer}. computer played ${moveComputer}.`,
          "i",
        ),
      );
    });

    await test.step("Verify match ends", async () => {
      const playerMoveSuccessText = new RegExp(`player lands a blow`, "i");
      const playerMatchWinText = new RegExp(`player won the match`, "i");

      await gamePage.verifyAnnouncement(playerMoveSuccessText);
      await gamePage.verifyAnnouncement(playerMatchWinText);
      await gamePage.verifyNewMatchButtonVisible();
    });

    await test.step("New match is match 1", async () => {
      await gamePage.startNewMatch();
      await gamePage.verifyProgress({ match: 1, round: 1 });
    });
  });
});
