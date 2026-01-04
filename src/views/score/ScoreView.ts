import View from "../View";
import { IScoreView } from "./IScoreView";

export default class ScoreView extends View implements IScoreView {
  protected declare _parentElement: HTMLElement;

  public render(): void {
    this._parentElement = this._getElement<HTMLElement>("game-stats");

    // DO NOT call super.render().
    // Calling super.render() triggers _clear()
  }

  private get _playerScoreElement() {
    return this._getElement<HTMLElement>("player-score");
  }

  private get _computerScoreElement() {
    return this._getElement<HTMLElement>("computer-score");
  }

  updateScores(player: number, computer: number): void {
    this._playerScoreElement.textContent = player.toString().padStart(2, "0");
    this._computerScoreElement.textContent = computer
      .toString()
      .padStart(2, "0");
  }

  // Satisfy the abstract requirement without doing anything
  protected _generateMarkup(): string {
    return "";
  }
}
