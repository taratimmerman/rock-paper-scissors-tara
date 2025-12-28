import { Health, Move, Participant } from "../../utils/dataObjectUtils";

export interface IStatsView {
  toggleGameStatsVisibility(show: boolean): void;
  updateHealth(playerHealth: Health, computerHealth: Health): void;
  updateHealthBar(participant: Participant, health: Health): void;
  updateMostCommonMoves(
    playerMove: Move | null,
    computerMove: Move | null
  ): void;
  updateTaraCounts(playerTara: number, computerTara: number): void;
}
