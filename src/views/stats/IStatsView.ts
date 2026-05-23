import { Health, Move, Participant } from "../../utils/dataObjectUtils";

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
  isProgressVisible: boolean;
}

export interface IStatsView {
  render(data: StatsViewData): void;
  update(data: StatsViewData): void;
  readonly hasData: boolean;
  toggleGameStatsVisibility(show: boolean): void;
}
