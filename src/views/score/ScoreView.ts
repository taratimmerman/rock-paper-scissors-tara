import View from "../View";
import { IScoreView } from "./IScoreView";

class ScoreView extends View implements IScoreView {
  protected declare _parentElement: HTMLElement;

  private get _playerScoreElement() {
    return this._getElement<HTMLElement>("player-score");
  }

  private get _computerScoreElement() {
    return this._getElement<HTMLElement>("computer-score");
  }

  // ===== General Methods =====

  protected _generateMarkup(): string {
    // Intentional: Returning empty because HTML exists in index.html
    return ``;
  }

  // ===== Score Methods =====

  updateScores(player: number, computer: number): void {
    this._playerScoreElement.textContent = player.toString();
    this._computerScoreElement.textContent = computer.toString();
  }
}

export default new ScoreView();
