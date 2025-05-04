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

  private updateTaraButtonView(): void {
    const isEnabled = this.model.taraIsEnabled();
    const taraCount = this.model.getPlayerTaraCount();
    this.view.updateTaraButton(isEnabled, taraCount);
  }

  private startGame(): void {
    this.view.toggleStartButton(false);
    this.view.toggleMoveButtons(true);
    this.view.updateRound(this.model.getRoundNumber());
  }

  private endRound(): void {
    const playerMove = this.model.getPlayerMove();
    const computerMove = this.model.getComputerMove();
    const result = this.model.evaluateRound();

    this.view.showRoundOutcome(playerMove, computerMove, result);
    this.view.toggleMoveButtons(false);
    this.view.togglePlayAgain(true);
    this.model.increaseRoundNumber();
    this.updateScoreView();
    this.updateTaraView();
    this.updateTaraButtonView();
  }

  private handleNextRound(): void {
    this.view.updateRound(this.model.getRoundNumber());
    this.view.resetForNextRound();
  }

  handlePlayerMove(move: Move): void {
    this.model.resetMoves();
    this.model.setPlayerMove(move);
    this.model.chooseComputerMove();
    this.endRound();
  }

  initialize(): void {
    this.view.updateMessage("Rock, Paper, Scissors, Tara");
    this.updateScoreView();
    this.updateTaraView();
    this.updateTaraButtonView();
    this.view.toggleMoveButtons(false);
    this.view.togglePlayAgain(false);
    this.view.toggleStartButton(true);

    document
      .getElementById("start-game")
      ?.addEventListener("click", () => this.startGame());

    document
      .getElementById("play-again")
      ?.addEventListener("click", () => this.handleNextRound());

    Object.values(MOVES).forEach((move) => {
      document
        .getElementById(move)
        ?.addEventListener("click", () => this.handlePlayerMove(move));
    });
  }
}
