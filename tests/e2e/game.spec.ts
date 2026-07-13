import { test } from "../baseTest";
import {
  defaultProgress,
  defaultStats,
  Move,
  Participant,
  Progress,
  Stats,
} from "../utils/data";

type StandardMove = NonNullable<Stats["commonMove"]>;

interface RoundTestCase {
  description: string;
  movePlayer: StandardMove;
  moveComputer: StandardMove;
  expectedWinner: Participant;
}

const roundTestCases: RoundTestCase[] = [
  {
    description: "Player PAPER engulfs Computer ROCK",
    movePlayer: Move.PAPER,
    moveComputer: Move.ROCK,
    expectedWinner: Participant.PLAYER,
  },
  {
    description: "Player ROCK crushes Computer SCISSORS",
    movePlayer: Move.ROCK,
    moveComputer: Move.SCISSORS,
    expectedWinner: Participant.PLAYER,
  },
  {
    description: "Player SCISSORS cuts Computer PAPER",
    movePlayer: Move.SCISSORS,
    moveComputer: Move.PAPER,
    expectedWinner: Participant.PLAYER,
  },
  {
    description: "Computer ROCK crushes Player SCISSORS",
    movePlayer: Move.SCISSORS,
    moveComputer: Move.ROCK,
    expectedWinner: Participant.COMPUTER,
  },
];

test.describe("Round 1", () => {
  test.beforeEach(async ({ landingPage }) => {
    await landingPage.startMatch();
  });

  for (const {
    description,
    movePlayer,
    moveComputer,
    expectedWinner,
  } of roundTestCases) {
    test(description, async ({ gamePage }) => {
      // 1. Dynamic State Derivation
      // Calculates the symmetrical outcomes based purely on who won.
      const isPlayerWinner = expectedWinner === Participant.PLAYER;

      const expectedPlayerStats: Stats = {
        availableTaraMoves: isPlayerWinner ? 1 : 0,
        commonMove: movePlayer,
        health: isPlayerWinner ? 100 : 50,
        wins: 0,
      };

      const expectedComputerStats: Stats = {
        availableTaraMoves: !isPlayerWinner ? 1 : 0,
        commonMove: moveComputer,
        health: !isPlayerWinner ? 100 : 50,
        wins: 0,
      };

      const expectedProgress: Progress = {
        match: 1,
        round: 2,
      };

      // Status text expectations
      const expectedAnnouncement = new RegExp(
        `${expectedWinner} lands a blow`,
        "i",
      );
      const expectedStatus1 = "Choose your attack!";
      const expectedStatus2 = new RegExp(
        `you played ${movePlayer}. computer played ${moveComputer}.`,
        "i",
      );
      const expectedStatus3 = "Prepare your next move...";

      // 2. Execution & Symmetrical Verification
      await test.step("Verify default initial game state", async () => {
        await Promise.all([
          gamePage.verifyStats(Participant.PLAYER, defaultStats),
          gamePage.verifyProgress(defaultProgress),
          gamePage.verifyStats(Participant.COMPUTER, defaultStats),
          gamePage.verifyStatus(expectedStatus1),
        ]);
      });

      await test.step(`Participant moves: Player (${movePlayer}) vs Computer (${moveComputer})`, async () => {
        await gamePage.setComputerMove(moveComputer);
        await gamePage.choosePlayerAction(movePlayer);
        await gamePage.verifyStatus(expectedStatus2);
      });

      await test.step("Verify updated game state", async () => {
        // Sequential checks for transient UI states
        await gamePage.verifyAnnouncement(expectedAnnouncement);
        await gamePage.verifyStatus(expectedStatus3);
        await gamePage.verifyStatus(expectedStatus1);
        if (isPlayerWinner) await gamePage.verifyTaraEnabled();

        // Concurrent symmetrical checks for structural state
        await Promise.all([
          gamePage.verifyStats(Participant.PLAYER, expectedPlayerStats),
          gamePage.verifyProgress(expectedProgress),
          gamePage.verifyStats(Participant.COMPUTER, expectedComputerStats),
        ]);
      });
    });
  }
});
