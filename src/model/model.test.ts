import { Model } from "./model";
import { MOVES, STANDARD_MOVE_DATA_MAP } from "../utils/dataUtils";
import { Move } from "../utils/dataObjectUtils";
import { IGameStorage } from "../storage/gameStorage";

// Utility to count frequency over many runs
function simulateComputerChoices(
  model: Model,
  runs = 1000
): Record<Move, number> {
  const results: Record<Move, number> = {
    rock: 0,
    paper: 0,
    scissors: 0,
    tara: 0,
  };

  for (let i = 0; i < runs; i++) {
    model.chooseComputerMove();
    const move = model.getComputerMove();
    if (move) results[move]++;
  }

  return results;
}

describe("Model", () => {
  let mockGameStorage: jest.Mocked<IGameStorage>;
  let model: Model;

  beforeEach(() => {
    localStorage.clear();

    mockGameStorage = {
      getScore: jest.fn(),
      setScore: jest.fn(),
      removeScore: jest.fn(),
      getTaraCount: jest.fn(),
      setTaraCount: jest.fn(),
      removeTaraCount: jest.fn(),
      getMostCommonMove: jest.fn(),
      setMostCommonMove: jest.fn(),
      removeMostCommonMove: jest.fn(),
      getMoveCounts: jest.fn(),
      setMoveCounts: jest.fn(),
      removeMoveCounts: jest.fn(),
      getRoundNumber: jest.fn(),
      setRoundNumber: jest.fn(),
      removeRoundNumber: jest.fn(),
      removeHistory: jest.fn(),
    } as jest.Mocked<IGameStorage>;
    model = new Model(mockGameStorage);
  });

  describe("Scores", () => {
    test("getScore returns 0 when no score is set", () => {
      expect(model.getPlayerScore()).toBe(0);
      expect(model.getComputerScore()).toBe(0);
    });

    test("setScore and getScore work together", () => {
      model.setPlayerScore(5);
      model.setComputerScore(3);

      expect(model.getPlayerScore()).toBe(5);
      expect(model.getComputerScore()).toBe(3);
    });
  });

  describe("Moves", () => {
    test("setPlayerMove and getPlayerMove work together", () => {
      model.setPlayerMove(MOVES.ROCK);
      expect(model.getPlayerMove()).toBe(MOVES.ROCK);

      model.setPlayerMove(MOVES.PAPER);
      expect(model.getPlayerMove()).toBe(MOVES.PAPER);
    });

    test("getPlayerMove returns null before a move is set", () => {
      expect(model.getPlayerMove()).toBe(null);
    });

    test("setComputerMove and getComputerMove store and retrieve the move", () => {
      model.setComputerMove(MOVES.SCISSORS);
      expect(model.getComputerMove()).toBe(MOVES.SCISSORS);
    });

    test("chooseComputerMove picks a valid move from MOVES", () => {
      model.chooseComputerMove();
      const move = model.getComputerMove();
      const validMoveNames = Object.values(MOVES);
      expect(validMoveNames).toContain(move);
    });

    test("chooseComputerMove sets a non-empty move", () => {
      model.chooseComputerMove();
      const move = model.getComputerMove();
      expect(move).not.toBe("");
    });
  });

  describe("evaluateRound", () => {
    test("returns 'Invalid round' if player move is missing", () => {
      model.setComputerMove(MOVES.ROCK);
      expect(model.evaluateRound()).toBe("Invalid round");
    });

    test("returns 'Invalid round' if computer move is missing", () => {
      model.setPlayerMove(MOVES.PAPER);
      expect(model.evaluateRound()).toBe("Invalid round");
    });

    test("does not update scores on tie", () => {
      model.setPlayerMove(MOVES.SCISSORS);
      model.setComputerMove(MOVES.SCISSORS);

      expect(model.evaluateRound()).toBe("It's a tie!");
      expect(model.getPlayerScore()).toBe(0);
      expect(model.getComputerScore()).toBe(0);
    });

    test("returns 'You win!' if player beats computer and updates score", () => {
      model.setPlayerMove(MOVES.ROCK);
      model.setComputerMove(MOVES.SCISSORS);

      expect(model.evaluateRound()).toBe("You win!");
      expect(model.getPlayerScore()).toBe(1);
      expect(model.getComputerScore()).toBe(0);
    });

    test("returns 'Computer wins!' if computer beats player and updates score", () => {
      model.setPlayerMove(MOVES.PAPER);
      model.setComputerMove(MOVES.SCISSORS);

      expect(model.evaluateRound()).toBe("Computer wins!");
      expect(model.getComputerScore()).toBe(1);
      expect(model.getPlayerScore()).toBe(0);
    });
  });

  describe("Round Number", () => {
    test("getRoundNumber returns 1 by default if not previously set", () => {
      expect(model.getRoundNumber()).toBe(1);
    });

    test("setRoundNumber updates the state and localStorage", () => {
      model.setRoundNumber(3);
      expect(model.getRoundNumber()).toBe(3);
      expect(localStorage.getItem("roundNumber")).toBe("3");
    });

    test("increaseRoundNumber increments the round number by 1", () => {
      model.setRoundNumber(2);
      model.increaseRoundNumber();
      expect(model.getRoundNumber()).toBe(3);
    });
  });

  describe("Tara", () => {
    test("getTaraCount returns 0 by default", () => {
      expect(model.getPlayerTaraCount()).toBe(0);
      expect(model.getComputerTaraCount()).toBe(0);
    });

    test("setTaraCount updates the Tara count and localStorage", () => {
      model.setPlayerTaraCount(2);
      expect(model.getPlayerTaraCount()).toBe(2);
      expect(localStorage.getItem("playerTaraCount")).toBe("2");
    });

    test("Tara count persists between model instances", () => {
      model.setComputerTaraCount(1);
      // Recreate model to simulate a page reload
      model = new Model();
      expect(model.getComputerTaraCount()).toBe(1);
    });

    test("Tara does not affect score when played against itself", () => {
      model.setPlayerMove(MOVES.TARA);
      model.setComputerMove(MOVES.TARA);
      expect(model.evaluateRound()).toBe("It's a tie!");
      expect(model.getPlayerScore()).toBe(0);
      expect(model.getComputerScore()).toBe(0);
    });

    test("Tara beats all standard moves", () => {
      for (const move of STANDARD_MOVE_DATA_MAP.keys()) {
        model.setPlayerMove(MOVES.TARA);
        model.setComputerMove(move);
        expect(model.evaluateRound()).toBe("You win!");
      }
    });

    test("Standard moves lose to Tara", () => {
      for (const move of STANDARD_MOVE_DATA_MAP.keys()) {
        model.setPlayerMove(move);
        model.setComputerMove(MOVES.TARA);
        expect(model.evaluateRound()).toBe("Computer wins!");
      }
    });

    test("Tara is not granted after winning with Tara", () => {
      model.setPlayerMove(MOVES.TARA);
      model.setComputerMove(MOVES.ROCK);
      const initialTaraCount = model.getPlayerTaraCount();

      model.evaluateRound();

      // Should still be the same since Tara doesn't earn Tara
      expect(model.getPlayerTaraCount()).toBe(initialTaraCount);
    });

    test("Playing Tara decreases Tara count by 1 for player", () => {
      model.setPlayerTaraCount(2);
      model.setPlayerMove(MOVES.TARA);
      model.setComputerMove(MOVES.ROCK);

      model.evaluateRound();

      expect(model.getPlayerTaraCount()).toBe(1);
    });

    test("Computer's Tara count decreases by 1 when it plays Tara", () => {
      model.setComputerTaraCount(1);
      model.setPlayerMove(MOVES.ROCK);
      model.setComputerMove(MOVES.TARA);

      model.evaluateRound();

      expect(model.getComputerTaraCount()).toBe(0);
    });

    describe("Mitigating illegal Tara use", () => {
      test("should never choose tara when tara count is 0", () => {
        model.setComputerTaraCount(0);

        const results = simulateComputerChoices(model, 500);

        expect(results.tara).toBe(0);
      });

      test("should sometimes choose tara when tara count is > 0", () => {
        model.setComputerTaraCount(5);

        const results = simulateComputerChoices(model, 500);

        // Allow a small chance that tara isn't chosen due to randomness
        expect(results.tara).toBeGreaterThan(0);
      });

      test("should not let computer use tara twice when it only has 1 (with move reuse)", () => {
        model.setComputerTaraCount(1);

        let taraUsed = 0;

        // Simulate a few rounds of gameplay
        for (let i = 0; i < 3; i++) {
          model.setComputerMove(MOVES.TARA); // Computer tries to use tara
          model.setPlayerMove(MOVES.ROCK); // Player chooses rock
          model.evaluateRound(); // Evaluate round, this should handle resetting and tara usage

          // Check if tara was used
          if (model.getComputerMove() === MOVES.TARA) {
            taraUsed++;
          }
        }

        // Expect that tara was only used once
        expect(taraUsed).toBe(1);
        // Expect that the tara count is decremented to 0
        expect(model.getComputerTaraCount()).toBe(0);
      });

      test("should not let player use tara when they have 0 remaining (with move reuse)", () => {
        model.setPlayerTaraCount(0); // Start with no tara for the player

        let taraUsed = 0;

        // Simulate a few rounds of gameplay
        for (let i = 0; i < 3; i++) {
          model.setPlayerMove(MOVES.TARA); // Player tries to use tara
          model.setComputerMove(MOVES.ROCK); // Computer chooses rock
          model.evaluateRound(); // Evaluate round, this should handle illegal tara usage

          // Check if tara was used by the player
          if (model.getPlayerMove() === MOVES.TARA) {
            taraUsed++;
          }
        }

        // Expect that tara was not used at all by the player
        expect(taraUsed).toBe(0);
        // Expect that the tara count for the player remains 0
        expect(model.getPlayerTaraCount()).toBe(0);
      });
    });
  });

  describe("Reset", () => {
    test("resetScores should set both player and computer scores to 0", () => {
      model.setPlayerScore(3);
      model.setComputerScore(2);
      model.resetScores();
      expect(model.getPlayerScore()).toBe(0);
      expect(model.getComputerScore()).toBe(0);
    });

    test("resetRoundNumber should set round number to 1", () => {
      model.setRoundNumber(5);
      model.resetRoundNumber();
      expect(model.getRoundNumber()).toBe(1);
    });

    test("resetTaras should set both player and computer Tara counts to 0", () => {
      model.setPlayerTaraCount(2);
      model.setComputerTaraCount(4);
      model.resetTaras();
      expect(model.getPlayerTaraCount()).toBe(0);
      expect(model.getComputerTaraCount()).toBe(0);
    });

    test("resetMostCommonMoves removes most common moves from localStorage", () => {
      localStorage.setItem("playerMostCommonMove", MOVES.ROCK);
      localStorage.setItem("computerMostCommonMove", MOVES.SCISSORS);

      model.resetMostCommonMoves();

      expect(localStorage.getItem("playerMostCommonMove")).toBeNull();
      expect(localStorage.getItem("computerMostCommonMove")).toBeNull();
    });

    test("resetMostCommonMoves clears most common move from state", () => {
      model.setPlayerMostCommonMove();
      model.setComputerMostCommonMove();

      model.resetMostCommonMoves();

      expect(model.getPlayerMostCommonMove()).toBeNull();
      expect(model.getComputerMostCommonMove()).toBeNull();
    });

    test("resetHistories clears histories from localStorage", () => {
      localStorage.setItem(
        "playerHistory",
        JSON.stringify([MOVES.ROCK, MOVES.PAPER])
      );
      localStorage.setItem(
        "computerHistory",
        JSON.stringify([MOVES.SCISSORS, MOVES.ROCK])
      );

      model.resetHistories();

      expect(localStorage.getItem("playerHistory")).toBe(null);
      expect(localStorage.getItem("computerHistory")).toBe(null);
    });

    test("resetBothMoveCounts resets both participants' localStorage counts", () => {
      const playerMoveCounts = {
        rock: 1,
        paper: 1,
        scissors: 0,
      };
      const computerMoveCounts = {
        rock: 1,
        paper: 0,
        scissors: 1,
      };

      model.registerPlayerMove(MOVES.ROCK);
      model.registerPlayerMove(MOVES.PAPER);
      model.registerComputerMove(MOVES.SCISSORS);
      model.registerComputerMove(MOVES.ROCK);

      const initialPlayerStorage = localStorage.getItem("playerMoveCounts");
      const initialComputerStorage = localStorage.getItem("computerMoveCounts");

      expect(JSON.parse(initialPlayerStorage!)).toEqual(playerMoveCounts);
      expect(JSON.parse(initialComputerStorage!)).toEqual(computerMoveCounts);

      model.resetBothMoveCounts();

      const playerStorage = localStorage.getItem("playerMoveCounts");
      const computerStorage = localStorage.getItem("computerMoveCounts");

      expect(JSON.parse(playerStorage!)).toEqual(null);
      expect(JSON.parse(computerStorage!)).toEqual(null);
    });
  });

  describe("Most Common Move", () => {
    test("sets and gets most common move for player", () => {
      model["state"].moveCounts.player = {
        rock: 1,
        paper: 3,
        scissors: 2,
      };

      model.setPlayerMostCommonMove();
      const result = model.getPlayerMostCommonMove();

      expect(result).toBe(MOVES.PAPER);
    });

    test("sets and gets most common move for computer", () => {
      model["state"].moveCounts.computer = {
        rock: 1,
        paper: 0,
        scissors: 2,
      };

      model.setComputerMostCommonMove();
      const result = model.getComputerMostCommonMove();

      expect(result).toBe(MOVES.SCISSORS);
    });

    test("persists most common move to localStorage", () => {
      model["state"].moveCounts.player = {
        rock: 0,
        paper: 2,
        scissors: 1,
      };

      model.setPlayerMostCommonMove();
      const stored = localStorage.getItem("playerMostCommonMove");

      expect(stored).toBe(MOVES.PAPER);
    });

    test("returns null when no move history", () => {
      model.setComputerMostCommonMove();
      const result = model.getComputerMostCommonMove();

      expect(result).toBeNull();
    });

    test("registerPlayerMove updates most common move", () => {
      model.registerPlayerMove(MOVES.ROCK);
      model.registerPlayerMove(MOVES.ROCK);
      model.registerPlayerMove(MOVES.PAPER);

      expect(model.getPlayerMostCommonMove()).toBe(MOVES.ROCK);
      expect(localStorage.getItem("playerMostCommonMove")).toBe(MOVES.ROCK);
    });

    test("registerPlayerMove with 'tara' does not affect most common move", () => {
      model.registerPlayerMove(MOVES.ROCK);
      model.registerPlayerMove(MOVES.ROCK);
      model.registerPlayerMove(MOVES.PAPER);

      // 'rock' should be the most common so far
      expect(model.getPlayerMostCommonMove()).toBe(MOVES.ROCK);

      // Add 'tara' multiple times
      model.registerPlayerMove(MOVES.TARA);
      model.registerPlayerMove(MOVES.TARA);
      model.registerPlayerMove(MOVES.TARA);

      // And the most common move didn't change to 'tara'
      expect(model.getPlayerMostCommonMove()).toBe(MOVES.ROCK);
    });

    test("most common move changes when enough additional moves are added to history", () => {
      model.registerPlayerMove(MOVES.ROCK);
      model.registerPlayerMove(MOVES.ROCK);
      model.registerPlayerMove(MOVES.PAPER);

      // 'rock' should be the most common so far
      expect(model.getPlayerMostCommonMove()).toBe(MOVES.ROCK);

      // Add 'scissor' multiple times
      model.registerPlayerMove(MOVES.SCISSORS);
      model.registerPlayerMove(MOVES.SCISSORS);
      model.registerPlayerMove(MOVES.SCISSORS);

      // Verify the most common move changed to 'scissors'
      expect(model.getPlayerMostCommonMove()).toBe(MOVES.SCISSORS);
    });

    test("registerComputerMove sets most common move after first standard move", () => {
      model.registerComputerMove(MOVES.SCISSORS);
      expect(model.getComputerMostCommonMove()).toBe(MOVES.SCISSORS);
    });

    test("most common move is null before any standard moves are registered", () => {
      expect(model.getPlayerMostCommonMove()).toBeNull();
      expect(model.getComputerMostCommonMove()).toBeNull();
    });

    test("returns false when round is 1", () => {
      jest.spyOn(model, "getRoundNumber").mockReturnValue(1);
      jest.spyOn(model, "getPlayerMostCommonMove").mockReturnValue(MOVES.ROCK);
      jest
        .spyOn(model, "getComputerMostCommonMove")
        .mockReturnValue(MOVES.SCISSORS);

      expect(model.showMostCommonMove()).toBe(false);
    });

    describe("showMostCommonMove", () => {
      test("returns false when round is 1", () => {
        jest.spyOn(model, "getRoundNumber").mockReturnValue(1);
        jest
          .spyOn(model, "getPlayerMostCommonMove")
          .mockReturnValue(MOVES.ROCK);
        jest
          .spyOn(model, "getComputerMostCommonMove")
          .mockReturnValue(MOVES.SCISSORS);

        expect(model.showMostCommonMove()).toBe(false);
      });

      test("returns false when both player and computer most common moves are missing", () => {
        jest.spyOn(model, "getRoundNumber").mockReturnValue(3);
        jest.spyOn(model, "getPlayerMostCommonMove").mockReturnValue(null);
        jest.spyOn(model, "getComputerMostCommonMove").mockReturnValue(null);

        expect(model.showMostCommonMove()).toBe(false);
      });

      test("returns true when only player most common move is present", () => {
        jest.spyOn(model, "getRoundNumber").mockReturnValue(3);
        jest
          .spyOn(model, "getPlayerMostCommonMove")
          .mockReturnValue(MOVES.ROCK);
        jest.spyOn(model, "getComputerMostCommonMove").mockReturnValue(null);

        expect(model.showMostCommonMove()).toBe(true);
      });

      test("returns true when only computer most common move is present", () => {
        jest.spyOn(model, "getRoundNumber").mockReturnValue(3);
        jest.spyOn(model, "getPlayerMostCommonMove").mockReturnValue(null);
        jest
          .spyOn(model, "getComputerMostCommonMove")
          .mockReturnValue(MOVES.PAPER);

        expect(model.showMostCommonMove()).toBe(true);
      });

      test("returns true when both player and computer most common moves are present", () => {
        jest.spyOn(model, "getRoundNumber").mockReturnValue(3);
        jest
          .spyOn(model, "getPlayerMostCommonMove")
          .mockReturnValue(MOVES.SCISSORS);
        jest
          .spyOn(model, "getComputerMostCommonMove")
          .mockReturnValue(MOVES.PAPER);

        expect(model.showMostCommonMove()).toBe(true);
      });
    });

    describe("Tie Handling", () => {
      test("determineMostCommonMove returns null when there is a tie between two moves (player)", () => {
        model["state"].moveCounts.player = {
          rock: 2,
          paper: 2,
          scissors: 1,
        };

        model.setPlayerMostCommonMove();

        expect(model.getPlayerMostCommonMove()).toBeNull();
        expect(localStorage.getItem("playerMostCommonMove")).toBeNull();
      });

      test("determineMostCommonMove returns null when there is a tie between two moves (computer)", () => {
        model["state"].moveCounts.computer = {
          rock: 1,
          paper: 3,
          scissors: 3,
        };

        model.setComputerMostCommonMove();

        expect(model.getComputerMostCommonMove()).toBeNull();
        expect(localStorage.getItem("computerMostCommonMove")).toBeNull();
      });

      test("determineMostCommonMove returns null when there is a three-way tie", () => {
        model["state"].moveCounts.player = {
          rock: 1,
          paper: 1,
          scissors: 1,
        };

        model.setPlayerMostCommonMove();

        expect(model.getPlayerMostCommonMove()).toBeNull();
        expect(localStorage.getItem("playerMostCommonMove")).toBeNull();
      });

      test("determineMostCommonMove returns null when all counts are zero (explicit test)", () => {
        model["state"].moveCounts.player = {
          rock: 0,
          paper: 0,
          scissors: 0,
        };

        model.setPlayerMostCommonMove();

        expect(model.getPlayerMostCommonMove()).toBeNull();
        expect(localStorage.getItem("playerMostCommonMove")).toBeNull();
      });

      test("most common move becomes null if subsequent moves result in a tie after a non-tied state", () => {
        model["state"].moveCounts.player = {
          rock: 3,
          paper: 1,
          scissors: 1,
        };
        model.setPlayerMostCommonMove();
        expect(model.getPlayerMostCommonMove()).toBe(MOVES.ROCK);
        expect(localStorage.getItem("playerMostCommonMove")).toBe(MOVES.ROCK);

        model["state"].moveCounts.player = {
          rock: 3,
          paper: 3,
          scissors: 1,
        };
        model.setPlayerMostCommonMove();

        expect(model.getPlayerMostCommonMove()).toBeNull();
        expect(localStorage.getItem("playerMostCommonMove")).toBeNull();
      });

      test("most common move becomes null if all counts become zero after a non-zero state", () => {
        model["state"].moveCounts.player = {
          rock: 3,
          paper: 1,
          scissors: 1,
        };
        model.setPlayerMostCommonMove();
        expect(model.getPlayerMostCommonMove()).toBe(MOVES.ROCK);
        expect(localStorage.getItem("playerMostCommonMove")).toBe(MOVES.ROCK);

        model["state"].moveCounts.player = {
          rock: 0,
          paper: 0,
          scissors: 0,
        };
        model.setPlayerMostCommonMove();

        expect(model.getPlayerMostCommonMove()).toBeNull();
        expect(localStorage.getItem("playerMostCommonMove")).toBeNull();
      });
    });
  });

  describe("showMostCommonMove", () => {
    test("returns true when round > 1 and both most common moves exist", () => {
      jest.spyOn(model, "getRoundNumber").mockReturnValue(2);
      jest.spyOn(model, "getPlayerMostCommonMove").mockReturnValue(MOVES.ROCK);
      jest
        .spyOn(model, "getComputerMostCommonMove")
        .mockReturnValue(MOVES.SCISSORS);

      expect(model.showMostCommonMove()).toBe(true);
    });
  });

  describe("ComputerModel AI", () => {
    test("chooses randomly when no player history exists", () => {
      const results = simulateComputerChoices(model, 300);
      expect(results.rock).toBeGreaterThan(0);
      expect(results.paper).toBeGreaterThan(0);
      expect(results.scissors).toBeGreaterThan(0);
    });

    test("favors counter to most common player move", () => {
      for (let i = 0; i < 20; i++) {
        model.registerPlayerMove(MOVES.ROCK);
      }

      const results = simulateComputerChoices(model, 300);
      expect(results.paper).toBeGreaterThan(results.scissors);
      expect(results.paper).toBeGreaterThan(results.rock);
    });

    test("adjusts to updated player move history", () => {
      for (let i = 0; i < 20; i++) {
        model.registerPlayerMove(MOVES.SCISSORS);
      }

      const results = simulateComputerChoices(model, 300);
      expect(results.rock).toBeGreaterThan(results.paper);
      expect(results.rock).toBeGreaterThan(results.scissors);
    });

    test("respects tara count: does not choose tara when tara count is 0", () => {
      model.setComputerTaraCount(0);
      for (let i = 0; i < 20; i++) {
        model.registerPlayerMove(MOVES.PAPER);
      }

      const results = simulateComputerChoices(model, 300);
      expect(results.tara).toBe(0);
    });

    test("uses tara when tara count is available", () => {
      model.setComputerTaraCount(5);
      for (let i = 0; i < 20; i++) {
        model.registerPlayerMove(MOVES.ROCK);
      }

      const results = simulateComputerChoices(model, 300);
      expect(results.tara).toBeGreaterThan(0);
    });

    test("uses tara less than counter moves even when available", () => {
      model.setComputerTaraCount(100); // High count to test frequency
      for (let i = 0; i < 20; i++) {
        model.registerPlayerMove(MOVES.SCISSORS);
      }

      const results = simulateComputerChoices(model, 300);
      expect(results.rock).toBeGreaterThan(results.tara); // Rock is the counter to scissors
    });

    test("defaults to random when all move frequencies are equal", () => {
      for (let i = 0; i < 10; i++) {
        model.registerPlayerMove(MOVES.ROCK);
        model.registerPlayerMove(MOVES.PAPER);
        model.registerPlayerMove(MOVES.SCISSORS);
      }

      const results = simulateComputerChoices(model, 300);
      expect(results.rock).toBeGreaterThan(0);
      expect(results.paper).toBeGreaterThan(0);
      expect(results.scissors).toBeGreaterThan(0);
    });
  });
});
