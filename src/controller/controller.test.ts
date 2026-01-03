/**
 * @jest-environment jsdom
 */
import { Controller } from "./controller";
import { IModel } from "../model/IModel";
import { IStatusView } from "../views/status/IStatusView";
import { IMenuView } from "../views/menu/IMenuView";
import { IMoveView } from "../views/move/IMoveView";
import { IMoveRevealView } from "../views/moveReveal/IMoveRevealView";
import { IOutcomeView } from "../views/outcome/IOutcomeView";
import { IProgressView } from "../views/progress/IProgressView";
import { IStatsView } from "../views/stats/IStatsView";
import { MOVES, PARTICIPANTS, PLAYER_MOVES_DATA } from "../utils/dataUtils";

describe("Controller", () => {
  let mockModel: jest.Mocked<IModel>;
  let mockStatusView: IStatusView;
  let mockMenuView: jest.Mocked<IMenuView>;
  let mockMoveView: jest.Mocked<IMoveView>;
  let mockMoveRevealView: jest.Mocked<IMoveRevealView>;
  let mockOutcomeView: jest.Mocked<IOutcomeView>;
  let mockProgressView: jest.Mocked<IProgressView>;
  let mockStatsView: jest.Mocked<IStatsView>;
  let controller: Controller;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="choices"></div>
      <section id="status-container"></section>
      <div id="result-display"></div>
    `;

    mockModel = {
      getPlayerScore: jest.fn().mockReturnValue(0),
      getComputerScore: jest.fn().mockReturnValue(0),
      getPlayerMove: jest.fn().mockReturnValue(MOVES.ROCK),
      getComputerMove: jest.fn().mockReturnValue(MOVES.SCISSORS),
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
    } as any;

    mockStatusView = {
      render: jest.fn(),
      setMessage: jest.fn(),
    };

    mockMenuView = {
      render: jest.fn(),
      updateMenu: jest.fn(),
      bindStartMatch: jest.fn(),
      bindResetGame: jest.fn(),
      toggleMenuVisibility: jest.fn(),
    };

    mockMoveView = {
      render: jest.fn(),
      bindPlayerMove: jest.fn(),
      updateTaraButton: jest.fn(),
      toggleMoveButtons: jest.fn(),
    };

    mockMoveRevealView = {
      render: jest.fn(),
      toggleVisibility: jest.fn(),
    };

    mockOutcomeView = {
      render: jest.fn(),
      updateOutcome: jest.fn(),
      toggleOutcomeVisibility: jest.fn(),
      bindPlayAgain: jest.fn(),
    };

    mockProgressView = {
      render: jest.fn(),
      update: jest.fn(),
    };

    mockStatsView = {
      toggleGameStatsVisibility: jest.fn(),
      updateHealthBar: jest.fn(),
      updateMostCommonMoves: jest.fn(),
      updateScores: jest.fn(),
      updateTaraCounts: jest.fn(),
    };

    controller = new Controller(mockModel, {
      statusView: mockStatusView,
      menuView: mockMenuView,
      moveView: mockMoveView,
      moveRevealView: mockMoveRevealView,
      outcomeView: mockOutcomeView,
      progressView: mockProgressView,
      statsView: mockStatsView,
    });
  });

  // ===== Initialization & Setup =====

  describe("initialize", () => {
    test("sets up all views and bindings with correct execution order", async () => {
      mockModel.taraIsEnabled.mockReturnValue(false);

      await controller.initialize();

      expect(mockStatusView.render).toHaveBeenCalledWith({ message: "" });

      expect(mockMoveView.render).toHaveBeenCalledWith({
        moves: PLAYER_MOVES_DATA,
        taraIsEnabled: false,
      });

      // Order Verification: Bind (Render) must happen BEFORE setting Tara state
      const bindOrder = mockMoveView.bindPlayerMove.mock.invocationCallOrder[0];
      const taraOrder =
        mockMoveView.updateTaraButton.mock.invocationCallOrder[0];
      expect(taraOrder).toBeGreaterThan(bindOrder);
    });

    test("syncs initial stats and common moves during init", async () => {
      mockModel.getPlayerMostCommonMove.mockReturnValue(MOVES.ROCK);
      mockModel.getComputerMostCommonMove.mockReturnValue(MOVES.PAPER);

      await controller.initialize();

      expect(mockStatsView.updateScores).toHaveBeenCalled();
      expect(mockStatsView.updateMostCommonMoves).toHaveBeenCalledWith(
        MOVES.ROCK,
        MOVES.PAPER
      );
    });
  });

  // ===== Game Flow Actions =====

  test("startGame prepares model and updates progress", () => {
    mockModel.getRoundNumber.mockReturnValue(1);
    mockModel.getMatchNumber.mockReturnValue(1);

    (controller as any).startGame();

    expect(mockModel.setDefaultMatchData).toHaveBeenCalled();
    expect(mockProgressView.update).toHaveBeenCalledWith({
      matchNumber: 1,
      roundNumber: 1,
      isVisible: true,
    });
    expect(mockMenuView.toggleMenuVisibility).toHaveBeenCalledWith(false);
    expect(mockStatsView.toggleGameStatsVisibility).toHaveBeenCalledWith(true);
  });

  // ===== Move Handling & Mapping =====

  describe("handlePlayerMove", () => {
    const moveTypes = [MOVES.ROCK, MOVES.PAPER, MOVES.SCISSORS, MOVES.TARA];

    test.each(moveTypes)(
      "registering %s renders and shows the move reveal",
      async (move) => {
        // Setup mock returns for the moves
        mockModel.getPlayerMove.mockReturnValue(move);
        mockModel.getComputerMove.mockReturnValue(MOVES.ROCK);

        await controller.handlePlayerMove(move);

        // Verify reveal view interactions
        expect(mockMoveRevealView.render).toHaveBeenCalledWith({
          playerMoveId: move,
          computerMoveId: MOVES.ROCK,
        });
        expect(mockMoveRevealView.toggleVisibility).toHaveBeenCalledWith(true);
      }
    );

    test("hides move buttons BEFORE showing the reveal", async () => {
      await controller.handlePlayerMove(MOVES.ROCK);

      const hideButtonsOrder =
        mockMoveView.toggleMoveButtons.mock.invocationCallOrder[0];
      const showRevealOrder =
        mockMoveRevealView.toggleVisibility.mock.invocationCallOrder[0];

      expect(hideButtonsOrder).toBeLessThan(showRevealOrder);
    });
  });

  // ===== Round & Match Outcomes =====

  describe("endRound", () => {
    beforeEach(() => {
      mockModel.getPlayerMove.mockReturnValue(MOVES.ROCK);
      mockModel.getComputerMove.mockReturnValue(MOVES.SCISSORS);
      mockModel.evaluateRound.mockReturnValue("You win!");
    });

    test("transforms results to uppercase and updates OutcomeView", () => {
      mockModel.isMatchOver.mockReturnValue(false);

      (controller as any).endRound();

      expect(mockOutcomeView.updateOutcome).toHaveBeenCalledWith(
        expect.objectContaining({
          resultMessage: "YOU WIN!",
          isMatchOver: false,
        })
      );
      expect(mockOutcomeView.toggleOutcomeVisibility).toHaveBeenCalledWith(
        true
      );
      expect(mockModel.increaseRoundNumber).toHaveBeenCalled();
    });

    test("handles match win state correctly", () => {
      mockModel.isMatchOver.mockReturnValue(true);
      mockModel.handleMatchWin.mockReturnValue(PARTICIPANTS.PLAYER);

      (controller as any).endRound();

      expect(mockOutcomeView.updateOutcome).toHaveBeenCalledWith(
        expect.objectContaining({
          resultMessage: "PLAYER WON THE MATCH!",
          isMatchOver: true,
        })
      );
      expect(mockModel.incrementMatchNumber).toHaveBeenCalled();
    });

    test("synchronizes all stats, scores, and buttons as side-effects", () => {
      (controller as any).endRound();

      expect(mockStatsView.updateScores).toHaveBeenCalled();
      expect(mockStatsView.updateTaraCounts).toHaveBeenCalled();
      expect(mockStatsView.updateMostCommonMoves).toHaveBeenCalled();
      expect(mockMoveView.updateTaraButton).toHaveBeenCalled();
    });

    test("announces the final moves of the round", () => {
      mockModel.getPlayerMove.mockReturnValue(MOVES.ROCK);
      mockModel.getComputerMove.mockReturnValue(MOVES.SCISSORS);

      (controller as any).endRound();

      expect(mockStatusView.setMessage).toHaveBeenCalledWith(
        "You played rock. Computer played scissors."
      );
    });
  });

  // ===== Navigation & Resets =====

  describe("handleNextRound", () => {
    test("syncs progress and hides outcome box for next round", () => {
      mockModel.getRoundNumber.mockReturnValue(2);
      (controller as any).handleNextRound();

      expect(mockProgressView.update).toHaveBeenCalledWith({
        matchNumber: 1, // Assuming match is still 1
        roundNumber: 2,
        isVisible: true,
      });
      expect(mockOutcomeView.toggleOutcomeVisibility).toHaveBeenCalledWith(
        false
      );
      expect(mockMoveView.toggleMoveButtons).toHaveBeenCalledWith(true);
    });

    test("hides the move reveal and outcome box for next round", () => {
      (controller as any).handleNextRound();

      expect(mockStatusView.setMessage).toHaveBeenCalledWith(
        "Choose your attack!"
      );

      expect(mockMoveRevealView.toggleVisibility).toHaveBeenCalledWith(false);
      expect(mockOutcomeView.toggleOutcomeVisibility).toHaveBeenCalledWith(
        false
      );
      expect(mockMoveView.toggleMoveButtons).toHaveBeenCalledWith(true);
    });
  });

  test("resetGameState resets model and refreshes all views", async () => {
    await controller.resetGameState();

    expect(mockMoveRevealView.toggleVisibility).toHaveBeenCalledWith(false);
    expect(mockModel.resetScores).toHaveBeenCalled();
    expect(mockModel.resetMatchData).toHaveBeenCalled();
    expect(mockStatsView.updateScores).toHaveBeenCalled();
    expect(mockMenuView.updateMenu).toHaveBeenCalled();
  });
});
