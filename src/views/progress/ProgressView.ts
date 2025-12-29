import View from "../View";
import { IProgressView, ProgressData } from "./IProgressView";

class ProgressView extends View<ProgressData> implements IProgressView {
  protected declare _parentElement: HTMLElement;
  private _matchElement?: HTMLElement;
  private _roundElement?: HTMLElement;

  private _ensureElements(): void {
    if (!this._parentElement || !document.body.contains(this._parentElement)) {
      this._parentElement = this._getElement("game-progress-container");
    }

    if (!this._matchElement || !document.body.contains(this._matchElement)) {
      this._matchElement = this._getElement("match");
    }
    if (!this._roundElement || !document.body.contains(this._roundElement)) {
      this._roundElement = this._getElement("round");
    }
  }

  public render(data: ProgressData): void {
    this._ensureElements();
    this._data = data;
    this.updateProgress(data);
  }

  public updateProgress(data: ProgressData): void {
    this._ensureElements();
    this._data = data;

    if (this._matchElement)
      this._matchElement.textContent = `Match ${data.matchNumber}`;
    if (this._roundElement)
      this._roundElement.textContent = `Round ${data.roundNumber}`;

    this._toggleVisibility(this._parentElement, data.isVisible);
  }

  protected _generateMarkup(): string {
    return `
      <h1 id="match">Match ${this._data?.matchNumber ?? ""}</h1>
      <h2 id="round">Round ${this._data?.roundNumber ?? ""}</h2>
    `;
  }
}

export default new ProgressView();
