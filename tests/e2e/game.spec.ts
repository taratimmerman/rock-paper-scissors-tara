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
  movePlayer: Move;
  moveComputer: Move;
  expectedWinner: Participant;
}

// ==========================================
// 1. STATE FACTORIES
// ==========================================

// 1. Add a tiny helper to enforce the business rule
function getNextCommonMove(
  previousCommon: StandardMove,
  newMove: Move,
): StandardMove {
  // If they played TARA, their common move stays whatever it was previously
  return newMove === Move.TARA ? previousCommon : (newMove as StandardMove);
}

// 2. Update the factories to use it
function getRound1ExpectedStats(
  winner: Participant,
  playerMove: Move,
  computerMove: Move,
) {
  const playerWon = winner === Participant.PLAYER;
  return {
    playerStats: {
      availableTaraMoves: playerWon ? 1 : 0,
      // Assuming defaultStats.commonMove is something like Move.ROCK or null
      commonMove: getNextCommonMove(
        defaultStats.commonMove as StandardMove,
        playerMove,
      ),
      health: playerWon ? 100 : 50,
      wins: 0,
    },
    computerStats: {
      availableTaraMoves: playerWon ? 0 : 1,
      commonMove: getNextCommonMove(
        defaultStats.commonMove as StandardMove,
        computerMove,
      ),
      health: playerWon ? 50 : 100,
      wins: 0,
    },
  };
}

function getRound2ExpectedStats(
  winner: Participant,
  playerMove: Move,
  computerMove: Move,
  initialPlayerStats: Stats,
  initialComputerStats: Stats,
) {
  const playerWon = winner === Participant.PLAYER;
  return {
    playerStats: {
      availableTaraMoves: playerWon ? 0 : 1,
      commonMove: getNextCommonMove(
        initialPlayerStats.commonMove as StandardMove,
        playerMove,
      ),
      health: playerWon ? 100 : 30,
      wins: playerWon ? 2 : 1,
    },
    computerStats: {
      availableTaraMoves: playerWon ? 1 : 0,
      commonMove: getNextCommonMove(
        initialComputerStats.commonMove as StandardMove,
        computerMove,
      ),
      health: playerWon ? 0 : 50,
      wins: 1,
    },
  };
}

// ==========================================
// ROUND 1 TESTS
// ==========================================

const round1TestCases: RoundTestCase[] = [
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
  } of round1TestCases) {
    test(description, async ({ gamePage }) => {
      const isPlayerWinner = expectedWinner === Participant.PLAYER;
      const { playerStats, computerStats } = getRound1ExpectedStats(
        expectedWinner,
        movePlayer,
        moveComputer,
      );
      const expectedProgress: Progress = { match: 1, round: 2 };

      await test.step("Verify default initial game state", async () => {
        await Promise.all([
          gamePage.verifyStats(Participant.PLAYER, defaultStats),
          gamePage.verifyProgress(defaultProgress),
          gamePage.verifyStats(Participant.COMPUTER, defaultStats),
          gamePage.verifyStatus("Choose your attack!"),
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

      await test.step("Verify updated game state", async () => {
        await gamePage.verifyAnnouncement(
          new RegExp(`${expectedWinner} lands a blow`, "i"),
        );
        await gamePage.verifyStatus("Prepare your next move...");
        await gamePage.verifyStatus("Choose your attack!");

        if (isPlayerWinner) await gamePage.verifyTaraEnabled();

        await Promise.all([
          gamePage.verifyStats(Participant.PLAYER, playerStats),
          gamePage.verifyProgress(expectedProgress),
          gamePage.verifyStats(Participant.COMPUTER, computerStats),
        ]);
      });
    });
  }
});

// ==========================================
// ROUND 2 TESTS
// ==========================================

const round2TestCases: RoundTestCase[] = [
  {
    description: "Player TARA obliterates Computer ROCK",
    movePlayer: Move.TARA,
    moveComputer: Move.ROCK,
    expectedWinner: Participant.PLAYER,
  },
  {
    description: "Player TARA obliterates Computer PAPER",
    movePlayer: Move.TARA,
    moveComputer: Move.PAPER,
    expectedWinner: Participant.PLAYER,
  },
  {
    description: "Player TARA obliterates Computer SCISSORS",
    movePlayer: Move.TARA,
    moveComputer: Move.ROCK,
    expectedWinner: Participant.PLAYER,
  },
  {
    description: "Computer TARA obliterates Player ROCK",
    movePlayer: Move.ROCK,
    moveComputer: Move.TARA,
    expectedWinner: Participant.COMPUTER,
  },
];

test.describe("Round 2", () => {
  const round2Progress: Progress = { match: 3, round: 2 };
  const initialPlayerStats: Stats = {
    availableTaraMoves: 1,
    commonMove: Move.PAPER,
    health: 100,
    wins: 1,
  };
  const initialComputerStats: Stats = {
    availableTaraMoves: 1,
    commonMove: Move.ROCK,
    health: 50,
    wins: 1,
  };

  test.beforeEach(async ({ landingPage, seed }) => {
    await seed({
      progress: round2Progress,
      playerStats: initialPlayerStats,
      computerStats: initialComputerStats,
    });
    await landingPage.continueMatch();
  });

  for (const {
    description,
    movePlayer,
    moveComputer,
    expectedWinner,
  } of round2TestCases) {
    test(description, async ({ gamePage }) => {
      const isPlayerWinner = expectedWinner === Participant.PLAYER;
      const { playerStats, computerStats } = getRound2ExpectedStats(
        expectedWinner,
        movePlayer,
        moveComputer,
        initialPlayerStats,
        initialComputerStats,
      );

      await test.step("Verify default initial game state", async () => {
        await Promise.all([
          gamePage.verifyStats(Participant.PLAYER, initialPlayerStats),
          gamePage.verifyProgress(round2Progress),
          gamePage.verifyStats(Participant.COMPUTER, initialComputerStats),
          gamePage.verifyStatus("Choose your attack!"),
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

      await test.step("Verify updated game state", async () => {
        await gamePage.verifyAnnouncement(
          new RegExp(`${expectedWinner} lands a blow`, "i"),
        );

        if (isPlayerWinner) {
          await gamePage.verifyAnnouncement(
            new RegExp(`${expectedWinner} won the match`, "i"),
          );
        }

        await Promise.all([
          gamePage.verifyStats(Participant.PLAYER, playerStats),
          gamePage.verifyProgress(round2Progress),
          gamePage.verifyStats(Participant.COMPUTER, computerStats),
          gamePage.verifyNewMatchButtonVisible(isPlayerWinner),
        ]);
      });
    });
  }
});
