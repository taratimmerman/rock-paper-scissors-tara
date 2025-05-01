import { Model } from "./model/model";
import { View } from "./view";

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
  }
}
