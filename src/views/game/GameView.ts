import View from "../View";
import { IGameView } from "./IGameView";

export default class GameView extends View implements IGameView {
  protected declare _parentElement: HTMLElement;

  private _ensureParentElement(): void {
    if (!this._parentElement || !document.body.contains(this._parentElement)) {
      this._parentElement = this._getElement("game-container");
    }
  }

  public toggleVisibility(show: boolean): void {
    this._ensureParentElement();
    this._toggleVisibility(this._parentElement, show);
  }

  // Satisfy the abstract requirement without doing anything
  protected _generateMarkup(): string {
    return "";
  }
}
