import View from "./View";

export interface IStatsView {
  toggleGameStatsVisibility(show: boolean): void;
}

class StatsView extends View {
  protected _parentElement = document.getElementById(
    "game-stats"
  ) as HTMLElement;

  protected _generateMarkup(): string {
    // Currently empty, as this view relies on existing DOM structure
    return ``;
  }

  public toggleGameStatsVisibility(show: boolean) {
    this._toggleVisibility(this._parentElement, show);
  }
}

export default new StatsView();
