import { IModel } from "../model/IModel";
import { IView } from "../view/IView";
import { Move } from "../utils/dataObjectUtils";
import { DEFAULT_DELAY, MOVES, PARTICIPANTS } from "../utils/dataUtils";

export class Controller {
  private model: IModel;
  private view: IView;

  constructor(model: IModel, view: IView) {
    this.model = model;
    this.view = view;
  }

  private updateScoreView(): void {
    this.view.updateScores(
      this.model.getPlayerScore(),
      this.model.getComputerScore()
    );
  }

  private updateTaraView(): void {
    this.view.updateTaraCounts(
      this.model.getPlayerTaraCount(),
      this.model.getComputerTaraCount()
    );
  }

  private updateMostCommonMoveView(): void {
    this.view.updateMostCommonMoves(
      this.model.getPlayerMostCommonMove(),
      this.model.getComputerMostCommonMove()
    );
  }

  private updateHealthView(): void {
    const playerHealth = this.model.getHealth(PARTICIPANTS.PLAYER);
    const computerHealth = this.model.getHealth(PARTICIPANTS.COMPUTER);

    this.view.updateHealth(playerHealth, computerHealth);
    this.view.updateHealthBar(PARTICIPANTS.PLAYER, playerHealth);
    this.view.updateHealthBar(PARTICIPANTS.COMPUTER, computerHealth);
  }

  private updateTaraButtonView(): void {
    const isEnabled = this.model.taraIsEnabled();
    const taraCount = this.model.getPlayerTaraCount();

    this.view.updateTaraButton(isEnabled, taraCount);
  }

  private startGame(): void {
    const roundNumber = this.model.getRoundNumber();
    const matchNumber = this.model.getMatchNumber();

    this.model.setDefaultMatchData();
    this.view.updateRound(roundNumber);
    this.view.updateMatch(matchNumber);
    this.view.toggleControls(false);
    this.view.toggleGameStats(true);
    this.view.toggleMoveButtons(true);
    this.updateHealthView();
  }

  private endRound(): void {
    const playerMove = this.model.getPlayerMove();
    const computerMove = this.model.getComputerMove();
    const result = this.model.evaluateRound();
    const isMatchOver = this.model.isMatchOver();

    this.updateHealthView();

    if (isMatchOver) {
      const winner = this.model.handleMatchWin();
      this.view.showMatchOutcome(playerMove, computerMove, winner);
      this.model.incrementMatchNumber();
      this.model.setMatch(null);
    } else {
      this.view.showRoundOutcome(playerMove, computerMove, result);
      this.model.increaseRoundNumber();
    }

    this.updateScoreView();
    this.updateTaraView();
    this.updateMostCommonMoveView();
    this.updateTaraButtonView();
    this.view.updatePlayAgainButton(isMatchOver);
    this.view.togglePlayAgain(true);
  }

  private handleNextRound(): void {
    this.model.setDefaultMatchData();

    const roundNumber = this.model.getRoundNumber();
    const matchNumber = this.model.getMatchNumber();

    this.updateHealthView();
    this.view.updateRound(roundNumber);
    this.view.updateMatch(matchNumber);
    this.view.resetForNextRound();
  }

  private waitForTimeout(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async resetGameState(): Promise<void> {
    this.view.activateSpinner(true);

    this.model.resetScores();
    this.model.resetMoves();
    this.model.resetTaras();
    this.model.resetHistories();
    this.model.resetBothMoveCounts();
    this.model.resetMostCommonMoves();
    this.model.resetMatchData();

    this.updateScoreView();
    this.updateTaraView();
    this.updateHealthView();
    this.updateMostCommonMoveView();
    this.updateTaraButtonView();

    const isMatchActive = this.model.isMatchActive();
    this.view.updateStartButton(isMatchActive);

    await this.waitForTimeout(DEFAULT_DELAY / 2);
    this.view.activateSpinner(false);
  }

  async handlePlayerMove(move: Move): Promise<void> {
    this.view.activateSpinner(true);
    this.view.toggleMoveButtons(false);

    this.model.resetMoves();
    this.model.registerPlayerMove(move);
    this.model.chooseComputerMove();

    await this.waitForTimeout(DEFAULT_DELAY);
    this.view.activateSpinner(false);
    await this.waitForTimeout(DEFAULT_DELAY / 2);

    this.endRound();
  }

  async initialize(): Promise<void> {
    const isMatchActive = this.model.isMatchActive();
    this.updateScoreView();
    this.updateTaraView();
    this.updateMostCommonMoveView();
    this.updateTaraButtonView();

    await this.waitForTimeout(DEFAULT_DELAY);
    this.view.updateMessage("Rock, Paper, Scissors, Tara");
    this.view.activateSpinner(false);

    this.view.updateStartButton(isMatchActive);
    this.view.toggleGameStats(false);
    this.view.toggleMoveButtons(false);
    this.view.togglePlayAgain(false);
    this.view.toggleControls(true);

    this.view.bindStartGame(() => this.startGame());
    this.view.bindPlayAgain(() => this.handleNextRound());
    this.view.bindResetGame(() => this.resetGameState());
    this.view.bindPlayerMove((move) => this.handlePlayerMove(move));
  }
}
