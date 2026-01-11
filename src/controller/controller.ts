import { IModel } from "../model/IModel";
import { IAnnouncementView } from "../views/announcement/IAnnouncementView";
import { IControlsView } from "../views/controls/IControlsView";
import { IMenuView } from "../views/menu/IMenuView";
import { IMoveRevealView } from "../views/moveReveal/IMoveRevealView";
import { IProgressView } from "../views/progress/IProgressView";
import { IStatsView } from "../views/stats/IStatsView";
import { IStatusView } from "../views/status/IStatusView";
import { Move } from "../utils/dataObjectUtils";
import { PARTICIPANTS, PLAYER_MOVES_DATA } from "../utils/dataUtils";

export class Controller {
  private model: IModel;
  private announcementView: IAnnouncementView;
  private controlsView: IControlsView;
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
      menuView: IMenuView;
      moveRevealView: IMoveRevealView;
      progressView: IProgressView;
      statsView: IStatsView;
      statusView: IStatusView;
    }
  ) {
    this.model = model;
    this.announcementView = views.announcementView;
    this.controlsView = views.controlsView;
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
      this.model.getComputerScore()
    );
  }

  private updateTaraView(): void {
    this.statsView.updateTaraCounts(
      this.model.getPlayerTaraCount(),
      this.model.getComputerTaraCount()
    );
  }

  private updateMostCommonMoveView(): void {
    this.statsView.updateMostCommonMoves(
      this.model.getPlayerMostCommonMove(),
      this.model.getComputerMostCommonMove()
    );
  }

  private updateHealthView(): void {
    const playerHealth = this.model.getHealth(PARTICIPANTS.PLAYER);
    const computerHealth = this.model.getHealth(PARTICIPANTS.COMPUTER);

    this.statsView.updateHealthBar(PARTICIPANTS.PLAYER, playerHealth);
    this.statsView.updateHealthBar(PARTICIPANTS.COMPUTER, computerHealth);
  }

  private startGame(): void {
    this.model.setDefaultMatchData();

    this.updateProgressView({ isVisible: true });
    this.menuView.toggleMenuVisibility(false);
    this.statsView.toggleGameStatsVisibility(true);
    this.statusView.setMessage("Choose your attack!");
    this.updateControlsView();
    this.updateHealthView();

    this.controlsView.toggleVisibility(true);
    this.controlsView.focus();
  }

  private endRound(): void {
    const playerMove = this.model.getPlayerMove();
    const computerMove = this.model.getComputerMove();
    const result = this.model.evaluateRound();
    const matchActuallyEnded = this.model.isMatchOver();

    this.updateHealthView();

    let resultMessage = result.toUpperCase();
    if (matchActuallyEnded) {
      const winner = this.model.handleMatchWin();
      resultMessage = `${winner.toUpperCase()} WON THE MATCH!`;
      this.model.incrementMatchNumber();
      this.model.setMatch(null);
    } else {
      this.model.increaseRoundNumber();
    }

    this.statusView.setMessage(
      `You played ${playerMove}. Computer played ${computerMove}.`
    );

    this.announcementView.setMessage(resultMessage);

    this.controlsView.render({
      playerMove: this.model.getPlayerMove(),
      isMatchOver: matchActuallyEnded,
      taraIsEnabled: this.model.taraIsEnabled(),
      moves: PLAYER_MOVES_DATA,
    });
    this.controlsView.focus();

    this.updateScoreView();
    this.updateTaraView();
    this.updateMostCommonMoveView();
  }

  private handleNextRound(): void {
    this.model.resetMoves();

    this.model.setDefaultMatchData();

    this.updateHealthView();
    this.updateProgressView({ isVisible: true });

    this.announcementView.setMessage("");
    this.statusView.setMessage("Choose your attack!");

    this.moveRevealView.toggleVisibility(false);
    this.statsView.toggleGameStatsVisibility(true);

    this.updateControlsView();
    this.controlsView.focus();
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
    this.menuView.focus();
    this.announcementView.setMessage("");
  }

  async handlePlayerMove(move: Move): Promise<void> {
    this.model.registerPlayerMove(move);
    this.model.chooseComputerMove();

    // Triggers "STATE B" in your ControlsView markup,
    // replacing the 4 choice cards with the "Next Round" button (or hiding them).
    this.controlsView.render({
      playerMove: move,
      isMatchOver: this.model.isMatchOver(),
      moves: [], // Not needed for State B
      taraIsEnabled: false,
    });

    // 2. Prepare MoveReveal (Face-down by default)
    this.moveRevealView.render({
      playerMoveId: this.model.getPlayerMove(),
      computerMoveId: this.model.getComputerMove(),
    });

    this.statusView.setMessage("Revealing moves...");
    this.moveRevealView.toggleVisibility(true);

    // Add a microscopic delay to allow the browser to paint the face-down cards
    // before the flip animation starts.
    await new Promise((resolve) => requestAnimationFrame(resolve));

    await this.moveRevealView.flipCards();

    this.endRound();
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
    this.menuView.focus();

    this.menuView.bindStartMatch(() => this.startGame());
    this.menuView.bindResetGame(() => this.resetGameState());
    this.controlsView.bindPlayerMove((move) => this.handlePlayerMove(move));
    this.controlsView.bindNextRound(() => this.handleNextRound());
  }
}
