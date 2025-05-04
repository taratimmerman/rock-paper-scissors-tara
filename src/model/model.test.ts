import { Model } from "./model";
import { MOVES, STANDARD_MOVE_MAP } from "../utils/dataUtils";
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
    expect(model.getScore("player")).toBe(0);
    expect(model.getScore("computer")).toBe(0);
  });

  test("setScore and getScore work together", () => {
    model.setScore("player", 5);
    model.setScore("computer", 3);

    expect(model.getScore("player")).toBe(5);
    expect(model.getScore("computer")).toBe(3);
  });

  // ===== Move Tests =====

  test("setPlayerMove and getPlayerMove work together", () => {
    model.setPlayerMove("rock");
    expect(model.getPlayerMove()).toBe("rock");

    model.setPlayerMove("paper");
    expect(model.getPlayerMove()).toBe("paper");
  });

  test("resetMoves clears the moves stored in state", () => {
    model.setPlayerMove("scissors");
    expect(model.getPlayerMove()).toBe("scissors");
    model.setComputerMove("paper");
    expect(model.getComputerMove()).toBe("paper");

    model.resetMoves();
    expect(model.getPlayerMove()).toBe(null);
    expect(model.getComputerMove()).toBe(null);
  });

  test("getPlayerMove returns null before a move is set", () => {
    expect(model.getPlayerMove()).toBe(null);
  });

  test("setComputerMove and getComputerMove store and retrieve the move", () => {
    model.setComputerMove("scissors");
    expect(model.getComputerMove()).toBe("scissors");
  });

  test("chooseComputerMove picks a valid move from MOVES", () => {
    model.chooseComputerMove();
    const move = model.getComputerMove();
    const validMoveNames = MOVES.map((m) => m.name);
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
      model.setComputerMove("rock");
      expect(model.evaluateRound()).toBe("Invalid round");
    });

    test("returns 'Invalid round' if computer move is missing", () => {
      model.setPlayerMove("paper");
      expect(model.evaluateRound()).toBe("Invalid round");
    });

    test("does not update scores on tie", () => {
      model.setPlayerMove("scissors");
      model.setComputerMove("scissors");

      expect(model.evaluateRound()).toBe("It's a tie!");
      expect(model.getScore("player")).toBe(0);
      expect(model.getScore("computer")).toBe(0);
    });

    test("returns 'You win!' if player beats computer and updates score", () => {
      model.setPlayerMove("rock");
      model.setComputerMove("scissors");

      expect(model.evaluateRound()).toBe("You win!");
      expect(model.getScore("player")).toBe(1);
      expect(model.getScore("computer")).toBe(0);
    });

    test("returns 'Computer wins!' if computer beats player and updates score", () => {
      model.setPlayerMove("paper");
      model.setComputerMove("scissors");

      expect(model.evaluateRound()).toBe("Computer wins!");
      expect(model.getScore("computer")).toBe(1);
      expect(model.getScore("player")).toBe(0);
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
      expect(model.getTaraCount("player")).toBe(0);
      expect(model.getTaraCount("computer")).toBe(0);
    });

    test("setTaraCount updates the Tara count and localStorage", () => {
      model.setTaraCount("player", 2);
      expect(model.getTaraCount("player")).toBe(2);
      expect(localStorage.getItem("playerTaraCount")).toBe("2");
    });

    test("Tara count persists between model instances", () => {
      model.setTaraCount("computer", 1);
      // Recreate model to simulate a page reload
      model = new Model();
      expect(model.getTaraCount("computer")).toBe(1);
    });

    test("Tara does not affect score when played against itself", () => {
      model.setPlayerMove("tara");
      model.setComputerMove("tara");
      expect(model.evaluateRound()).toBe("It's a tie!");
      expect(model.getScore("player")).toBe(0);
      expect(model.getScore("computer")).toBe(0);
    });

    test("Tara beats all standard moves", () => {
      for (const move of STANDARD_MOVE_MAP.keys()) {
        model.setPlayerMove("tara");
        model.setComputerMove(move);
        expect(model.evaluateRound()).toBe("You win!");
      }
    });

    test("Standard moves lose to Tara", () => {
      for (const move of STANDARD_MOVE_MAP.keys()) {
        model.setPlayerMove(move);
        model.setComputerMove("tara");
        expect(model.evaluateRound()).toBe("Computer wins!");
      }
    });

    test("Tara is not granted after winning with Tara", () => {
      model.setPlayerMove("tara");
      model.setComputerMove("rock");
      const initialTaraCount = model.getTaraCount("player");

      model.evaluateRound();

      // Should still be the same since Tara doesn't earn Tara
      expect(model.getTaraCount("player")).toBe(initialTaraCount);
    });

    test("Playing Tara decreases Tara count by 1 for player", () => {
      model.setTaraCount("player", 2);
      model.setPlayerMove("tara");
      model.setComputerMove("rock");

      model.evaluateRound();

      expect(model.getTaraCount("player")).toBe(1);
    });

    test("Computer's Tara count decreases by 1 when it plays Tara", () => {
      model.setTaraCount("computer", 1);
      model.setPlayerMove("rock");
      model.setComputerMove("tara");

      model.evaluateRound();

      expect(model.getTaraCount("computer")).toBe(0);
    });

    describe("Mitigating illegal Tara use", () => {
      test("should never choose tara when tara count is 0", () => {
        model.setTaraCount("computer", 0);

        const results = simulateComputerChoices(model, 500);

        expect(results.tara).toBe(0);
      });

      test("should sometimes choose tara when tara count is > 0", () => {
        model.setTaraCount("computer", 5);

        const results = simulateComputerChoices(model, 500);

        // Allow a small chance that tara isn't chosen due to randomness
        expect(results.tara).toBeGreaterThan(0);
      });

      test("should not let computer use tara twice when it only has 1 (with move reuse)", () => {
        model.setTaraCount("computer", 1);

        let taraUsed = 0;

        // Simulate a few rounds of gameplay
        for (let i = 0; i < 3; i++) {
          model.setComputerMove("tara"); // Computer tries to use tara
          model.setPlayerMove("rock"); // Player chooses rock
          model.evaluateRound(); // Evaluate round, this should handle resetting and tara usage

          // Check if tara was used
          if (model.getComputerMove() === "tara") {
            taraUsed++;
          }
        }

        // Expect that tara was only used once
        expect(taraUsed).toBe(1);
        // Expect that the tara count is decremented to 0
        expect(model.getTaraCount("computer")).toBe(0);
      });

      test("should not let player use tara when they have 0 remaining (with move reuse)", () => {
        model.setTaraCount("player", 0); // Start with no tara for the player

        let taraUsed = 0;

        // Simulate a few rounds of gameplay
        for (let i = 0; i < 3; i++) {
          model.setPlayerMove("tara"); // Player tries to use tara
          model.setComputerMove("rock"); // Computer chooses rock
          model.evaluateRound(); // Evaluate round, this should handle illegal tara usage

          // Check if tara was used by the player
          if (model.getPlayerMove() === "tara") {
            taraUsed++;
          }
        }

        // Expect that tara was not used at all by the player
        expect(taraUsed).toBe(0);
        // Expect that the tara count for the player remains 0
        expect(model.getTaraCount("player")).toBe(0);
      });
    });
  });
});
