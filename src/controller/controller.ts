import { IModel } from "../model/IModel";
import { IMenuView } from "../views/menu/IMenuView";
import { IMoveView } from "../views/move/IMoveView";
import { IMoveRevealView } from "../views/moveReveal/IMoveRevealView";
import { IOutcomeView } from "../views/outcome/IOutcomeView";
import { IProgressView } from "../views/progress/IProgressView";
import { IStatsView } from "../views/stats/IStatsView";
import { Move } from "../utils/dataObjectUtils";
import { PARTICIPANTS, PLAYER_MOVES_DATA } from "../utils/dataUtils";

export class Controller {
  private model: IModel;
  private menuView: IMenuView;
  private moveView: IMoveView;
  private moveRevealView: IMoveRevealView;
  private outcomeView: IOutcomeView;
  private progressView: IProgressView;
  private statsView: IStatsView;

  constructor(
    model: IModel,
    views: {
      menuView: IMenuView;
      moveView: IMoveView;
      moveRevealView: IMoveRevealView;
      outcomeView: IOutcomeView;
      progressView: IProgressView;
      statsView: IStatsView;
    }
  ) {
    this.model = model;
    this.menuView = views.menuView;
    this.moveView = views.moveView;
    this.moveRevealView = views.moveRevealView;
    this.outcomeView = views.outcomeView;
    this.progressView = views.progressView;
    this.statsView = views.statsView;
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

  private updateTaraButtonView(): void {
    this.moveView.updateTaraButton(this.model.taraIsEnabled());
  }

  private startGame(): void {
    this.model.setDefaultMatchData();

    this.updateProgressView({ isVisible: true });
    this.menuView.toggleMenuVisibility(false);
    this.statsView.toggleGameStatsVisibility(true);
    this.moveView.toggleMoveButtons(true);
    this.updateHealthView();
  }

  private endRound(): void {
    const playerMove = this.model.getPlayerMove();
    const computerMove = this.model.getComputerMove();
    const result = this.model.evaluateRound();
    const isMatchOver = this.model.isMatchOver();

    this.updateHealthView();

    let resultMessage = result.toUpperCase();
    if (isMatchOver) {
      const winner = this.model.handleMatchWin();
      resultMessage = `${winner.toUpperCase()} WON THE MATCH!`;
      this.model.incrementMatchNumber();
      this.model.setMatch(null);
    } else {
      this.model.increaseRoundNumber();
    }

    this.outcomeView.updateOutcome({
      playerMove,
      computerMove,
      resultMessage,
      isMatchOver,
    });
    this.outcomeView.toggleOutcomeVisibility(true);

    this.updateScoreView();
    this.updateTaraView();
    this.updateMostCommonMoveView();
    this.updateTaraButtonView();
  }

  private handleNextRound(): void {
    this.model.setDefaultMatchData();

    this.updateHealthView();
    this.updateProgressView({ isVisible: true });

    this.moveRevealView.toggleVisibility(false);
    this.outcomeView.toggleOutcomeVisibility(false);
    this.moveView.toggleMoveButtons(true);
    this.statsView.toggleGameStatsVisibility(true);
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
    this.updateTaraButtonView();

    this.moveRevealView.toggleVisibility(false);
    this.outcomeView.toggleOutcomeVisibility(false);
    this.menuView.updateMenu({ isMatchActive });
  }

  async handlePlayerMove(move: Move): Promise<void> {
    this.moveView.toggleMoveButtons(false);
    this.model.resetMoves();
    this.model.registerPlayerMove(move);
    this.model.chooseComputerMove();

    this.moveRevealView.render({
      playerMoveId: this.model.getPlayerMove(),
      computerMoveId: this.model.getComputerMove(),
    });
    this.moveRevealView.toggleVisibility(true);

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

    this.moveView.render({
      moves: PLAYER_MOVES_DATA,
      taraIsEnabled: this.model.taraIsEnabled(),
    });

    this.outcomeView.render({
      playerMove: null,
      computerMove: null,
      resultMessage: "",
      isMatchOver: false,
      roundNumber: this.model.getRoundNumber(),
      matchNumber: this.model.getMatchNumber(),
    });

    this.updateScoreView();
    this.updateTaraView();
    this.updateMostCommonMoveView();

    this.menuView.updateMenu({ isMatchActive });
    this.statsView.toggleGameStatsVisibility(false);
    this.moveView.toggleMoveButtons(false);
    this.menuView.toggleMenuVisibility(true);

    this.menuView.bindStartMatch(() => this.startGame());
    this.outcomeView.bindPlayAgain(() => this.handleNextRound());
    this.menuView.bindResetGame(() => this.resetGameState());
    this.moveView.bindPlayerMove((move) => this.handlePlayerMove(move));
    this.updateTaraButtonView();
  }
}
