import { Model } from "./model";
import { MOVES } from "../utils/dataUtils";

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

  test("resetMoves clears the player's move", () => {
    model.setPlayerMove("scissors");
    expect(model.getPlayerMove()).toBe("scissors");

    model.resetMoves();
    expect(model.getPlayerMove()).toBe(null);
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
});
