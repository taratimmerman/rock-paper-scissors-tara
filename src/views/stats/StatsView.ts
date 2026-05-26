import View from "../View";
import { IStatsView, StatsViewData } from "./IStatsView";

export default class StatsView
  extends View<StatsViewData>
  implements IStatsView
{
  declare protected _parentElement: HTMLElement;

  private _ensureParentElement(): void {
    if (!this._parentElement || !document.body.contains(this._parentElement)) {
      this._parentElement = this._getElement<HTMLElement>("game-stats");
    }
  }

  public update(data: StatsViewData): void {
    this._ensureParentElement();

    if (!this.hasData) {
      super.render(data);
    } else {
      super.update(data);
    }
  }

  public toggleGameStatsVisibility(show: boolean): void {
    this._ensureParentElement();
    this._toggleVisibility(this._parentElement, show);
  }

  protected _generateMarkup(): string {
    const {
      playerHealth,
      computerHealth,
      playerScore,
      computerScore,
      playerTara,
      computerTara,
      playerMostCommonMove,
      computerMostCommonMove,
      matchNumber,
      roundNumber,
    } = this._data;

    return `
      <aside id="player-stats" class="stats">
        <div class="score-row"><span>${playerScore.toString().padStart(2, "0")}</span> <span>WINS</span></div>
        <div class="bar-wrapper">
          <div class="bar" id="player-health" style="width: ${playerHealth}%"></div>
          <span class="bar-text">PLAYER</span>
        </div>
        <p><span>Tara x</span><span>${playerTara}</span></p>
        <p><small><span>Common: </span><span>${playerMostCommonMove ?? "–"}</span></small></p>
      </aside>

      <section id="game-progress-container">
        <h2>Match ${matchNumber}</h2>
        <h3>Round ${roundNumber}</h3>
      </section>

      <aside id="computer-stats" class="stats">
        <div class="score-row"><span>WINS</span> <span>${computerScore.toString().padStart(2, "0")}</span></div>
        <div class="bar-wrapper">
          <div class="bar" id="computer-health" style="width: ${computerHealth}%"></div>
          <span class="bar-text">COMPUTER</span>
        </div>
        <p><span>Tara x</span><span>${computerTara}</span></p>
        <p><small><span>Common: </span><span>${computerMostCommonMove ?? "–"}</span></small></p>
      </aside>
    `;
  }
}
