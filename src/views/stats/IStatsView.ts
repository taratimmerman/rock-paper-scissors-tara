import { Health, Move, Participant } from "../../utils/dataObjectUtils";

export interface IStatsView {
  toggleGameStatsVisibility(show: boolean): void;
  updateHealthBar(participant: Participant, health: Health): void;
  updateMostCommonMoves(
    playerMove: Move | null,
    computerMove: Move | null
  ): void;
  updateScores(playerScore: number, computerScore: number): void;
  updateTaraCounts(playerTara: number, computerTara: number): void;
}
