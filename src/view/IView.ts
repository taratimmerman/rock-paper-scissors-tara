import { Move, Participant } from "../utils/dataObjectUtils";

export interface IView {
  activateSpinner(shouldActivate: boolean): void;
  updateMessage(msg: string): void;
  updateScores(playerScore: number, computerScore: number): void;
  updateRound(roundNumber: number): void;
  updateMatch(matchNumber: number): void;
  showRoundOutcome(playerMove: Move, computerMove: Move, result: string): void;
  showMatchOutcome(
    playerMove: Move,
    computerMove: Move,
    winner: Participant
  ): void;
  toggleMoveButtons(enabled: boolean): void;
  togglePlayAgain(enabled: boolean): void;
  updateTaraCounts(playerTara: number, computerTara: number): void;
  updateTaraButton(isEnabled: boolean, taraCount: number): void;
  updateMostCommonMoves(
    playerMove: Move | null,
    computerMove: Move | null
  ): void;
  updatePlayAgainButton(isMatchOver: boolean): void;
  resetForNextRound(): void;
  updateScoreView(): void;
  updateTaraView(): void;
  updateTaraButtonView(): void;
  toggleControls(enabled: boolean): void;
  toggleGameStats(enabled: boolean): void;
  updateHealth(playerHealth: number, computerHealth: number): void;
  updateHealthBar(participant: Participant, health: number): void;
  updateStartButton(isMatchActive: boolean): void;
}
