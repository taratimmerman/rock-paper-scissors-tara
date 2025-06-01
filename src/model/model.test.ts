import { Model } from "./model";
import {
  DAMAGE_PER_LOSS,
  DEFAULT_MATCH,
  DEFAULT_MATCH_NUMBER,
  INITIAL_HEALTH,
  MOVES,
  PARTICIPANTS,
  STANDARD_MOVE_DATA_MAP,
} from "../utils/dataUtils";
import {
  Match,
  Move,
  MoveCount,
  Participant,
  StandardMove,
} from "../utils/dataObjectUtils";
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
      getScore: jest.fn((participant: Participant) => {
        return parseInt(localStorage.getItem(`${participant}Score`) || "0", 10);
      }),
      setScore: jest.fn(),
      removeScore: jest.fn(),
      getTaraCount: jest.fn((participant: Participant) => {
        return parseInt(
          localStorage.getItem(`${participant}TaraCount`) || "0",
          10
        );
      }),
      setTaraCount: jest.fn(),
      removeTaraCount: jest.fn(),
      getMostCommonMove: jest.fn((participant: Participant) => {
        const move = localStorage.getItem(`${participant}MostCommonMove`);
        return move &&
          (["rock", "paper", "scissors"] as StandardMove[]).includes(
            move as StandardMove
          )
          ? (move as StandardMove)
          : null;
      }),
      setMostCommonMove: jest.fn(
        (participant: Participant, move: StandardMove | null) => {
          if (move) {
            localStorage.setItem(`${participant}MostCommonMove`, move);
          } else {
            localStorage.removeItem(`${participant}MostCommonMove`);
          }
        }
      ),
      removeMostCommonMove: jest.fn((participant: Participant) => {
        localStorage.removeItem(`${participant}MostCommonMove`);
      }),
      getMoveCounts: jest.fn((participant: Participant) => {
        const raw = localStorage.getItem(`${participant}MoveCounts`);
        const parsed = raw ? JSON.parse(raw) : null;
        return parsed || { rock: 0, paper: 0, scissors: 0 };
      }),
      setMoveCounts: jest.fn(
        (participant: Participant, moveCounts: MoveCount) => {
          // JSON.stringify the moveCounts object and store it
          localStorage.setItem(
            `${participant}MoveCounts`,
            JSON.stringify(moveCounts)
          );
        }
      ),
      removeMoveCounts: jest.fn((participant: Participant) => {
        localStorage.removeItem(`${participant}MoveCounts`);
      }),
      removeHistory: jest.fn((participant: Participant) => {
        localStorage.removeItem(`${participant}History`);
      }),
      getMatch: jest.fn(() => null),
      setMatch: jest.fn(),
      getGlobalMatchNumber: jest.fn(() => 1),
      setGlobalMatchNumber: jest.fn(),
      removeGlobalMatchNumber: jest.fn(),
      getOldGlobalRoundNumber: jest.fn(() => null),
      removeOldGlobalRoundNumber: jest.fn(),
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

    test("does not increment on player round win", () => {
      model.setPlayerMove(MOVES.TARA);
      model.setComputerMove(MOVES.SCISSORS);

      model.evaluateRound();
      expect(model.getPlayerScore()).toBe(0);
      expect(model.getComputerScore()).toBe(0);
    });

    test("does not increment on computer round win", () => {
      model.setPlayerMove(MOVES.ROCK);
      model.setComputerMove(MOVES.PAPER);

      model.evaluateRound();
      expect(model.getPlayerScore()).toBe(0);
      expect(model.getComputerScore()).toBe(0);
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

    test("returns 'You win the round!' if player beats computer and updates score", () => {
      model.setPlayerMove(MOVES.ROCK);
      model.setComputerMove(MOVES.SCISSORS);

      expect(model.evaluateRound()).toBe("You win the round!");
    });

    test("returns 'Computer wins the round!' if computer beats player and updates score", () => {
      model.setPlayerMove(MOVES.PAPER);
      model.setComputerMove(MOVES.SCISSORS);

      expect(model.evaluateRound()).toBe("Computer wins the round!");
    });
  });

  describe("Round Number", () => {
    test("getRoundNumber returns 1 by default if not previously set", () => {
      expect(model.getRoundNumber()).toBe(1);
    });

    test("setRoundNumber updates the matchRoundNumber in state and storage", () => {
      mockGameStorage.getMatch.mockReturnValue({
        matchRoundNumber: 1,
        playerHealth: INITIAL_HEALTH,
        computerHealth: INITIAL_HEALTH,
      });

      const model = new Model(mockGameStorage);
      model.setRoundNumber(3);

      expect(model.getRoundNumber()).toBe(3);
      expect(mockGameStorage.setMatch).toHaveBeenCalledWith(
        expect.objectContaining({ matchRoundNumber: 3 })
      );
    });

    test("increaseRoundNumber increments the matchRoundNumber by 1", () => {
      mockGameStorage.getMatch.mockReturnValue({
        matchRoundNumber: 2,
        playerHealth: INITIAL_HEALTH,
        computerHealth: INITIAL_HEALTH,
      });

      const model = new Model(mockGameStorage);
      model.increaseRoundNumber();

      expect(model.getRoundNumber()).toBe(3);
      expect(mockGameStorage.setMatch).toHaveBeenCalledWith(
        expect.objectContaining({ matchRoundNumber: 3 })
      );
    });
  });

  describe("Tara", () => {
    test("getTaraCount returns 0 by default", () => {
      expect(model.getPlayerTaraCount()).toBe(0);
      expect(model.getComputerTaraCount()).toBe(0);
    });

    test("setTaraCount updates the Tara count and calls gameStorage", () => {
      jest.clearAllMocks(); // Clear calls from constructor

      model.setPlayerTaraCount(2);
      expect(model.getPlayerTaraCount()).toBe(2);
      expect(mockGameStorage.setTaraCount).toHaveBeenCalledWith(
        PARTICIPANTS.PLAYER,
        2
      );
    });

    test("Tara count persists between model instances", () => {
      // Temporarily override the mock's behavior for this specific test
      // Make setTaraCount actually write to the mock localStorage
      mockGameStorage.setTaraCount.mockImplementation((participant, count) => {
        localStorage.setItem(`${participant}TaraCount`, count.toString());
      });

      // Make getTaraCount actually read from the mock localStorage
      mockGameStorage.getTaraCount.mockImplementation((participant) => {
        const stored = localStorage.getItem(`${participant}TaraCount`);
        return stored ? parseInt(stored, 10) : 0;
      });

      model.setComputerTaraCount(1);
      // Recreate model to simulate a page reload
      model = new Model(mockGameStorage);
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
        expect(model.evaluateRound()).toBe("You win the round!");
      }
    });

    test("Standard moves lose to Tara", () => {
      for (const move of STANDARD_MOVE_DATA_MAP.keys()) {
        model.setPlayerMove(move);
        model.setComputerMove(MOVES.TARA);
        expect(model.evaluateRound()).toBe("Computer wins the round!");
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

    describe("showMostCommonMove", () => {
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

  describe("isMatchActive", () => {
    test("returns false if currentMatch is null", () => {
      const model = new Model(mockGameStorage);
      expect(model.isMatchActive()).toBe(false);
    });

    test("returns true if currentMatch is a valid Match object", () => {
      const validMatch: Match = {
        matchRoundNumber: 1,
        playerHealth: 100,
        computerHealth: 50,
      };

      // Override getMatch to return a real match
      mockGameStorage.getMatch.mockReturnValue(validMatch);

      const model = new Model(mockGameStorage);
      expect(model.isMatchActive()).toBe(true);
    });
  });

  describe("Match number and match persistence", () => {
    test("initializes globalMatchNumber to DEFAULT_MATCH_NUMBER when storage returns null", () => {
      expect(model.getMatchNumber()).toBe(DEFAULT_MATCH_NUMBER);
    });

    test("falls back to DEFAULT_MATCH when no currentMatch is found", () => {
      expect(model["state"].currentMatch).toBeNull();

      model.setDefaultMatchData();

      expect(model["state"].currentMatch).toEqual(DEFAULT_MATCH);
    });

    test("incrementMatchNumber increases the match number by 1", () => {
      const initialMatchNumber = 1;
      model["state"].globalMatchNumber = initialMatchNumber;

      model.incrementMatchNumber();

      expect(model["state"].globalMatchNumber).toEqual(initialMatchNumber + 1);
    });
  });

  describe("Health", () => {
    test("decrements computer's health when player wins round", () => {
      model.setMatch({ ...DEFAULT_MATCH });
      model.setPlayerMove(MOVES.ROCK);
      model.setComputerMove(MOVES.SCISSORS);

      // Verify initial state
      expect(model["state"].currentMatch?.computerHealth).toBe(INITIAL_HEALTH);
      expect(model["state"].currentMatch?.playerHealth).toBe(INITIAL_HEALTH);

      expect(model.evaluateRound()).toBe("You win the round!");

      // Verify health updates as expected
      expect(model["state"].currentMatch?.computerHealth).toBe(
        INITIAL_HEALTH - DAMAGE_PER_LOSS
      );
      expect(model["state"].currentMatch?.playerHealth).toBe(INITIAL_HEALTH);
    });

    test("decrements player's health when computer wins round", () => {
      model.setMatch({ ...DEFAULT_MATCH });
      model.setComputerMove(MOVES.PAPER);
      model.setPlayerMove(MOVES.ROCK);

      // Verify initial state
      expect(model["state"].currentMatch?.playerHealth).toBe(INITIAL_HEALTH);
      expect(model["state"].currentMatch?.computerHealth).toBe(INITIAL_HEALTH);

      expect(model.evaluateRound()).toBe("Computer wins the round!");

      // Verify health updates as expected
      expect(model["state"].currentMatch?.playerHealth).toBe(
        INITIAL_HEALTH - DAMAGE_PER_LOSS
      );
      expect(model["state"].currentMatch?.computerHealth).toBe(INITIAL_HEALTH);
    });

    test("doesn't decrement health round is tie", () => {
      model.setMatch({ ...DEFAULT_MATCH });
      model.setPlayerMove(MOVES.SCISSORS);
      model.setComputerMove(MOVES.SCISSORS);

      // Verify initial state
      expect(model["state"].currentMatch?.playerHealth).toBe(INITIAL_HEALTH);
      expect(model["state"].currentMatch?.computerHealth).toBe(INITIAL_HEALTH);

      expect(model.evaluateRound()).toBe("It's a tie!");

      // Verify health didn't update
      expect(model["state"].currentMatch?.playerHealth).toBe(INITIAL_HEALTH);
      expect(model["state"].currentMatch?.computerHealth).toBe(INITIAL_HEALTH);
    });

    test("returns false if both participants have health > 0", () => {
      model.setMatch({ ...DEFAULT_MATCH });

      expect(model.isMatchOver()).toBe(false);
    });
  });

  describe("isMatchOver", () => {
    test("returns true if player's health is 0", () => {
      model.setMatch({ ...DEFAULT_MATCH });
      model.setPlayerMove(MOVES.ROCK);
      model.setComputerMove(MOVES.TARA);
      model.evaluateRound();
      model.setPlayerMove(MOVES.PAPER);
      model.setComputerMove(MOVES.SCISSORS);
      model.evaluateRound();

      expect(model.isMatchOver()).toBe(true);
    });

    test("returns true if computer's health is 0", () => {
      model.setMatch({ ...DEFAULT_MATCH });
      model.setPlayerMove(MOVES.ROCK);
      model.setComputerMove(MOVES.SCISSORS);
      model.evaluateRound();
      model.setPlayerMove(MOVES.TARA);
      model.setComputerMove(MOVES.PAPER);
      model.evaluateRound();

      expect(model.isMatchOver()).toBe(true);
    });

    test("returns false if no match active", () => {
      expect(model.isMatchActive()).toBe(false);
      expect(model.isMatchOver()).toBe(false);
    });
  });

  describe("getMatchWinner", () => {
    test("returns PARTICIPANTS.COMPUTER if Player is defeated", () => {
      model.setMatch({ ...DEFAULT_MATCH });
      model.setPlayerMove(MOVES.ROCK);
      model.setComputerMove(MOVES.TARA);
      model.evaluateRound();
      model.setPlayerMove(MOVES.PAPER);
      model.setComputerMove(MOVES.SCISSORS);
      model.evaluateRound();
      expect(model.isMatchOver()).toBe(true);

      expect(model.getMatchWinner()).toBe(PARTICIPANTS.COMPUTER);
    });

    test("returns PARTICIPANTS.PLAYER if Computer is defeated", () => {
      model.setMatch({ ...DEFAULT_MATCH });
      model.setPlayerMove(MOVES.ROCK);
      model.setComputerMove(MOVES.SCISSORS);
      model.evaluateRound();
      model.setPlayerMove(MOVES.TARA);
      model.setComputerMove(MOVES.PAPER);
      model.evaluateRound();
      expect(model.isMatchOver()).toBe(true);

      expect(model.getMatchWinner()).toBe(PARTICIPANTS.PLAYER);
    });
  });

  describe("setDefaultMatchData", () => {
    test("creates new match object in memory when no match is active", () => {
      const initialMatch = {
        matchRoundNumber: 16,
        playerHealth: INITIAL_HEALTH,
        computerHealth: 50,
      };
      model.setMatch(initialMatch);

      model.setDefaultMatchData();
      const actualMatch = model["state"].currentMatch;

      expect(actualMatch).not.toBe(DEFAULT_MATCH);
      expect(JSON.stringify(actualMatch)).toEqual(
        JSON.stringify(DEFAULT_MATCH)
      );
    });

    test("does not reset when a match is active", () => {
      const activeMatchFromStorage: Match = {
        matchRoundNumber: 16,
        playerHealth: INITIAL_HEALTH,
        computerHealth: 50, // The unique value we'll check
      };
      model.setMatch(activeMatchFromStorage);
      mockGameStorage.getMatch.mockReturnValue(activeMatchFromStorage);
      expect(model.isMatchActive()).toBe(true);

      expect(model["state"].currentMatch?.computerHealth).toBe(50);
      model.setDefaultMatchData();
      expect(model["state"].currentMatch?.computerHealth).toBe(50);
    });
  });

  describe("handleMatchWin", () => {
    test("should increment the player's score and return PLAYER if player wins the match", () => {
      // Setup the model state to make the Player the match winner
      model.setMatch({ ...DEFAULT_MATCH });
      model.setPlayerMove(MOVES.ROCK);
      model.setComputerMove(MOVES.SCISSORS);
      model.evaluateRound();

      model.setPlayerMove(MOVES.TARA);
      model.setComputerMove(MOVES.PAPER);
      model.evaluateRound();

      expect(model.isMatchOver()).toBe(true);
      expect(model.getMatchWinner()).toBe(PARTICIPANTS.PLAYER);

      const initialPlayerScore = model.getPlayerScore();
      const initialComputerScore = model.getComputerScore();

      const winner = model.handleMatchWin(); // Call the method being tested

      expect(model.getPlayerScore()).toBe(initialPlayerScore + 1);
      expect(model.getComputerScore()).toBe(initialComputerScore);
      expect(winner).toBe(PARTICIPANTS.PLAYER);
    });

    test("should increment the computer's score and return COMPUTER if computer wins the match", () => {
      // Setup the model state to make the Computer the match winner
      model.setMatch({ ...DEFAULT_MATCH });
      model.setPlayerMove(MOVES.ROCK);
      model.setComputerMove(MOVES.TARA);
      model.evaluateRound();

      model.setPlayerMove(MOVES.PAPER);
      model.setComputerMove(MOVES.SCISSORS);
      model.evaluateRound();

      expect(model.isMatchOver()).toBe(true);
      expect(model.getMatchWinner()).toBe(PARTICIPANTS.COMPUTER);

      const initialPlayerScore = model.getPlayerScore();
      const initialComputerScore = model.getComputerScore();

      const winner = model.handleMatchWin(); // Call the method being tested

      expect(model.getPlayerScore()).toBe(initialPlayerScore);
      expect(model.getComputerScore()).toBe(initialComputerScore + 1);
      expect(winner).toBe(PARTICIPANTS.COMPUTER);
    });
  });
});

describe("Model Constructor - Initialization and Migration", () => {
  let constructorMockGameStorage: jest.Mocked<IGameStorage>;
  let constructorModel: Model;

  beforeEach(() => {
    constructorMockGameStorage = {
      getScore: jest.fn((participant: Participant) => 0),
      setScore: jest.fn((participant: Participant, score: number) => {}),
      removeScore: jest.fn((participant: Participant) => {}),

      getTaraCount: jest.fn((participant: Participant) => 0),
      setTaraCount: jest.fn((participant: Participant, count: number) => {}),
      removeTaraCount: jest.fn((participant: Participant) => {}),

      getMostCommonMove: jest.fn((participant: Participant) => null),
      setMostCommonMove: jest.fn(
        (participant: Participant, move: StandardMove | null) => {}
      ),
      removeMostCommonMove: jest.fn((participant: Participant) => {}),

      getMoveCounts: jest.fn((participant: Participant) => ({
        rock: 0,
        paper: 0,
        scissors: 0,
      })),
      setMoveCounts: jest.fn(
        (participant: Participant, moveCounts: MoveCount) => {}
      ),
      removeMoveCounts: jest.fn((participant: Participant) => {}),

      getRoundNumber: jest.fn(() => 1),
      removeHistory: jest.fn((participant: Participant) => {}),

      getMatch: jest.fn(() => null),
      setMatch: jest.fn(),
      getGlobalMatchNumber: jest.fn(() => 1),
      setGlobalMatchNumber: jest.fn(),
      removeGlobalMatchNumber: jest.fn(),
      getOldGlobalRoundNumber: jest.fn(() => null),
      removeOldGlobalRoundNumber: jest.fn(),
    } as jest.Mocked<IGameStorage>;

    jest.clearAllMocks();
  });

  // Test Scenario 1: No stored match data (no new match, no old round)
  test("should initialize with null match state if no match or old round number is stored", () => {
    // Explicitly set ALL necessary mock return values for this test scenario.
    // The Model constructor will call these methods to determine initial state.
    constructorMockGameStorage.getMatch.mockReturnValue(null);
    constructorMockGameStorage.getOldGlobalRoundNumber.mockReturnValue(null);
    constructorMockGameStorage.getGlobalMatchNumber.mockReturnValue(null);

    // Initialize the model *after* setting up mocks for this specific test.
    constructorModel = new Model(constructorMockGameStorage);

    expect(constructorModel["state"].currentMatch).toBeNull();
    expect(constructorModel["state"].globalMatchNumber).toBeNull();

    expect(constructorMockGameStorage.getMatch).toHaveBeenCalledTimes(1);
    expect(
      constructorMockGameStorage.getOldGlobalRoundNumber
    ).toHaveBeenCalledTimes(1);
    expect(
      constructorMockGameStorage.getGlobalMatchNumber
    ).not.toHaveBeenCalled();
    expect(
      constructorMockGameStorage.setGlobalMatchNumber
    ).not.toHaveBeenCalled();
    expect(constructorMockGameStorage.setMatch).not.toHaveBeenCalled();
    expect(
      constructorMockGameStorage.removeOldGlobalRoundNumber
    ).not.toHaveBeenCalled();
  });

  // Test Scenario 2: Resuming an Existing Match (New format)
  test("should load existing match and global match number from storage", () => {
    const existingMatch: Match = {
      matchRoundNumber: 3,
      playerHealth: 50,
      computerHealth: 100,
    };
    const existingGlobalMatchNumber = 5;

    // Set up specific mock return values *before* the model is re-initialized for this test
    constructorMockGameStorage.getMatch.mockReturnValue(existingMatch);
    constructorMockGameStorage.getGlobalMatchNumber.mockReturnValue(
      existingGlobalMatchNumber
    );
    constructorMockGameStorage.getOldGlobalRoundNumber.mockReturnValue(null); // Explicitly ensure this is null for this path

    // Re-initialize the model *after* setting up mocks for this specific test
    constructorModel = new Model(constructorMockGameStorage);

    expect(constructorModel["state"].currentMatch).toEqual(existingMatch);
    expect(constructorModel["state"].globalMatchNumber).toBe(
      existingGlobalMatchNumber
    );

    expect(constructorMockGameStorage.getMatch).toHaveBeenCalledTimes(2);
    expect(
      constructorMockGameStorage.getGlobalMatchNumber
    ).toHaveBeenCalledTimes(1);
    expect(
      constructorMockGameStorage.getOldGlobalRoundNumber
    ).not.toHaveBeenCalled(); // Should NOT be called
    expect(constructorMockGameStorage.setMatch).not.toHaveBeenCalled();
    expect(
      constructorMockGameStorage.setGlobalMatchNumber
    ).not.toHaveBeenCalled();
    expect(
      constructorMockGameStorage.removeOldGlobalRoundNumber
    ).not.toHaveBeenCalled();
  });

  // Test Scenario 3: Migration from Old Global Round Number
  test("should migrate old round number data to a new match object", () => {
    const oldRoundNumber = 7;
    constructorMockGameStorage.getMatch.mockReturnValue(null); // Ensure no new match
    constructorMockGameStorage.getOldGlobalRoundNumber.mockReturnValue(
      oldRoundNumber
    ); // Old round number exists

    // Re-initialize for this specific test's mocks
    constructorModel = new Model(constructorMockGameStorage);

    expect(constructorModel["state"].currentMatch).toEqual({
      matchRoundNumber: oldRoundNumber,
      playerHealth: INITIAL_HEALTH,
      computerHealth: INITIAL_HEALTH,
      initialHealth: INITIAL_HEALTH,
      damagePerLoss: DAMAGE_PER_LOSS,
    });
    expect(constructorModel["state"].globalMatchNumber).toBe(1);

    expect(constructorMockGameStorage.getMatch).toHaveBeenCalledTimes(1);
    expect(
      constructorMockGameStorage.getOldGlobalRoundNumber
    ).toHaveBeenCalledTimes(1);
    expect(constructorMockGameStorage.setMatch).toHaveBeenCalledTimes(1);
    expect(constructorMockGameStorage.setMatch).toHaveBeenCalledWith(
      constructorModel["state"].currentMatch
    );
    expect(
      constructorMockGameStorage.removeOldGlobalRoundNumber
    ).toHaveBeenCalledTimes(1);
    expect(
      constructorMockGameStorage.getGlobalMatchNumber
    ).not.toHaveBeenCalled();
    expect(
      constructorMockGameStorage.setGlobalMatchNumber
    ).toHaveBeenCalledTimes(1);
    expect(
      constructorMockGameStorage.setGlobalMatchNumber
    ).toHaveBeenCalledWith(1);
  });

  // Test Scenario 4: Old Global Round Number is Invalid (e.g., 0 or null from parse error)
  test("should have no match data if old round number data is invalid or null", () => {
    constructorMockGameStorage.getMatch.mockReturnValue(null); // Ensure no new match
    constructorMockGameStorage.getOldGlobalRoundNumber.mockReturnValue(0); // Simulate invalid old data

    // Re-initialize for this specific test's mocks
    constructorModel = new Model(constructorMockGameStorage);

    expect(constructorModel["state"].currentMatch).toBeNull();
    expect(constructorModel["state"].globalMatchNumber).toBeNull();

    expect(constructorMockGameStorage.getMatch).toHaveBeenCalledTimes(1);
    expect(
      constructorMockGameStorage.getOldGlobalRoundNumber
    ).toHaveBeenCalledTimes(1);
    expect(
      constructorMockGameStorage.removeOldGlobalRoundNumber
    ).not.toHaveBeenCalled();
    expect(constructorMockGameStorage.setMatch).not.toHaveBeenCalled();
    expect(
      constructorMockGameStorage.getGlobalMatchNumber
    ).not.toHaveBeenCalled();
    expect(
      constructorMockGameStorage.setGlobalMatchNumber
    ).not.toHaveBeenCalled();
  });

  // Test Scenario 5: Invalid Match Data (getMatch returns null due to parse error)
  test("should initialize no match data if stored currentMatch data is invalid and no old round data exists", () => {
    constructorMockGameStorage.getMatch.mockReturnValue(null); // Simulate parse error from storage
    constructorMockGameStorage.getOldGlobalRoundNumber.mockReturnValue(null); // No old data to fall back on

    // Re-initialize for this specific test's mocks
    constructorModel = new Model(constructorMockGameStorage);

    expect(constructorModel["state"].currentMatch).toBeNull();
    expect(constructorModel["state"].globalMatchNumber).toBeNull();

    expect(constructorMockGameStorage.getMatch).toHaveBeenCalledTimes(1);
    expect(
      constructorMockGameStorage.getOldGlobalRoundNumber
    ).toHaveBeenCalledTimes(1);
    expect(
      constructorMockGameStorage.setGlobalMatchNumber
    ).not.toHaveBeenCalled();
    expect(constructorMockGameStorage.setMatch).not.toHaveBeenCalled();
    expect(
      constructorMockGameStorage.removeOldGlobalRoundNumber
    ).not.toHaveBeenCalled();
  });

  // Test Scenario 6: Global Match Number Data is Invalid (getGlobalMatchNumber returns default 1)
  test("should still load active match, but default global match number if its data is invalid", () => {
    const existingMatch: Match = {
      matchRoundNumber: 1,
      playerHealth: 100,
      computerHealth: 100,
    };

    constructorMockGameStorage.getMatch.mockReturnValue(existingMatch);
    constructorMockGameStorage.getGlobalMatchNumber.mockReturnValue(1); // Simulate invalid data returning default 1
    constructorMockGameStorage.getOldGlobalRoundNumber.mockReturnValue(null); // Not checked in this path

    // Re-initialize for this specific test's mocks
    constructorModel = new Model(constructorMockGameStorage);

    expect(constructorModel["state"].currentMatch).toEqual(existingMatch);
    expect(constructorModel["state"].globalMatchNumber).toBe(1);

    expect(constructorMockGameStorage.getMatch).toHaveBeenCalledTimes(2);
    expect(
      constructorMockGameStorage.getGlobalMatchNumber
    ).toHaveBeenCalledTimes(1);
    expect(
      constructorMockGameStorage.getOldGlobalRoundNumber
    ).not.toHaveBeenCalled();
    expect(constructorMockGameStorage.setMatch).not.toHaveBeenCalled();
    expect(
      constructorMockGameStorage.setGlobalMatchNumber
    ).not.toHaveBeenCalled();
    expect(
      constructorMockGameStorage.removeOldGlobalRoundNumber
    ).not.toHaveBeenCalled();
  });
});
