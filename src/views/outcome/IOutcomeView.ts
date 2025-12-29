import { Move } from "../../utils/dataObjectUtils";

export interface OutcomeViewData {
  playerMove: Move | null;
  computerMove: Move | null;
  resultMessage: string;
  isMatchOver: boolean;
  roundNumber: number;
  matchNumber: number;
}

export interface IOutcomeView {
  render(data: OutcomeViewData): void;
  updateOutcome(data: Partial<OutcomeViewData>): void;
  toggleOutcomeVisibility(show: boolean): void;
  bindPlayAgain(handler: () => void): void;
}
