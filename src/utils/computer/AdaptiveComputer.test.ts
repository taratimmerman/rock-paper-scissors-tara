import { AdaptiveComputer } from "./AdaptiveComputer";
import { MOVES } from "../dataUtils";
import { GameState } from "../dataObjectUtils";

describe("AdaptiveComputer", () => {
  let computer: AdaptiveComputer;
  let mockState: GameState;

  beforeEach(() => {
    computer = new AdaptiveComputer();

    // Initialize a fresh state for every test
    mockState = {
      scores: { player: 0, computer: 0 },
      moves: { player: null, computer: null },
      taras: { player: 0, computer: 0 },
      mostCommonMove: { player: null, computer: null },
      moveCounts: {
        player: { rock: 0, paper: 0, scissors: 0 },
        computer: { rock: 0, paper: 0, scissors: 0 },
      },
      globalMatchNumber: 1,
      currentMatch: null,
    };
  });

  describe("Standard Moves (Scenario A: Countering Player)", () => {
    test("should favor Paper if player most common move is Rock", () => {
      mockState.mostCommonMove.player = MOVES.ROCK;

      // Weights will be Rock: 2, Paper: 5, Scissors: 2 (Total: 9)
      // We mock random to pick the "middle" range where Paper lives
      jest.spyOn(Math, "random").mockReturnValue(0.5);

      const move = computer.calculateNextMove(mockState);
      expect(move).toBe(MOVES.PAPER);
      jest.restoreAllMocks();
    });

    test("should favor Scissors if player most common move is Paper", () => {
      mockState.mostCommonMove.player = MOVES.PAPER;
      jest.spyOn(Math, "random").mockReturnValue(0.9); // High end of pool

      const move = computer.calculateNextMove(mockState);
      expect(move).toBe(MOVES.SCISSORS);
      jest.restoreAllMocks();
    });
  });

  describe("Standard Moves (Scenario B: Computer Habits)", () => {
    test("should favor its own favorite move if player has no pattern", () => {
      mockState.mostCommonMove.player = null;
      mockState.mostCommonMove.computer = MOVES.SCISSORS;

      // Weights: Rock: 1, Paper: 1, Scissors: 3 (Total: 5)
      // 0.8 * 5 = index 4, which is the last Scissors
      jest.spyOn(Math, "random").mockReturnValue(0.8);

      const move = computer.calculateNextMove(mockState);
      expect(move).toBe(MOVES.SCISSORS);
      jest.restoreAllMocks();
    });
  });

  describe("Tara Logic", () => {
    test("should never play Tara if tara count is 0", () => {
      mockState.taras.computer = 0;
      // Force random to try and pick the "last" index
      jest.spyOn(Math, "random").mockReturnValue(0.99);

      const move = computer.calculateNextMove(mockState);
      expect(move).not.toBe(MOVES.TARA);
      jest.restoreAllMocks();
    });

    test("should play Tara if tara count > 0 and random hits the weight", () => {
      mockState.taras.computer = 1;
      mockState.scores.player = 5; // Large score diff increases Tara weight
      mockState.scores.computer = 0;

      // With score diff 5, Tara weight is 8. Standard weights total ~9.
      // Total pool ~17. We force random to hit the Tara section.
      jest.spyOn(Math, "random").mockReturnValue(0.99);

      const move = computer.calculateNextMove(mockState);
      expect(move).toBe(MOVES.TARA);
      jest.restoreAllMocks();
    });
  });

  describe("Pure Random Fallback", () => {
    test("should provide equal weights when no patterns exist", () => {
      mockState.mostCommonMove.player = null;
      mockState.mostCommonMove.computer = null;

      const moves: string[] = [];
      // Run it 100 times to ensure no crashes and basic variety
      for (let i = 0; i < 100; i++) {
        moves.push(computer.calculateNextMove(mockState));
      }

      expect(moves).toContain(MOVES.ROCK);
      expect(moves).toContain(MOVES.PAPER);
      expect(moves).toContain(MOVES.SCISSORS);
    });
  });
});
