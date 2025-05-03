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

  private startGame(): void {
    this.view.toggleStartButton(false);
    this.view.toggleMoveButtons(true);
    this.view.updateRound(this.model.getRoundNumber());
  }

  private updateScoreView(): void {
    this.view.updateScores(
      this.model.getScore("player"),
      this.model.getScore("computer")
    );
  }

  private handleNextRound(): void {
    this.model.increaseRoundNumber();
    this.view.updateRound(this.model.getRoundNumber());
    this.view.resetForNextRound();
  }

  initialize(): void {
    this.view.updateMessage("Rock, Paper, Scissors, Tara");
    this.updateScoreView();
    this.view.toggleMoveButtons(false);
    this.view.togglePlayAgain(false);
    this.view.toggleStartButton(true);

    document
      .getElementById("start-game")
      ?.addEventListener("click", () => this.startGame());

    document
      .getElementById("play-again")
      ?.addEventListener("click", () => this.handleNextRound());

    MOVES.map((m) => m.name).forEach((id) => {
      document
        .getElementById(id)
        ?.addEventListener("click", () => this.handlePlayerMove(id));
    });
  }

  private handlePlayerMove(move: Move): void {
    this.model.setPlayerMove(move);
    this.model.chooseComputerMove();

    const playerMove = this.model.getPlayerMove();
    const computerMove = this.model.getComputerMove();
    const result = this.model.evaluateRound();

    this.view.showRoundOutcome(playerMove, computerMove, result);
    this.view.toggleMoveButtons(false);
    this.view.togglePlayAgain(true);
    this.updateScoreView();
  }
}
