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
    const player = this.model.getScore("player");
    const computer = this.model.getScore("computer");
    this.view.updateMessage("Ready to play Rock, Paper, Scissors, Tara!");
    this.view.updateScores(player, computer);

    document
      .getElementById("rock")
      ?.addEventListener("click", () => this.handlePlayerMove("rock"));
    document
      .getElementById("paper")
      ?.addEventListener("click", () => this.handlePlayerMove("paper"));
    document
      .getElementById("scissors")
      ?.addEventListener("click", () => this.handlePlayerMove("scissors"));
  }

  private handlePlayerMove(move: Move): void {
    this.model.setPlayerMove(move);
    console.log("Player chose:", this.model.getPlayerMove());
  }
}
