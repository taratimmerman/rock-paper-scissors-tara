import { expect, test } from "../baseTest";
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

function getRound1ExpectedStats(
  winner: Participant,
  playerMove: Move,
  computerMove: Move,
) {
  const playerWon = winner === Participant.PLAYER;
  return {
    playerStats: {
      availableTaraMoves: playerWon ? 1 : 0,
      commonMove: playerMove as StandardMove,
      health: playerWon ? 100 : 50,
      wins: 0,
    },
    computerStats: {
      availableTaraMoves: playerWon ? 0 : 1,
      commonMove: computerMove as StandardMove,
      health: playerWon ? 50 : 100,
      wins: 0,
    },
  };
}

function getRound2ExpectedStats(
  winner: Participant,
  initialPlayerStats: Stats,
  initialComputerStats: Stats,
) {
  const playerWon = winner === Participant.PLAYER;
  return {
    playerStats: {
      availableTaraMoves: playerWon ? 0 : 1,
      commonMove: initialPlayerStats.commonMove,
      health: playerWon ? 100 : 30,
      wins: playerWon ? 2 : 1,
    },
    computerStats: {
      availableTaraMoves: playerWon ? 1 : 0,
      commonMove: initialComputerStats.commonMove,
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

test("Match ends with a double KO", async ({ gamePage, landingPage, seed }) => {
  const sameMove = Move.PAPER;

  const initialStats: Stats = {
    availableTaraMoves: 1,
    commonMove: Move.PAPER,
    health: 10,
    wins: 1,
  };

  const initialProgress: Progress = {
    match: 2,
    round: 2,
  };

  await seed({
    progress: initialProgress,
    playerStats: initialStats,
    computerStats: initialStats,
  });

  await landingPage.continueMatch();

  await test.step("Verify match initially 2", async () => {
    await Promise.all([
      gamePage.verifyStats(Participant.PLAYER, initialStats),
      gamePage.verifyProgress(initialProgress),
      gamePage.verifyStats(Participant.COMPUTER, initialStats),
      gamePage.verifyNewMatchButtonVisible(false),
    ]);
  });

  await test.step(`Participant moves: Player (${sameMove}) vs Computer (${sameMove})`, async () => {
    await gamePage.setComputerMove(sameMove);
    await gamePage.choosePlayerAction(sameMove);
    await gamePage.verifyStatus(
      new RegExp(`you played ${sameMove}. computer played ${sameMove}.`, "i"),
    );
  });

  await test.step("Verify match results in a double KO", async () => {
    const doubleKOText = new RegExp(`double ko`, "i");

    await gamePage.verifyAnnouncement(doubleKOText);
    await gamePage.verifyNewMatchButtonVisible();
  });
});

test("Match resolves by health when the round limit is reached", async ({
  gamePage,
  landingPage,
  seed,
}) => {
  const initialStats: Stats = {
    availableTaraMoves: 0,
    commonMove: Move.PAPER,
    health: 100,
    wins: 0,
  };
  const initialProgress: Progress = { match: 1, round: 99 };

  await seed({
    progress: initialProgress,
    playerStats: initialStats,
    computerStats: { ...initialStats, health: 50 },
  });
  await landingPage.continueMatch();

  await gamePage.setComputerMove(Move.PAPER);
  await gamePage.choosePlayerAction(Move.PAPER);

  await test.step("Verify the higher-health participant wins the match", async () => {
    await gamePage.verifyAnnouncement(/player won the match/i);
    await gamePage.verifyProgress(initialProgress);
    await gamePage.verifyStats(Participant.PLAYER, {
      ...initialStats,
      health: 90,
      wins: 1,
    });
    await gamePage.verifyStats(Participant.COMPUTER, {
      ...initialStats,
      health: 40,
    });
  });
});

interface GameOutcomeTestCase {
  description: string;
  playerHealth: number;
  computerHealth: number;
  movePlayer: Move;
  moveComputer: Move;
  expectedAnnouncement: string;
}

const gameOutcomeTestCases: GameOutcomeTestCase[] = [
  {
    description: "player wins the game",
    playerHealth: 100,
    computerHealth: 1,
    movePlayer: Move.PAPER,
    moveComputer: Move.ROCK,
    expectedAnnouncement: "GAME OVER! YOU WIN!",
  },
  {
    description: "computer wins the game",
    playerHealth: 1,
    computerHealth: 100,
    movePlayer: Move.SCISSORS,
    moveComputer: Move.ROCK,
    expectedAnnouncement: "GAME OVER! YOU LOSE!",
  },
  {
    description: "the game ends in a draw",
    playerHealth: 10,
    computerHealth: 10,
    movePlayer: Move.PAPER,
    moveComputer: Move.PAPER,
    expectedAnnouncement: "GAME OVER! IT'S A DRAW!",
  },
];

for (const {
  description,
  playerHealth,
  computerHealth,
  movePlayer,
  moveComputer,
  expectedAnnouncement,
} of gameOutcomeTestCases) {
  test(`Final game outcome: ${description}`, async ({
    gamePage,
    landingPage,
    seed,
  }) => {
    const baseStats: Omit<Stats, "health"> = {
      availableTaraMoves: 0,
      commonMove: null,
      wins: 0,
    };

    await seed({
      progress: { match: 99, round: 2 },
      playerStats: { ...baseStats, health: playerHealth },
      computerStats: { ...baseStats, health: computerHealth },
    });
    await landingPage.continueMatch();

    await gamePage.setComputerMove(moveComputer);
    await gamePage.choosePlayerAction(movePlayer);

    await expect(gamePage.announcementContainer).toContainText(
      expectedAnnouncement,
      {
        timeout: 15000,
      },
    );
  });
}

test("Starting a new match after game over resets progress to Match 1", async ({
  gamePage,
  landingPage,
  seed,
}) => {
  await seed({
    progress: { match: 99, round: 2 },
    playerStats: { health: 100, wins: 0 },
    computerStats: { health: 1, wins: 0 },
  });
  await landingPage.continueMatch();

  await gamePage.setComputerMove(Move.ROCK);
  await gamePage.choosePlayerAction(Move.PAPER);
  await expect(gamePage.announcementContainer).toContainText(
    "GAME OVER! YOU WIN!",
    { timeout: 15000 },
  );

  await gamePage.startNewMatch();

  await Promise.all([
    gamePage.verifyProgress({ match: 1, round: 1 }),
    gamePage.verifyStats(Participant.PLAYER, defaultStats),
    gamePage.verifyStats(Participant.COMPUTER, defaultStats),
    gamePage.verifyStatus("Choose your attack!"),
  ]);
});
