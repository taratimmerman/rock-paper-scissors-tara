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

    if (!this.statsView.hasData) {
      this.statsView.render(data);
    } else {
      this.statsView.update(data);
    }
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
    this.model.resetMoves();

    this.arenaView.clear();

    this.updateControlsView();
    this.updateStatsView();

    this.statusView.setMessage("Prepare your next move...");

    await this.controlsView.flipAll(true);
    this.statusView.setMessage("Choose your attack!");
  }

  async resetGameState(): Promise<void> {
    this.model.resetScores();
    this.model.resetTaras();
    this.model.resetHistories();
    this.model.resetBothMoveCounts();
    this.model.resetMostCommonMoves();
    this.model.resetMatchData();

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
    // Let the computer choose based on PREVIOUS round data, before we record the player's current move
    this.model.chooseComputerMove();

    // Record the player's move for THIS round's calculations
    this.model.registerPlayerMove(move);

    // 1. Preparation
    this.statusView.setMessage("Locking in move...");
    await this.controlsView.flipAll(false);

    // 2. Fetch data from the Model for the upcoming round
    const pMove = this.model.getPlayerMove();
    const cMove = this.model.getComputerMove();
    const isDoubleKO = this.model.isDoubleKO();
    const roundResult = this.model.evaluateRound();

    this.statusView.setMessage(
      `You played ${MOVE_DISPLAY_NAMES[pMove]}. Computer played ${MOVE_DISPLAY_NAMES[cMove]}.`,
    );

    // 3. Play out the entire visual sequence via the View
    await this.arenaView.playRoundSequence({
      phase: "waiting", // Starting state, the View will progress this
      playerMoveId: pMove,
      computerMoveId: cMove,
      winner: roundResult.winner,
      isDoubleKO: isDoubleKO,
      announcementMessage: isDoubleKO
        ? "MUTUAL DESTRUCTION!"
        : roundResult.winner !== "tie"
          ? `${roundResult.winner.toUpperCase()} LANDS A BLOW!`
          : "IT'S A TIE!",
    });

    // 4. Process game logic end-of-round
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
