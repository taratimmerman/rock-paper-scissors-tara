export interface OutcomeViewData {
  isMatchOver: boolean;
}

export interface IOutcomeView {
  render(data: OutcomeViewData): void;
  updateOutcome(data: Partial<OutcomeViewData>): void;
  toggleOutcomeVisibility(show: boolean): void;
  bindPlayAgain(handler: () => void): void;
}
