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
    this.statusView.setMessage("Get ready...");

    this.menuView.toggleMenuVisibility(false);
    this.gameView.toggleVisibility(true);
    this.statsView.toggleGameStatsVisibility(true);
    this.controlsView.toggleVisibility(true);

    await this.handleNextRound();
  }

  private endRound(): void {
    const matchActuallyEnded = this.model.isMatchOver();
    const isDoubleKO = this.model.isDoubleKO();

    this.updateStatsView();

    // --- MATCH END ---
    if (matchActuallyEnded) {
      const result = this.model.handleMatchWin();

      const resultMessage = isDoubleKO
        ? "DOUBLE KO! NOBODY WINS!"
        : `${result.toUpperCase()} WON THE MATCH!`;

      // Update the arena view to show the final match message, keeping cards visible
      this.arenaView.update({
        phase: "result",
        playerMoveId: this.model.getPlayerMove(),
        computerMoveId: this.model.getComputerMove(),
        announcementMessage: resultMessage,
        winner: result as Participant,
      });

      this.updateStatsView();
      this.updateControlsView();

      this.model.incrementMatchNumber();
      this.model.setMatch(null);
      return;
    }

    // --- ROUND CONTINUES ---
    this.updateStatsView();
    this.model.increaseRoundNumber();

    setTimeout(() => {
      this.handleNextRound();
    }, 2000);
  }

  private async handleNextRound(): Promise<void> {
    this.statusView.setMessage("Prepare your next move...");

    this.model.resetMoves();

    this.arenaView.clear();
    this.updateControlsView();
    this.updateStatsView();

    await this.controlsView.flipAll(true);
    this.statusView.setMessage("Choose your attack!");
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
    this.statusView.setMessage("Locking in move...");
    await this.controlsView.flipAll(false);

    // 1. Get the computer's move purely based on historical state
    const computerMove = this.model.getCalculatedComputerMove();

    // 2. Explicitly commit both moves to state (this triggers the metric counters)
    this.model.registerPlayerMove(move);
    this.model.registerComputerMove(computerMove);

    // 3. Evaluate the rules deterministically
    const roundResult = this.model.evaluateRound();

    // 4. Update UI using the plain variables we have right here
    this.statusView.setMessage(
      `You played ${MOVE_DISPLAY_NAMES[move]}. Computer played ${MOVE_DISPLAY_NAMES[computerMove]}.`,
    );

    await this.arenaView.playRoundSequence({
      phase: "waiting",
      playerMoveId: move,
      computerMoveId: computerMove,
      winner: roundResult.winner,
      isDoubleKO: roundResult.isDoubleKO,
      announcementMessage: roundResult.isDoubleKO
        ? "MUTUAL DESTRUCTION!"
        : roundResult.winner !== "tie"
          ? `${roundResult.winner.toUpperCase()} LANDS A BLOW!`
          : "IT'S A TIE!",
    });

    this.updateStatsView();
    this.endRound();
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
