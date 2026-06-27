import { IModel } from "../model/IModel";
import { IArenaView } from "../views/arena/IArenaView";
import { IControlsView } from "../views/controls/IControlsView";
import { IGameView } from "../views/game/IGameView";
import { IMenuView } from "../views/menu/IMenuView";
import { IStatsView, StatsViewData } from "../views/stats/IStatsView";
import { IStatusView } from "../views/status/IStatusView";
import { Move, Participant } from "../utils/dataObjectUtils";
import {
  MOVE_DISPLAY_NAMES,
  PARTICIPANTS,
  PLAYER_MOVES_DATA,
} from "../utils/dataUtils";

export class Controller {
  private model: IModel;
  private arenaView: IArenaView;
  private controlsView: IControlsView;
  private gameView: IGameView;
  private menuView: IMenuView;
  private statsView: IStatsView;
  private statusView: IStatusView;

  constructor(
    model: IModel,
    views: {
      arenaView: IArenaView;
      controlsView: IControlsView;
      gameView: IGameView;
      menuView: IMenuView;
      statsView: IStatsView;
      statusView: IStatusView;
    },
  ) {
    this.model = model;
    this.arenaView = views.arenaView;
    this.controlsView = views.controlsView;
    this.gameView = views.gameView;
    this.menuView = views.menuView;
    this.statsView = views.statsView;
    this.statusView = views.statusView;
  }

  private updateControlsView(): void {
    this.controlsView.render({
      playerMove: this.model.getPlayerMove(),
      isMatchOver: this.model.isMatchOver(),
      taraIsEnabled: this.model.taraIsEnabled(),
      moves: PLAYER_MOVES_DATA,
    });
  }

  private updateStatsView(): void {
    const data: StatsViewData = {
      playerHealth: this.model.getHealth(PARTICIPANTS.PLAYER) ?? 100,
      computerHealth: this.model.getHealth(PARTICIPANTS.COMPUTER) ?? 100,
      playerScore: this.model.getPlayerScore() || 0,
      computerScore: this.model.getComputerScore() || 0,
      playerTara: this.model.getPlayerTaraCount() || 0,
      computerTara: this.model.getComputerTaraCount() || 0,
      playerMostCommonMove: this.model.getPlayerMostCommonMove(),
      computerMostCommonMove: this.model.getComputerMostCommonMove(),
      matchNumber: this.model.getMatchNumber(),
      roundNumber: this.model.getRoundNumber(),
    };

    this.statsView.update(data);
  }

  private async startGame(): Promise<void> {
    this.model.setDefaultMatchData();
    this.updateStatsView();

    this.resetArenaVisuals();
    this.statusView.handleEvent({ type: "READY" });

    this.menuView.toggleMenuVisibility(false);
    this.gameView.toggleVisibility(true);
    this.statsView.toggleGameStatsVisibility(true);
    this.controlsView.toggleVisibility(true);

    await this.handleNextRound();
  }

  private async endRound(): Promise<void> {
    const matchOver = this.model.isMatchOver();
    const isDoubleKO = this.model.isDoubleKO();

    // --- MATCH END ---
    if (matchOver) {
      const result = this.model.handleMatchWin();

      this.arenaView.playMatchResult(result as Participant, isDoubleKO);

      this.updateStatsView();
      this.updateControlsView();

      this.model.incrementMatchNumber();
      this.model.setMatch(null);
      return;
    }

    // --- ROUND CONTINUES ---
    this.model.increaseRoundNumber();

    // It's safe to update full stats here because we want the user to see the new round number
    this.updateStatsView();

    setTimeout(() => {
      this.handleNextRound();
    }, 250);
  }

  private async handleNextRound(): Promise<void> {
    this.statusView.handleEvent({ type: "PREPARE" });

    this.model.resetMoves();

    this.arenaView.clear();
    this.updateControlsView();
    this.updateStatsView();

    await this.controlsView.flipAll(true);
    this.statusView.handleEvent({ type: "CHOOSE" });
  }

  async resetGameState(): Promise<void> {
    this.model.resetGame();

    this.menuView.updateMenu({ isMatchActive: false });
    this.menuView.bindStartMatch(() => this.startGame());
    this.menuView.bindResetGame(() => this.resetGameState());

    this.resetArenaVisuals();
    this.controlsView.toggleVisibility(false);
  }

  private resetArenaVisuals(): void {
    this.arenaView.clear();
    this.updateStatsView();
  }

  async handlePlayerMove(move: Move): Promise<void> {
    this.statusView.handleEvent({ type: "LOCK_IN" });
    await this.controlsView.flipAll(false);

    const computerMove = this.model.getCalculatedComputerMove();
    this.model.registerPlayerMove(move);
    this.model.registerComputerMove(computerMove);

    const roundResult = this.model.evaluateRound();

    // 1. Status bar updates: "You played X. Computer played Y."
    this.statusView.announceRound(
      MOVE_DISPLAY_NAMES[move],
      MOVE_DISPLAY_NAMES[computerMove],
    );

    // 2. Play the visual sequence
    await this.arenaView.playRoundSequence(
      {
        phase: "waiting",
        playerMoveId: move,
        computerMoveId: computerMove,
        winner: roundResult.winner,
        isDoubleKO: roundResult.isDoubleKO,
      },
      () => {
        // 💥 IMPACT FRAME 💥

        // Smoothly drop health bars
        this.statsView.updateHealth(
          this.model.getHealth(PARTICIPANTS.PLAYER) ?? 100,
          this.model.getHealth(PARTICIPANTS.COMPUTER) ?? 100,
        );

        // Flash the round outcome text (e.g., "PLAYER LANDS A BLOW!")
        this.arenaView.playRoundResult(roundResult);
      },
    );

    // 3. Resolve the round once all drama and delays are finished
    await this.endRound();
  }

  async initialize(): Promise<void> {
    const isMatchActive = this.model.isMatchActive();
    this.menuView.render({ isMatchActive });

    this.arenaView.render({ phase: "waiting" });
    this.statusView.render({ message: "" });

    this.updateControlsView();
    this.updateStatsView();

    this.statsView.toggleGameStatsVisibility(false);
    this.controlsView.toggleVisibility(false);
    this.menuView.toggleMenuVisibility(true);

    this.menuView.bindStartMatch(() => this.startGame());
    this.menuView.bindResetGame(() => this.resetGameState());
    this.controlsView.bindPlayerMove((move) => this.handlePlayerMove(move));
    this.controlsView.bindStartNewMatch(() => this.startGame());
  }
}
