import { IModel } from "../model/IModel";
import { IAnnouncementView } from "../views/announcement/IAnnouncementView";
import { IControlsView } from "../views/controls/IControlsView";
import { IGameView } from "../views/game/IGameView";
import { IMenuView } from "../views/menu/IMenuView";
import { IMoveRevealView } from "../views/moveReveal/IMoveRevealView";
import { IProgressView } from "../views/progress/IProgressView";
import { IStatsView } from "../views/stats/IStatsView";
import { IStatusView } from "../views/status/IStatusView";
import { Move } from "../utils/dataObjectUtils";
import {
  MOVE_DISPLAY_NAMES,
  PARTICIPANTS,
  PLAYER_MOVES_DATA,
} from "../utils/dataUtils";

export class Controller {
  private model: IModel;
  private announcementView: IAnnouncementView;
  private controlsView: IControlsView;
  private gameView: IGameView;
  private menuView: IMenuView;
  private moveRevealView: IMoveRevealView;
  private progressView: IProgressView;
  private statsView: IStatsView;
  private statusView: IStatusView;

  constructor(
    model: IModel,
    views: {
      announcementView: IAnnouncementView;
      controlsView: IControlsView;
      gameView: IGameView;
      menuView: IMenuView;
      moveRevealView: IMoveRevealView;
      progressView: IProgressView;
      statsView: IStatsView;
      statusView: IStatusView;
    },
  ) {
    this.model = model;
    this.announcementView = views.announcementView;
    this.controlsView = views.controlsView;
    this.gameView = views.gameView;
    this.menuView = views.menuView;
    this.moveRevealView = views.moveRevealView;
    this.progressView = views.progressView;
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

  private updateProgressView(options: { isVisible: boolean }): void {
    this.progressView.update({
      matchNumber: this.model.getMatchNumber(),
      roundNumber: this.model.getRoundNumber(),
      isVisible: options.isVisible,
    });
  }

  private updateScoreView(): void {
    this.statsView.updateScores(
      this.model.getPlayerScore(),
      this.model.getComputerScore(),
    );
  }

  private updateTaraView(): void {
    this.statsView.updateTaraCounts(
      this.model.getPlayerTaraCount(),
      this.model.getComputerTaraCount(),
    );
  }

  private updateMostCommonMoveView(): void {
    this.statsView.updateMostCommonMoves(
      this.model.getPlayerMostCommonMove(),
      this.model.getComputerMostCommonMove(),
    );
  }

  private updateHealthView(): void {
    const playerHealth = this.model.getHealth(PARTICIPANTS.PLAYER);
    const computerHealth = this.model.getHealth(PARTICIPANTS.COMPUTER);

    this.statsView.updateHealthBar(PARTICIPANTS.PLAYER, playerHealth);
    this.statsView.updateHealthBar(PARTICIPANTS.COMPUTER, computerHealth);
  }

  private async startGame(): Promise<void> {
    this.model.setDefaultMatchData();

    this.resetArenaVisuals();
    this.statusView.setMessage("Get ready...");

    this.menuView.toggleMenuVisibility(false);
    this.gameView.toggleVisibility(true);
    this.statsView.toggleGameStatsVisibility(true);
    this.controlsView.toggleVisibility(true);

    await this.handleNextRound();
  }

  private endRound(roundResult: string): void {
    const matchActuallyEnded = this.model.isMatchOver();
    const isDoubleKO = this.model.isDoubleKO();

    this.updateHealthView();
    let resultMessage = roundResult.toUpperCase();

    this.statusView.setMessage(
      `You played ${MOVE_DISPLAY_NAMES[this.model.getPlayerMove()]}. Computer played ${MOVE_DISPLAY_NAMES[this.model.getComputerMove()]}.`,
    );

    // --- MATCH END ---
    if (matchActuallyEnded) {
      const result = this.model.handleMatchWin();

      resultMessage = isDoubleKO
        ? "DOUBLE KO! NOBODY WINS!"
        : `${result.toUpperCase()} WON THE MATCH!`;

      this.announcementView.setMessage(resultMessage);

      this.model.incrementMatchNumber();

      this.updateScoreView();
      this.updateMostCommonMoveView();
      this.updateTaraView();
      this.updateControlsView();

      this.model.setMatch(null);
      return;
    }

    // --- ROUND CONTINUES ---
    this.announcementView.setMessage(resultMessage);
    this.updateScoreView();
    this.updateTaraView();
    this.updateMostCommonMoveView();

    this.model.increaseRoundNumber();

    setTimeout(() => {
      this.handleNextRound();
    }, 2000);
  }

  private async handleNextRound(): Promise<void> {
    this.model.resetMoves();

    this.announcementView.setMessage("");
    this.moveRevealView.toggleVisibility(false);

    this.updateControlsView();
    this.updateProgressView({ isVisible: true });

    this.statusView.setMessage("Prepare your next move...");

    await this.controlsView.flipAll(true);
    this.statusView.setMessage("Choose your attack!");
  }

  async resetGameState(): Promise<void> {
    this.model.resetScores();
    this.model.resetMoves();
    this.model.resetTaras();
    this.model.resetHistories();
    this.model.resetBothMoveCounts();
    this.model.resetMostCommonMoves();
    this.model.resetMatchData();

    const isMatchActive = this.model.isMatchActive();

    this.updateScoreView();
    this.updateTaraView();
    this.updateHealthView();
    this.updateMostCommonMoveView();
    this.updateControlsView();

    this.moveRevealView.toggleVisibility(false);
    this.controlsView.toggleVisibility(false);
    this.menuView.updateMenu({ isMatchActive });
    this.announcementView.setMessage("");
  }

  private resetArenaVisuals(): void {
    this.moveRevealView.clear();
    this.announcementView.setMessage("");
    this.updateProgressView({ isVisible: true });
    this.updateHealthView();
  }

  async handlePlayerMove(move: Move): Promise<void> {
    // Let the computer choose based on PREVIOUS history
    this.model.chooseComputerMove();

    // Record the player's move for NEXT round's calculations
    this.model.registerPlayerMove(move);

    // 1. Preparation
    this.statusView.setMessage("Locking in move...");
    await this.controlsView.flipAll(false);

    this.moveRevealView.render({
      playerMoveId: this.model.getPlayerMove(),
      computerMoveId: this.model.getComputerMove(),
    });

    // 2. The Reveal
    this.moveRevealView.toggleVisibility(true);
    await this.moveRevealView.animateEntrance();
    await this.moveRevealView.flipCards();

    // 3. Combat & Drama Sequence
    const pMove = this.model.getPlayerMove();
    const cMove = this.model.getComputerMove();

    const roundResult = this.model.evaluateRound();

    if (pMove && cMove) {
      await this.moveRevealView.playFightAnimations(pMove, cMove);

      if (pMove !== cMove) {
        const playerWins = this.model.doesMoveBeat(pMove, cMove);
        await this.executeOutcomeDrama(playerWins);
      } else {
        this.updateHealthView();
        await this.moveRevealView.triggerImpact("both");
        await this.moveRevealView.triggerDefeat("both");
      }
    }

    this.endRound(roundResult);
  }

  /**
   * Handles the visual "aftermath" of the fight.
   */
  private async executeOutcomeDrama(playerWins: boolean): Promise<void> {
    const isDoubleKO = this.model.isDoubleKO();

    if (isDoubleKO) {
      await this.executeDoubleKODrama();
      return;
    }

    const winner = playerWins ? "player" : "computer";
    const loser = playerWins ? "computer" : "player";

    this.statusView.setMessage(`${winner.toUpperCase()} LANDS A BLOW!`);
    const impactPromise = this.moveRevealView.triggerImpact(loser);
    this.updateHealthView();
    await impactPromise;

    await Promise.all([
      this.moveRevealView.highlightWinner(winner),
      this.moveRevealView.triggerDefeat(loser),
    ]);
  }

  private async executeDoubleKODrama(): Promise<void> {
    this.statusView.setMessage("MUTUAL DESTRUCTION!");

    const impactPromise = this.moveRevealView.triggerImpact("both");

    this.updateHealthView();
    await impactPromise;

    await this.moveRevealView.triggerDefeat("both");
  }

  async initialize(): Promise<void> {
    const isMatchActive = this.model.isMatchActive();

    this.menuView.render({ isMatchActive });

    this.progressView.render({
      matchNumber: this.model.getMatchNumber(),
      roundNumber: this.model.getRoundNumber(),
      isVisible: false,
    });

    this.announcementView.render({ message: "" });
    this.statusView.render({ message: "" });

    this.updateControlsView();
    this.updateScoreView();
    this.updateTaraView();
    this.updateMostCommonMoveView();

    this.menuView.updateMenu({ isMatchActive });
    this.statsView.toggleGameStatsVisibility(false);
    this.controlsView.toggleVisibility(false);
    this.menuView.toggleMenuVisibility(true);

    this.menuView.bindStartMatch(() => this.startGame());
    this.menuView.bindResetGame(() => this.resetGameState());
    this.controlsView.bindPlayerMove((move) => this.handlePlayerMove(move));
    this.controlsView.bindStartNewMatch(() => this.startGame());
  }
}
