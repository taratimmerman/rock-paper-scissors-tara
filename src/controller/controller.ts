import { Model } from "../model/model";
import { View } from "../view";
import { Move } from "../utils/dataObjectUtils";
import { MOVES } from "../utils/dataUtils";

export class Controller {
  private model: Model;
  private view: View;

  constructor(model: Model, view: View) {
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
    const playerMostCommonMove = this.model.getPlayerMostCommonMove();
    const comptuterMostCommonMove = this.model.getComputerMostCommonMove();

    this.view.updateMostCommonMoves(
      playerMostCommonMove,
      comptuterMostCommonMove
    );
  }

  private updateTaraButtonView(): void {
    const isEnabled = this.model.taraIsEnabled();
    const taraCount = this.model.getPlayerTaraCount();
    this.view.updateTaraButton(isEnabled, taraCount);
  }

  private startGame(): void {
    const roundNumber = this.model.getRoundNumber();
    const matchNumber = this.model.getMatchNumber();
    const showMostCommonMove = this.model.showMostCommonMove();

    this.model.setDefaultMatchData();
    this.view.toggleStartButton(false);
    this.view.toggleResetGameState(false);
    this.view.toggleMostCommonMoveTable(showMostCommonMove);
    this.view.toggleMoveButtons(true);
    this.view.updateRound(roundNumber);
    this.view.updateMatch(matchNumber);
  }

  private endRound(): void {
    const playerMove = this.model.getPlayerMove();
    const computerMove = this.model.getComputerMove();
    const result = this.model.evaluateRound();

    this.view.showRoundOutcome(playerMove, computerMove, result);
    this.view.toggleMostCommonMoveTable(false);
    this.view.toggleMoveButtons(false);
    this.view.togglePlayAgain(true);
    this.model.increaseRoundNumber();
    this.updateScoreView();
    this.updateTaraView();
    this.updateMostCommonMoveView();
    this.updateTaraButtonView();
  }

  private handleNextRound(): void {
    this.view.updateRound(this.model.getRoundNumber());
    this.view.resetForNextRound();
  }

  resetGameState(): void {
    this.model.resetScores();
    this.model.resetMoves();
    this.model.resetTaras();
    this.model.resetHistories();
    this.model.resetBothMoveCounts();
    this.model.resetMostCommonMoves();
    this.model.resetMatchData();

    this.updateScoreView();
    this.updateTaraView();
    this.updateMostCommonMoveView();
    this.updateTaraButtonView();

    const isMatchActive = this.model.isMatchActive();
    this.view.updateStartButton(isMatchActive);
  }

  handlePlayerMove(move: Move): void {
    this.model.resetMoves();
    this.model.registerPlayerMove(move);
    this.model.chooseComputerMove();

    this.endRound();
  }

  initialize(): void {
    const isMatchActive = this.model.isMatchActive();

    this.view.updateMessage("Rock, Paper, Scissors, Tara");
    this.updateScoreView();
    this.updateTaraView();
    this.updateMostCommonMoveView();
    this.updateTaraButtonView();
    this.view.updateStartButton(isMatchActive);
    this.view.toggleMostCommonMoveTable(false);
    this.view.toggleMoveButtons(false);
    this.view.togglePlayAgain(false);
    this.view.toggleStartButton(true);

    document
      .getElementById("start")
      ?.addEventListener("click", () => this.startGame());

    document
      .getElementById("play-again")
      ?.addEventListener("click", () => this.handleNextRound());

    Object.values(MOVES).forEach((move) => {
      document
        .getElementById(move)
        ?.addEventListener("click", () => this.handlePlayerMove(move));
    });

    document
      .getElementById("reset-game-state")
      ?.addEventListener("click", () => this.resetGameState());
  }
}
