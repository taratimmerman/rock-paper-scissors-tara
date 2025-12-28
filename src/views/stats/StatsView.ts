import View from "../View";
import { IStatsView } from "./IStatsView";

class StatsView extends View implements IStatsView {
  protected declare _parentElement: HTMLElement;

  protected _generateMarkup(): string {
    // Intentional: Returning empty because HTML exists in index.html
    return ``;
  }

  public toggleGameStatsVisibility(show: boolean) {
    this._parentElement = this._getElement("game-stats");
    this._toggleVisibility(this._parentElement, show);
  }
}

export default new StatsView();
