import { Health, Move } from "../../utils/dataObjectUtils";

export interface StatsViewData {
  playerHealth: Health;
  computerHealth: Health;
  playerScore: number;
  computerScore: number;
  playerTara: number;
  computerTara: number;
  playerMostCommonMove: Move | null;
  computerMostCommonMove: Move | null;
  matchNumber: number;
  roundNumber: number;
}

export interface IStatsView {
  update(data: StatsViewData): void;
  updateHealth(playerHealth: number, computerHealth: number): void;
  toggleGameStatsVisibility(show: boolean): void;
}
