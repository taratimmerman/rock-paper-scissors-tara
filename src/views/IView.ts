import { Move, Participant, VoidHandler } from "../utils/dataObjectUtils";

export interface IView {
  bindPlayAgain(handler: VoidHandler): void;
  updateMessage(msg: string): void;
  updatePlayAgainButton(isMatchOver: boolean): void;
  toggleOutcome(show: boolean): void;
}
