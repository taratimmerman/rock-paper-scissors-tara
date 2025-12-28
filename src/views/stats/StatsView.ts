import View from "../View";
import { IStatsView } from "./IStatsView";
import { Health, Participant, StandardMove } from "../../utils/dataObjectUtils";

class StatsView extends View implements IStatsView {
  protected declare _parentElement: HTMLElement;

  private _playerHealthEl!: HTMLElement;
  private _computerHealthEl!: HTMLElement;
  private _playerHealthBarEl!: HTMLElement;
  private _computerHealthBarEl!: HTMLElement;
  private _playerMostCommonMoveEl!: HTMLElement;
  private _computerMostCommonMoveEl!: HTMLElement;

  // ===== General Methods =====

  protected _generateMarkup(): string {
    // Intentional: Returning empty because HTML exists in index.html
    return ``;
  }

  public toggleGameStatsVisibility(show: boolean) {
    this._parentElement = this._getElement("game-stats");
    this._toggleVisibility(this._parentElement, show);
  }

  // ===== Health Methods =====

  public updateHealth(playerHealth: Health, computerHealth: Health): void {
    this._playerHealthEl = this._getElement<HTMLElement>("player-health-text");
    this._computerHealthEl = this._getElement<HTMLElement>(
      "computer-health-text"
    );

    this._playerHealthEl.textContent = (playerHealth ?? 0).toString();
    this._computerHealthEl.textContent = (computerHealth ?? 0).toString();
  }

  public updateHealthBar(participant: Participant, health: Health): void {
    const bar = this._getHealthBar(participant);

    // Reset classes but keep the base 'bar'
    bar.className = "bar";

    switch (health) {
      case 100:
        bar.classList.add("full");
        break;
      case 50:
        bar.classList.add("half");
        break;
      case 0:
      case null:
        bar.classList.add("zero");
        break;
    }
  }

  private _getHealthBar(participant: Participant): HTMLElement {
    this._playerHealthBarEl = this._getElement<HTMLElement>("player-health");
    this._computerHealthBarEl =
      this._getElement<HTMLElement>("computer-health");

    return participant === "player"
      ? this._playerHealthBarEl
      : this._computerHealthBarEl;
  }

  // ===== History Methods =====

  updateMostCommonMoves(
    player: StandardMove | null,
    computer: StandardMove | null
  ): void {
    this._playerMostCommonMoveEl = this._getElement<HTMLElement>(
      "player-most-common-move"
    );
    this._computerMostCommonMoveEl = this._getElement<HTMLElement>(
      "computer-most-common-move"
    );

    this._playerMostCommonMoveEl.textContent = player ?? "N/A";
    this._computerMostCommonMoveEl.textContent = computer ?? "N/A";
  }
}

export default new StatsView();
