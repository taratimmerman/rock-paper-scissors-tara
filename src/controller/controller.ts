import { IModel } from "../model/IModel";
import { IView } from "../views/IView";
import { IMenuView } from "../views/menu/IMenuView";
import { IMoveView } from "../views/move/IMoveView";
import { IOutcomeView } from "../views/outcome/IOutcomeView";
import { IProgressView } from "../views/progress/IProgressView";
import { IScoreView } from "../views/score/IScoreView";
import { IStatsView } from "../views/stats/IStatsView";
import { Move } from "../utils/dataObjectUtils";
import { PARTICIPANTS, PLAYER_MOVES_DATA } from "../utils/dataUtils";

export class Controller {
  private model: IModel;
  private view: IView;
  private menuView: IMenuView;
  private moveView: IMoveView;
  private outcomeView: IOutcomeView;
  private progressView: IProgressView;
  private scoreView: IScoreView;
  private statsView: IStatsView;

  constructor(
    model: IModel,
    views: {
      menuView: IMenuView;
      mainView: IView;
      moveView: IMoveView;
      outcomeView: IOutcomeView;
      progressView: IProgressView;
      scoreView: IScoreView;
      statsView: IStatsView;
    }
  ) {
    this.model = model;
    this.view = views.mainView;
    this.menuView = views.menuView;
    this.moveView = views.moveView;
    this.outcomeView = views.outcomeView;
    this.progressView = views.progressView;
    this.scoreView = views.scoreView;
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
    this.scoreView.updateScores(
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

    this.statsView.updateHealth(playerHealth, computerHealth);
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

    this.outcomeView.toggleOutcomeVisibility(false);
    this.menuView.updateMenu({ isMatchActive });
  }

  async handlePlayerMove(move: Move): Promise<void> {
    this.moveView.toggleMoveButtons(false);
    this.model.resetMoves();
    this.model.registerPlayerMove(move);
    this.model.chooseComputerMove();
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
    this.view.updateMessage("Rock, Paper, Scissors, Tara");

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
