import { Model } from "./model";
import { MOVES, STANDARD_MOVE_DATA_MAP } from "../utils/dataUtils";
import { Move } from "../utils/dataObjectUtils";

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
  let model: Model;

  beforeEach(() => {
    localStorage.clear();
    model = new Model();
  });

  // ===== Score Tests =====

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

  // ===== Move Tests =====

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

  // ===== Evaluate Round Tests =====

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

  // ===== Round Number Tests =====

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

  // ===== Tara Tests =====

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

  // ===== Reset Tests =====

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

  // ===== History Tests =====

  test("registerPlayerMove adds standard move to history", () => {
    model.registerPlayerMove(MOVES.ROCK);
    expect(model.getPlayerHistory()).toContain(MOVES.ROCK);
    expect(localStorage.getItem("playerHistory")).toContain(MOVES.ROCK);
  });

  test("registerPlayerMove does not add 'tara' to history", () => {
    model.registerPlayerMove(MOVES.TARA);
    expect(model.getPlayerHistory()).not.toContain(MOVES.TARA);
  });

  test("setHistory stores move and updates localStorage", () => {
    model.setPlayerHistory("paper");
    expect(model.getPlayerHistory()).toContain("paper");
    expect(JSON.parse(localStorage.getItem("playerHistory")!)).toContain(
      "paper"
    );
  });

  test("getComputerHistory returns empty array if no localStorage data", () => {
    localStorage.removeItem("computerHistory");

    const newModel = new Model(); // simulate app reload
    expect(newModel.getComputerHistory()).toEqual([]);
  });

  test("getPlayerHistory handles corrupted localStorage gracefully", () => {
    localStorage.setItem("playerHistory", "{not: valid}");

    const newModel = new Model(); // simulate app reload
    expect(() => newModel.getPlayerHistory()).not.toThrow();
    expect(newModel.getPlayerHistory()).toEqual([]);
  });
});
