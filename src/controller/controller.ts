import { Model } from "../model/model";
import { View } from "../view";
import { Move } from "../utils/dataObjectUtils";

export class Controller {
  private model: Model;
  private view: View;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;
  }

  initialize(): void {
    this.view.updateMessage("Rock, Paper, Scissors, Tara");
    this.view.updateScores(
      this.model.getScore("player"),
      this.model.getScore("computer")
    );

    ["rock", "paper", "scissors"].forEach((id) => {
      document
        .getElementById(id)
        ?.addEventListener("click", () => this.handlePlayerMove(id as Move));
    });

    document
      .getElementById("play-again")
      ?.addEventListener("click", () => this.view.resetForNextRound());
  }

  private handlePlayerMove(move: Move): void {
    this.model.setPlayerMove(move);
    this.model.chooseComputerMove();

    const playerMove = this.model.getPlayerMove();
    const computerMove = this.model.getComputerMove();
    const result = this.model.evaluateRound();

    this.view.showMoves(playerMove, computerMove, result);
    this.view.toggleMoveButtons(false);
    this.view.togglePlayAgain(true);
  }
}
