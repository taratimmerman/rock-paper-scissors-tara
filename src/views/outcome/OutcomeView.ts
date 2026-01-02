import View from "../View";
import { IOutcomeView, OutcomeViewData } from "./IOutcomeView";

class OutcomeView extends View<OutcomeViewData> implements IOutcomeView {
  protected declare _parentElement: HTMLElement;

  protected _generateMarkup(): string {
    const { resultMessage, isMatchOver } = this._data;

    return `
      <h2 id="round-result">${resultMessage}</h2>
      <button id="play-again">${
        isMatchOver ? "Start New Match" : "Next Round"
      }</button>
    `;
  }

  public render(data: OutcomeViewData): void {
    this._parentElement = this._getElement<HTMLElement>("result-display");

    this.toggleOutcomeVisibility(false);

    super.render(data);
  }

  public bindPlayAgain(handler: () => void): void {
    if (!this._parentElement) {
      this._parentElement = this._getElement<HTMLElement>("result-display");
    }

    this._parentElement.addEventListener("click", (e) => {
      const btn = (e.target as HTMLElement).closest("#play-again");
      if (btn) handler();
    });
  }

  public toggleOutcomeVisibility(show: boolean): void {
    this._toggleVisibility(this._parentElement, show);
  }

  public updateOutcome(data: Partial<OutcomeViewData>): void {
    this._data = { ...this._data, ...data };
    this.update(this._data);
  }
}

export default new OutcomeView();
