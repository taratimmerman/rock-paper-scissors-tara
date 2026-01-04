import View from "../View";
import { IStatsView } from "./IStatsView";
import { Health, Participant, StandardMove } from "../../utils/dataObjectUtils";

export default class StatsView extends View implements IStatsView {
  protected declare _parentElement: HTMLElement;

  private get _computerHealthBarElement() {
    return this._getElement<HTMLElement>("computer-health");
  }

  private get _computerMostCommonMoveElement() {
    return this._getElement<HTMLElement>("computer-most-common-move");
  }

  private get _computerScoreElement() {
    return this._getElement<HTMLElement>("computer-score");
  }

  private get _computerTaraCountElement() {
    return this._getElement<HTMLElement>("computer-tara");
  }

  private get _playerHealthBarElement() {
    return this._getElement<HTMLElement>("player-health");
  }

  private get _playerMostCommonMoveElement() {
    return this._getElement<HTMLElement>("player-most-common-move");
  }

  private get _playerScoreElement() {
    return this._getElement<HTMLElement>("player-score");
  }

  private get _playerTaraCountElement() {
    return this._getElement<HTMLElement>("player-tara");
  }

  // ===== General Methods =====

  // Satisfy the abstract requirement without doing anything
  protected _generateMarkup(): string {
    return "";
  }

  public render(): void {
    this._parentElement = this._getElement<HTMLElement>("game-stats");

    // DO NOT call super.render().
    // Calling super.render() triggers _clear()
  }

  public toggleGameStatsVisibility(show: boolean) {
    this._parentElement = this._getElement("game-stats");
    this._toggleVisibility(this._parentElement, show);
  }

  // ===== Health Methods =====

  public updateHealthBar(participant: Participant, health: Health): void {
    const bar = this._getHealthBar(participant);

    // Directly set width percentage
    bar.style.width = `${health}%`;
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

  // ===== Score Methods =====

  public updateScores(player: number, computer: number): void {
    this._playerScoreElement.textContent = player!.toString().padStart(2, "0");
    this._computerScoreElement.textContent = computer!
      .toString()
      .padStart(2, "0");
  }

  // ===== Tara Methods =====

  updateTaraCounts(playerCount: number, computerCount: number): void {
    this._playerTaraCountElement.textContent = playerCount.toString();
    this._computerTaraCountElement.textContent = computerCount.toString();
  }
}
