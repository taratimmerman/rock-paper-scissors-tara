import { Move, Participant, VoidHandler } from "../utils/dataObjectUtils";

export interface IView {
  bindStartGame(handler: VoidHandler): void;
  bindPlayAgain(handler: VoidHandler): void;
  bindResetGame(handler: VoidHandler): void;
  updateMessage(msg: string): void;
  updateRound(roundNumber: number): void;
  updateMatch(matchNumber: number): void;
  updatePlayAgainButton(isMatchOver: boolean): void;
  toggleControls(enabled: boolean): void;
  toggleOutcome(show: boolean): void;
  updateStartButton(isMatchActive: boolean): void;
}
