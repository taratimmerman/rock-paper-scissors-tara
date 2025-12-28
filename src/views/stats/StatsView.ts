import View from "../View";
import { IStatsView } from "./IStatsView";
import { Health, Participant, StandardMove } from "../../utils/dataObjectUtils";

class StatsView extends View implements IStatsView {
  protected declare _parentElement: HTMLElement;

  private get _computerHealthBarElement() {
    return this._getElement<HTMLElement>("computer-health");
  }

  private get _computerHealthElement() {
    return this._getElement<HTMLElement>("computer-health-text");
  }

  private get _computerMostCommonMoveElement() {
    return this._getElement<HTMLElement>("computer-most-common-move");
  }

  private get _computerTaraCountElement() {
    return this._getElement<HTMLElement>("computer-tara");
  }

  private get _playerHealthBarElement() {
    return this._getElement<HTMLElement>("player-health");
  }

  private get _playerHealthElement() {
    return this._getElement<HTMLElement>("player-health-text");
  }

  private get _playerMostCommonMoveElement() {
    return this._getElement<HTMLElement>("player-most-common-move");
  }

  private get _playerTaraCountElement() {
    return this._getElement<HTMLElement>("player-tara");
  }

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
    this._playerHealthElement.textContent = (playerHealth ?? 0).toString();
    this._computerHealthElement.textContent = (computerHealth ?? 0).toString();
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
    return participant === "player"
      ? this._playerHealthBarElement
      : this._computerHealthBarElement;
  }

  // ===== History Methods =====

  updateMostCommonMoves(
    player: StandardMove | null,
    computer: StandardMove | null
  ): void {
    this._playerMostCommonMoveElement.textContent = player ?? "N/A";
    this._computerMostCommonMoveElement.textContent = computer ?? "N/A";
  }

  // ===== Tara Methods =====

  updateTaraCounts(playerCount: number, computerCount: number): void {
    this._playerTaraCountElement.textContent = playerCount.toString();
    this._computerTaraCountElement.textContent = computerCount.toString();
  }
}

export default new StatsView();
