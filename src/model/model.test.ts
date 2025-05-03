import { Model } from "./model";
import { MOVES } from "../utils/dataUtils";

describe("Model", () => {
  let model: Model;

  beforeEach(() => {
    model = new Model();
    localStorage.clear();
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
    expect(model.getPlayerMove()).toBe("");
  });

  test("getPlayerMove returns empty string before a move is set", () => {
    expect(model.getPlayerMove()).toBe("");
  });

  test("setComputerMove and getComputerMove store and retrieve the move", () => {
    model.setComputerMove("scissors");
    expect(model.getComputerMove()).toBe("scissors");
  });

  test("chooseComputerMove picks a valid move from MOVES", () => {
    model.chooseComputerMove();
    const move = model.getComputerMove();
    expect(MOVES).toContain(move);
  });

  test("chooseComputerMove sets a non-empty move", () => {
    model.chooseComputerMove();
    const move = model.getComputerMove();
    expect(move).not.toBe("");
  });
});
