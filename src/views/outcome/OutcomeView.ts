import View from "../View";
import { IOutcomeView, OutcomeViewData } from "./IOutcomeView";

class OutcomeView extends View<OutcomeViewData> implements IOutcomeView {
  protected declare _parentElement: HTMLElement;

  // Lazy Getters for the meta-headers that live outside the main outcome box
  private get _matchEl() {
    return this._getElement<HTMLElement>("match");
  }
  private get _roundEl() {
    return this._getElement<HTMLElement>("round");
  }

  protected _generateMarkup(): string {
    const { playerMove, computerMove, resultMessage, isMatchOver } = this._data;

    return `
      <p id="round-moves">You played ${playerMove}. Computer played ${computerMove}.</p>
      <h2 id="round-result">${resultMessage}</h2>
      <button id="play-again">${
        isMatchOver ? "Start New Match" : "Next Round"
      }</button>
    `;
  }

  public render(data: OutcomeViewData): void {
    this._parentElement = this._getElement<HTMLElement>("result-display");

    // Update the headers that are outside the _parentElement
    this._matchEl.textContent = `Match ${data.matchNumber}`;
    this._roundEl.textContent = `Round ${data.roundNumber}`;
    this._toggleVisibility(this._matchEl, true);
    this._toggleVisibility(this._roundEl, true);

    super.render(data);
  }

  public bindPlayAgain(handler: () => void): void {
    // We'll use delegation on the parent container
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
