import View from "../View";
import { IStatsView, StatsViewData } from "./IStatsView";
import { renderIcon } from "../../utils/imageUtils";
import {
  MAX_TARA,
  MOVES_DATABASE,
  PLAYER_MOVES_DATA,
  STANDARD_MOVE_NAMES,
  StandardMove,
} from "../../utils/dataUtils";

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

  public updateHealth(playerHealth: number, computerHealth: number): void {
    const playerBar = this._parentElement?.querySelector(
      "#player-health",
    ) as HTMLElement;
    const computerBar = this._parentElement?.querySelector(
      "#computer-health",
    ) as HTMLElement;

    if (playerBar) playerBar.style.width = `${playerHealth}%`;
    if (computerBar) computerBar.style.width = `${computerHealth}%`;

    this._data.playerHealth = playerHealth;
    this._data.computerHealth = computerHealth;
  }

  private _generateTaraIcons(availableCount: number): string {
    let iconsMarkup = "";

    for (let i = 0; i < MAX_TARA; i++) {
      // If the current index is less than the available count, it's active
      const statusClass = i < availableCount ? "tara-active" : "tara-inactive";

      iconsMarkup += `
        <div class="tara-icon-wrapper ${statusClass}">
          ${renderIcon(MOVES_DATABASE.TARA.icon)}
        </div>
      `;
    }

    return iconsMarkup;
  }

  private _generateCommonMoveSlot(
    moveId: StandardMove | null | undefined,
    alignment: "left" | "right",
  ): string {
    let allIconsMarkup = "";

    STANDARD_MOVE_NAMES.forEach((standardMove) => {
      const moveObj = PLAYER_MOVES_DATA.find((m) => m.id === standardMove);

      if (moveObj) {
        // Only remove the hidden class if it matches the current moveId
        const isCurrentMove = moveId === standardMove;
        const hiddenClass = isCurrentMove ? "" : "hidden";

        allIconsMarkup += `
          <div class="common-icon-slot ${hiddenClass}" data-move="${standardMove}">
            ${renderIcon(moveObj.icon)}
          </div>
        `;
      }
    });

    return `
      <div class="common-move-wrapper ${alignment}-aligned">
        <span class="common-move-label">COMMON MOVE</span>
        <div class="common-move-slot">
          ${allIconsMarkup}
        </div>
      </div>
    `;
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

        <div class="tara-container player-tara-container">
          ${this._generateTaraIcons(playerTara)}
        </div>

        ${this._generateCommonMoveSlot(playerMostCommonMove, "left")}
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

        <div class="tara-container computer-tara-container">
          ${this._generateTaraIcons(computerTara)}
        </div>

        ${this._generateCommonMoveSlot(computerMostCommonMove, "right")}
      </aside>
    `;
  }
}
