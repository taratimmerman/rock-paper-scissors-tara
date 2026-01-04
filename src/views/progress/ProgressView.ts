import View from "../View";
import { IProgressView, ProgressData } from "./IProgressView";

export default class ProgressView
  extends View<ProgressData>
  implements IProgressView
{
  protected declare _parentElement: HTMLElement;

  private _ensureParentElement(): void {
    if (!this._parentElement || !document.body.contains(this._parentElement)) {
      this._parentElement = this._getElement("game-progress-container");
    }
  }

  protected _generateMarkup(): string {
    return `
      <h2 id="match">Match ${this._data.matchNumber}</h1>
      <h1 id="round">Round ${this._data.roundNumber}</h2>
    `;
  }

  /**
   * Initial display of the progress section
   */
  public render(data: ProgressData): void {
    this._ensureParentElement();
    super.render(data);
    this._toggleVisibility(this._parentElement, data.isVisible);
  }

  /**
   * Updates Match and Round numbers and visibility
   */
  public update(data: ProgressData): void {
    this._ensureParentElement();
    super.update(data);
    this._toggleVisibility(this._parentElement, data.isVisible);
  }
}
