import { Health, StandardMove } from "../../utils/dataObjectUtils";

export interface StatsViewData {
  playerHealth: Health;
  computerHealth: Health;
  playerScore: number;
  computerScore: number;
  playerTara: number;
  computerTara: number;
  playerMostCommonMove: StandardMove | null;
  computerMostCommonMove: StandardMove | null;
  matchNumber: number;
  roundNumber: number;
}

export interface IStatsView {
  update(data: StatsViewData): void;
  updateHealth(playerHealth: number, computerHealth: number): void;
  toggleGameStatsVisibility(show: boolean): void;
}
