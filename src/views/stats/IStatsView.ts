import { Health, Participant } from "../../utils/dataObjectUtils";

export interface IStatsView {
  toggleGameStatsVisibility(show: boolean): void;
  updateHealth(playerHealth: Health, computerHealth: Health): void;
  updateHealthBar(participant: Participant, health: Health): void;
}
