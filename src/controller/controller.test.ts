/**
 * @jest-environment jsdom
 */
import { Controller } from "./controller";
import { IMenuView } from "../views/menu/IMenuView";
import { IModel } from "../model/IModel";
import { IView } from "../views/IView";
import { IMoveView } from "../views/move/IMoveView";
import { IOutcomeView } from "../views/outcome/IOutcomeView";
import { IScoreView } from "../views/score/IScoreView";
import { IStatsView } from "../views/stats/IStatsView";
import { MOVES, PARTICIPANTS, PLAYER_MOVES_DATA } from "../utils/dataUtils";

describe("Controller", () => {
  let mockModel: jest.Mocked<IModel>;
  let mockView: jest.Mocked<IView>;
  let mockMenuView: jest.Mocked<IMenuView>;
  let mockMoveView: jest.Mocked<IMoveView>;
  let mockOutcomeView: jest.Mocked<IOutcomeView>;
  let mockScoreView: jest.Mocked<IScoreView>;
  let mockStatsView: jest.Mocked<IStatsView>;
  let controller: Controller;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="choices"></div>
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

    mockView = {
      bindStartGame: jest.fn(),
      bindResetGame: jest.fn(),
      updateMessage: jest.fn(),
      toggleControls: jest.fn(),
      updateStartButton: jest.fn(),
      updateRound: jest.fn(),
      updateMatch: jest.fn(),
    } as any;

    mockMenuView = {} as any;

    mockMoveView = {
      render: jest.fn(),
      bindPlayerMove: jest.fn(),
      updateTaraButton: jest.fn(),
      toggleMoveButtons: jest.fn(),
    };

    mockOutcomeView = {
      render: jest.fn(),
      updateOutcome: jest.fn(),
      toggleOutcomeVisibility: jest.fn(),
      bindPlayAgain: jest.fn(),
    };

    mockScoreView = { updateScores: jest.fn() };

    mockStatsView = {
      toggleGameStatsVisibility: jest.fn(),
      updateHealth: jest.fn(),
      updateHealthBar: jest.fn(),
      updateMostCommonMoves: jest.fn(),
      updateTaraCounts: jest.fn(),
    };

    controller = new Controller(mockModel, {
      mainView: mockView,
      menuView: mockMenuView,
      moveView: mockMoveView,
      outcomeView: mockOutcomeView,
      scoreView: mockScoreView,
      statsView: mockStatsView,
    });
  });

  // ===== Initialization & Setup =====

  describe("initialize", () => {
    test("sets up all views and bindings with correct execution order", async () => {
      mockModel.taraIsEnabled.mockReturnValue(false);

      await controller.initialize();

      expect(mockMoveView.render).toHaveBeenCalledWith({
        moves: PLAYER_MOVES_DATA,
        taraIsEnabled: false,
      });
      expect(mockView.updateMessage).toHaveBeenCalledWith(
        "Rock, Paper, Scissors, Tara"
      );

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

      expect(mockScoreView.updateScores).toHaveBeenCalled();
      expect(mockStatsView.updateMostCommonMoves).toHaveBeenCalledWith(
        MOVES.ROCK,
        MOVES.PAPER
      );
    });
  });

  // ===== Game Flow Actions =====

  test("startGame prepares model and updates monolithic headers", () => {
    mockModel.getRoundNumber.mockReturnValue(1);
    mockModel.getMatchNumber.mockReturnValue(1);

    (controller as any).startGame();

    expect(mockModel.setDefaultMatchData).toHaveBeenCalled();
    expect(mockView.updateRound).toHaveBeenCalledWith(1);
    expect(mockView.updateMatch).toHaveBeenCalledWith(1);
    expect(mockView.toggleControls).toHaveBeenCalledWith(false);
    expect(mockStatsView.toggleGameStatsVisibility).toHaveBeenCalledWith(true);
  });

  // ===== Move Handling & Mapping =====

  describe("handlePlayerMove", () => {
    const moveTypes = [MOVES.ROCK, MOVES.PAPER, MOVES.SCISSORS, MOVES.TARA];

    test.each(moveTypes)(
      "registering %s calls model and chooses response",
      async (move) => {
        await controller.handlePlayerMove(move);
        expect(mockModel.registerPlayerMove).toHaveBeenCalledWith(move);
        expect(mockModel.chooseComputerMove).toHaveBeenCalled();
      }
    );

    test("resets moves BEFORE registering new player move", async () => {
      await controller.handlePlayerMove(MOVES.ROCK);
      const resetOrder = mockModel.resetMoves.mock.invocationCallOrder[0];
      const registerOrder =
        mockModel.registerPlayerMove.mock.invocationCallOrder[0];
      expect(resetOrder).toBeLessThan(registerOrder);
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

      expect(mockScoreView.updateScores).toHaveBeenCalled();
      expect(mockStatsView.updateTaraCounts).toHaveBeenCalled();
      expect(mockStatsView.updateMostCommonMoves).toHaveBeenCalled();
      expect(mockMoveView.updateTaraButton).toHaveBeenCalled();
    });
  });

  // ===== Navigation & Resets =====

  describe("handleNextRound", () => {
    test("syncs headers and hides outcome box for next round", () => {
      mockModel.getRoundNumber.mockReturnValue(2);
      (controller as any).handleNextRound();

      expect(mockView.updateRound).toHaveBeenCalledWith(2);
      expect(mockOutcomeView.toggleOutcomeVisibility).toHaveBeenCalledWith(
        false
      );
      expect(mockMoveView.toggleMoveButtons).toHaveBeenCalledWith(true);
    });
  });

  test("resetGameState resets model and refreshes all views", async () => {
    await controller.resetGameState();

    expect(mockModel.resetScores).toHaveBeenCalled();
    expect(mockModel.resetMatchData).toHaveBeenCalled();
    expect(mockScoreView.updateScores).toHaveBeenCalled();
    expect(mockStatsView.updateHealth).toHaveBeenCalled();
    expect(mockView.updateStartButton).toHaveBeenCalled();
  });
});
