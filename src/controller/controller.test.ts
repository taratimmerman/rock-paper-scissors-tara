/**
 * @jest-environment jsdom
 */
import { Controller } from "./controller";
import { MOVES, PARTICIPANTS } from "../utils/dataUtils";

describe("Controller", () => {
  let mockModel: any;
  let mockAnnouncementView: any;
  let mockControlsView: any;
  let mockGameView: any;
  let mockStatusView: any;
  let mockMenuView: any;
  let mockMoveRevealView: any;
  let mockProgressView: any;
  let mockStatsView: any;
  let controller: Controller;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="game-container">
        <section id="game-controls"></section>
      </div>
    `;

    // Mock requestAnimationFrame for the handlePlayerMove delay
    (window as any).requestAnimationFrame = (cb: any) => setTimeout(cb, 0);

    mockModel = {
      doesMoveBeat: jest.fn().mockImplementation((a: string, b: string) => {
        if (a === MOVES.ROCK && b === MOVES.SCISSORS) return true;
        if (a === MOVES.SCISSORS && b === MOVES.PAPER) return true;
        if (a === MOVES.PAPER && b === MOVES.ROCK) return true;
        return false;
      }),
      getPlayerScore: jest.fn().mockReturnValue(0),
      getComputerScore: jest.fn().mockReturnValue(0),
      getPlayerMove: jest.fn().mockReturnValue(null),
      getComputerMove: jest.fn().mockReturnValue(null),
      registerPlayerMove: jest.fn(),
      chooseComputerMove: jest.fn(),
      evaluateRound: jest.fn().mockReturnValue("You win!"),
      resetMoves: jest.fn(),
      getPlayerTaraCount: jest.fn().mockReturnValue(0),
      getComputerTaraCount: jest.fn().mockReturnValue(0),
      taraIsEnabled: jest.fn().mockReturnValue(true),
      resetTaras: jest.fn(),
      getPlayerMostCommonMove: jest.fn().mockReturnValue(null),
      getComputerMostCommonMove: jest.fn().mockReturnValue(null),
      resetBothMoveCounts: jest.fn(),
      resetMostCommonMoves: jest.fn(),
      isMatchActive: jest.fn().mockReturnValue(false),
      isMatchOver: jest.fn().mockReturnValue(false),
      handleMatchWin: jest.fn(),
      incrementMatchNumber: jest.fn(),
      increaseRoundNumber: jest.fn(),
      getRoundNumber: jest.fn().mockReturnValue(1),
      getMatchNumber: jest.fn().mockReturnValue(1),
      setMatch: jest.fn(),
      setDefaultMatchData: jest.fn(),
      resetHistories: jest.fn(),
      resetMatchData: jest.fn(),
      getHealth: jest.fn().mockReturnValue(100),
      resetScores: jest.fn(),
    };

    mockAnnouncementView = { render: jest.fn(), setMessage: jest.fn() };

    // NOTE: mockResolvedValue(undefined) simulates the "intelligent" wait resolving instantly
    mockControlsView = {
      render: jest.fn(),
      bindPlayerMove: jest.fn(),
      bindNextRound: jest.fn(),
      flipAll: jest.fn().mockResolvedValue(undefined),
      toggleVisibility: jest.fn(),
    };

    mockGameView = { toggleVisibility: jest.fn() };

    mockStatusView = { render: jest.fn(), setMessage: jest.fn() };

    mockMenuView = {
      render: jest.fn(),
      bindStartMatch: jest.fn(),
      bindResetGame: jest.fn(),
      toggleMenuVisibility: jest.fn(),
      updateMenu: jest.fn(),
    };
    mockMoveRevealView = {
      flipCards: jest.fn().mockResolvedValue(undefined),
      highlightWinner: jest.fn().mockResolvedValue(undefined),
      render: jest.fn(),
      toggleVisibility: jest.fn(),
    };

    mockProgressView = { render: jest.fn(), update: jest.fn() };

    mockStatsView = {
      toggleGameStatsVisibility: jest.fn(),
      updateHealthBar: jest.fn(),
      updateMostCommonMoves: jest.fn(),
      updateScores: jest.fn(),
      updateTaraCounts: jest.fn(),
    };

    controller = new Controller(mockModel, {
      announcementView: mockAnnouncementView,
      controlsView: mockControlsView,
      gameView: mockGameView,
      statusView: mockStatusView,
      menuView: mockMenuView,
      moveRevealView: mockMoveRevealView,
      progressView: mockProgressView,
      statsView: mockStatsView,
    });
  });

  // ===== INITIALIZATION =====
  describe("initialize", () => {
    test("renders all views and hides gameplay elements", async () => {
      await controller.initialize();

      expect(mockMenuView.render).toHaveBeenCalled();
      expect(mockControlsView.render).toHaveBeenCalled();
      expect(mockControlsView.toggleVisibility).toHaveBeenCalledWith(false);
      expect(mockMenuView.toggleMenuVisibility).toHaveBeenCalledWith(true);
      expect(mockControlsView.bindPlayerMove).toHaveBeenCalled();
      expect(mockControlsView.bindNextRound).toHaveBeenCalled();
    });
  });

  // ===== GAME ACTIONS =====
  describe("startGame", () => {
    test("prepares match data and shows controls", async () => {
      await (controller as any).startGame();

      expect(mockModel.setDefaultMatchData).toHaveBeenCalled();
      expect(mockMenuView.toggleMenuVisibility).toHaveBeenCalledWith(false);
      expect(mockControlsView.toggleVisibility).toHaveBeenCalledWith(true);
      expect(mockControlsView.render).toHaveBeenCalled();

      // This will now pass because we waited for the flipAll to resolve
      expect(mockStatusView.setMessage).toHaveBeenCalledWith(
        "Choose your attack!"
      );
    });

    test("strictly follows the narrative timing (Ready -> Flip -> Choose)", async () => {
      // 1. Setup a manual resolver for flipAll so we can control when the animation 'finishes'
      let resolveFlip: (value: void | PromiseLike<void>) => void;
      const flipPromise = new Promise<void>((resolve) => {
        resolveFlip = resolve;
      });
      mockControlsView.flipAll.mockReturnValue(flipPromise);

      // 2. Start the game (don't await yet, or the test will hang)
      const gamePromise = (controller as any).startGame();

      // 3. Verify 'Phase 1' state (Before flip completes)
      expect(mockStatusView.setMessage).toHaveBeenCalledWith("Get ready...");
      expect(mockStatusView.setMessage).not.toHaveBeenCalledWith(
        "Choose your attack!"
      );

      // 4. Resolve the flip
      resolveFlip!();
      await gamePromise;

      // 5. Verify 'Phase 2' state (After flip completes)
      expect(mockStatusView.setMessage).toHaveBeenCalledWith(
        "Choose your attack!"
      );
    });
  });

  describe("handlePlayerMove", () => {
    test("registers move, locks UI via render, and shows reveal", async () => {
      mockModel.getPlayerMove.mockReturnValue(MOVES.ROCK);

      await controller.handlePlayerMove(MOVES.ROCK);

      expect(mockModel.registerPlayerMove).toHaveBeenCalledWith(MOVES.ROCK);
      // Verify the lock-in flip happened
      expect(mockControlsView.flipAll).toHaveBeenCalledWith(false);
      expect(mockControlsView.render).toHaveBeenCalled();
      expect(mockMoveRevealView.toggleVisibility).toHaveBeenCalledWith(true);
    });

    test("registers move and waits for the card flip before ending round", async () => {
      mockModel.getPlayerMove.mockReturnValue(MOVES.ROCK);
      mockModel.getComputerMove.mockReturnValue(MOVES.PAPER);

      await controller.handlePlayerMove(MOVES.ROCK);

      expect(mockModel.registerPlayerMove).toHaveBeenCalledWith(MOVES.ROCK);
      expect(mockMoveRevealView.toggleVisibility).toHaveBeenCalledWith(true);
      expect(mockMoveRevealView.flipCards).toHaveBeenCalled();
      expect(mockStatusView.setMessage).toHaveBeenCalledWith(
        expect.stringContaining("rock")
      );
    });
  });

  // ===== ROUND OUTCOMES =====
  describe("endRound", () => {
    test("renders 'Next Round' button when match continues", () => {
      mockModel.isMatchOver.mockReturnValue(false);
      mockModel.getPlayerMove.mockReturnValue(MOVES.ROCK);
      mockModel.getComputerMove.mockReturnValue(MOVES.SCISSORS);

      (controller as any).endRound();

      expect(mockAnnouncementView.setMessage).toHaveBeenCalledWith("YOU WIN!");
      expect(mockControlsView.render).toHaveBeenCalledWith(
        expect.objectContaining({ isMatchOver: false })
      );
    });

    test("renders 'Start New Match' when match is over", () => {
      mockModel.isMatchOver.mockReturnValue(true);
      mockModel.handleMatchWin.mockReturnValue(PARTICIPANTS.PLAYER);

      (controller as any).endRound();

      expect(mockAnnouncementView.setMessage).toHaveBeenCalledWith(
        "PLAYER WON THE MATCH!"
      );
      // CRITICAL EDGE CASE: Verify the View receives isMatchOver: true
      expect(mockControlsView.render).toHaveBeenCalledWith(
        expect.objectContaining({ isMatchOver: true })
      );
    });
  });

  describe("handleNextRound", () => {
    test("resets moves in model to bring back choice cards", async () => {
      mockModel.getPlayerMove.mockReturnValue(null);

      await (controller as any).handleNextRound();

      // CRITICAL EDGE CASE: Must call resetMoves for the cards to reappear
      expect(mockModel.resetMoves).toHaveBeenCalled();
      expect(mockMoveRevealView.toggleVisibility).toHaveBeenCalledWith(false);
      expect(mockControlsView.render).toHaveBeenCalled();
      expect(mockControlsView.flipAll).toHaveBeenCalledWith(true);
    });
  });

  // ===== GLOBAL RESET =====
  describe("resetGameState", () => {
    test("cleans all model data and hides gameplay UI", async () => {
      await controller.resetGameState();

      expect(mockModel.resetScores).toHaveBeenCalled();
      expect(mockModel.resetMatchData).toHaveBeenCalled();
      expect(mockControlsView.toggleVisibility).toHaveBeenCalledWith(false);
      expect(mockMoveRevealView.toggleVisibility).toHaveBeenCalledWith(false);
      expect(mockAnnouncementView.setMessage).toHaveBeenCalledWith("");
    });
  });

  // ===== WINNING CARD =====
  describe("handlePlayerMove - Winner Polish", () => {
    test("calls highlightWinner with 'player' when player wins the round", async () => {
      // Setup: Rock beats Scissors
      mockModel.getPlayerMove.mockReturnValue(MOVES.ROCK);
      mockModel.getComputerMove.mockReturnValue(MOVES.SCISSORS);
      mockModel.doesMoveBeat.mockReturnValue(true);

      await controller.handlePlayerMove(MOVES.ROCK);

      // Assert: The controller told the view to highlight the player
      expect(mockMoveRevealView.highlightWinner).toHaveBeenCalledWith("player");
      expect(mockMoveRevealView.highlightWinner).not.toHaveBeenCalledWith(
        "computer"
      );
    });

    test("calls highlightWinner with 'computer' when computer wins the round", async () => {
      // Setup: Rock loses to Paper
      mockModel.getPlayerMove.mockReturnValue(MOVES.ROCK);
      mockModel.getComputerMove.mockReturnValue(MOVES.PAPER);
      mockModel.doesMoveBeat.mockReturnValue(false);

      await controller.handlePlayerMove(MOVES.ROCK);

      // Assert: The controller told the view to highlight the computer
      expect(mockMoveRevealView.highlightWinner).toHaveBeenCalledWith(
        "computer"
      );
    });

    test("does not call highlightWinner and proceeds on a draw", async () => {
      // Setup: Mirror match (Rock vs Rock)
      mockModel.getPlayerMove.mockReturnValue(MOVES.ROCK);
      mockModel.getComputerMove.mockReturnValue(MOVES.ROCK);

      await controller.handlePlayerMove(MOVES.ROCK);

      // Assert: No winner highlight should occur on a draw
      expect(mockMoveRevealView.highlightWinner).not.toHaveBeenCalled();
      // Ensure the round still ends properly
      expect(mockModel.evaluateRound).toHaveBeenCalled();
    });

    test("strictly follows reveal sequence: Flip -> Highlight -> End Round", async () => {
      const executionOrder: string[] = [];

      // Track the order of calls
      mockMoveRevealView.flipCards.mockImplementation(() => {
        executionOrder.push("flip");
        return Promise.resolve();
      });
      mockMoveRevealView.highlightWinner.mockImplementation(() => {
        executionOrder.push("highlight");
        return Promise.resolve();
      });
      mockModel.evaluateRound.mockImplementation(() => {
        executionOrder.push("evaluate");
        return "win";
      });

      mockModel.getPlayerMove.mockReturnValue(MOVES.ROCK);
      mockModel.getComputerMove.mockReturnValue(MOVES.SCISSORS);

      await controller.handlePlayerMove(MOVES.ROCK);

      expect(executionOrder).toEqual(["flip", "highlight", "evaluate"]);
    });
  });
});
