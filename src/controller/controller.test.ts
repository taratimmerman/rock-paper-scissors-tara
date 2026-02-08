/**
 * @jest-environment jsdom
 */
import { Controller } from "./controller";
import { IModel } from "../model/IModel";
import { IAnnouncementView } from "../views/announcement/IAnnouncementView";
import { IControlsView } from "../views/controls/IControlsView";
import { IGameView } from "../views/game/IGameView";
import { IMenuView } from "../views/menu/IMenuView";
import { IMoveRevealView } from "../views/moveReveal/IMoveRevealView";
import { IProgressView } from "../views/progress/IProgressView";
import { IStatsView } from "../views/stats/IStatsView";
import { IStatusView } from "../views/status/IStatusView";
import { MOVES } from "../utils/dataUtils";

describe("Controller", () => {
  let controller: Controller;
  let mockModel: jest.Mocked<IModel>;
  let mockViews: {
    announcementView: jest.Mocked<IAnnouncementView>;
    controlsView: jest.Mocked<IControlsView>;
    gameView: jest.Mocked<IGameView>;
    menuView: jest.Mocked<IMenuView>;
    moveRevealView: jest.Mocked<IMoveRevealView>;
    progressView: jest.Mocked<IProgressView>;
    statsView: jest.Mocked<IStatsView>;
    statusView: jest.Mocked<IStatusView>;
  };

  beforeEach(() => {
    // 1. Setup Mock Model
    mockModel = {
      setDefaultMatchData: jest.fn(),
      getPlayerMove: jest.fn().mockReturnValue(MOVES.ROCK),
      getComputerMove: jest.fn().mockReturnValue(MOVES.PAPER),
      isMatchOver: jest.fn().mockReturnValue(false),
      taraIsEnabled: jest.fn().mockReturnValue(true),
      getMatchNumber: jest.fn().mockReturnValue(1),
      getRoundNumber: jest.fn().mockReturnValue(1),
      getPlayerScore: jest.fn().mockReturnValue(0),
      getComputerScore: jest.fn().mockReturnValue(0),
      getPlayerTaraCount: jest.fn().mockReturnValue(0),
      getComputerTaraCount: jest.fn().mockReturnValue(0),
      getPlayerMostCommonMove: jest.fn().mockReturnValue(MOVES.ROCK),
      getComputerMostCommonMove: jest.fn().mockReturnValue(MOVES.PAPER),
      getHealth: jest.fn().mockReturnValue(100),
      isDoubleKO: jest.fn().mockReturnValue(false),
      handleMatchWin: jest.fn().mockReturnValue("player"),
      incrementMatchNumber: jest.fn(),
      increaseRoundNumber: jest.fn(),
      resetMoves: jest.fn(),
      registerPlayerMove: jest.fn(),
      chooseComputerMove: jest.fn(),
      evaluateRound: jest.fn().mockReturnValue("Player Wins!"),
      doesMoveBeat: jest.fn().mockReturnValue(true),
      setMatch: jest.fn(),
      isMatchActive: jest.fn().mockReturnValue(false),
      resetScores: jest.fn(),
      resetTaras: jest.fn(),
      resetHistories: jest.fn(),
      resetBothMoveCounts: jest.fn(),
      resetMostCommonMoves: jest.fn(),
      resetMatchData: jest.fn(),
    } as any;

    // 2. Setup Mock Views
    mockViews = {
      announcementView: { render: jest.fn(), setMessage: jest.fn() } as any,
      controlsView: {
        render: jest.fn(),
        toggleVisibility: jest.fn(),
        flipAll: jest.fn().mockResolvedValue(undefined),
        bindPlayerMove: jest.fn(),
        bindStartNewMatch: jest.fn(),
      } as any,
      gameView: { toggleVisibility: jest.fn() } as any,
      menuView: {
        render: jest.fn(),
        toggleMenuVisibility: jest.fn(),
        updateMenu: jest.fn(),
        bindStartMatch: jest.fn(),
        bindResetGame: jest.fn(),
      } as any,
      moveRevealView: {
        render: jest.fn(),
        toggleVisibility: jest.fn(),
        clear: jest.fn(),
        animateEntrance: jest.fn().mockResolvedValue(undefined),
        flipCards: jest.fn().mockResolvedValue(undefined),
        playFightAnimations: jest.fn().mockResolvedValue(undefined),
        triggerImpact: jest.fn().mockResolvedValue(undefined),
        triggerDefeat: jest.fn().mockResolvedValue(undefined),
        highlightWinner: jest.fn().mockResolvedValue(undefined),
      } as any,
      progressView: { render: jest.fn(), update: jest.fn() } as any,
      statsView: {
        updateScores: jest.fn(),
        updateTaraCounts: jest.fn(),
        updateMostCommonMoves: jest.fn(),
        updateHealthBar: jest.fn(),
        toggleGameStatsVisibility: jest.fn(),
      } as any,
      statusView: { render: jest.fn(), setMessage: jest.fn() } as any,
    };

    controller = new Controller(mockModel, mockViews);
  });

  describe("startGame", () => {
    test("Initializes model and resets arena visuals", async () => {
      // @ts-ignore - accessing private for testing
      await controller.startGame();

      expect(mockModel.setDefaultMatchData).toHaveBeenCalled();
      expect(mockViews.moveRevealView.clear).toHaveBeenCalled();
      expect(mockViews.announcementView.setMessage).toHaveBeenCalledWith("");
      expect(mockViews.gameView.toggleVisibility).toHaveBeenCalledWith(true);
    });
  });

  describe("endRound", () => {
    test("updates scores and sets 'Start New Match' button when match is over", () => {
      mockModel.isMatchOver.mockReturnValue(true);
      mockModel.handleMatchWin.mockReturnValue("player");

      // @ts-ignore
      controller.endRound("player wins round");

      expect(mockModel.handleMatchWin).toHaveBeenCalled();
      expect(mockViews.statsView.updateScores).toHaveBeenCalled();
      expect(mockViews.controlsView.render).toHaveBeenCalledWith(
        expect.objectContaining({
          isMatchOver: true,
        }),
      );
      expect(mockModel.setMatch).toHaveBeenCalledWith(null);
    });

    test("increments round and handles next round if match continues", () => {
      jest.useFakeTimers();
      mockModel.isMatchOver.mockReturnValue(false);

      // @ts-ignore
      controller.endRound("draw");

      expect(mockModel.increaseRoundNumber).toHaveBeenCalled();

      jest.advanceTimersByTime(2000);
      expect(mockModel.resetMoves).toHaveBeenCalled();
      jest.useRealTimers();
    });
  });

  describe("handlePlayerMove", () => {
    test("executes the full combat sequence", async () => {
      await controller.handlePlayerMove(MOVES.ROCK);

      expect(mockModel.registerPlayerMove).toHaveBeenCalledWith(MOVES.ROCK);
      expect(mockViews.controlsView.flipAll).toHaveBeenCalledWith(false);
      expect(mockViews.moveRevealView.render).toHaveBeenCalled();
      expect(mockViews.moveRevealView.playFightAnimations).toHaveBeenCalled();
    });
  });

  describe("resetGameState", () => {
    test("completely wipes model data and refreshes all views", async () => {
      await controller.resetGameState();

      expect(mockModel.resetScores).toHaveBeenCalled();
      expect(mockModel.resetMatchData).toHaveBeenCalled();
      expect(mockViews.statsView.updateScores).toHaveBeenCalled();
      expect(mockViews.moveRevealView.toggleVisibility).toHaveBeenCalledWith(
        false,
      );
      expect(mockViews.controlsView.toggleVisibility).toHaveBeenCalledWith(
        false,
      );
    });
  });

  describe("initialize", () => {
    test("sets up all initial view states and binds event listeners", async () => {
      await controller.initialize();

      expect(mockViews.menuView.render).toHaveBeenCalled();
      expect(mockViews.menuView.bindStartMatch).toHaveBeenCalled();
      expect(mockViews.controlsView.bindStartNewMatch).toHaveBeenCalled();
      expect(
        mockViews.statsView.toggleGameStatsVisibility,
      ).toHaveBeenCalledWith(false);
    });
  });
});
