import { Move } from "../../utils/dataUtils";
import { Participant } from "../../utils/dataObjectUtils";

export interface MoveRevealData {
  playerMoveId: Move;
  computerMoveId: Move;
}

export interface IMoveRevealView {
  animateEntrance(): Promise<void>;
  flipCards(): Promise<void>;
  highlightWinner(participant: Participant): Promise<void>;
  playFightAnimations(playerMove: Move, computerMove: Move): Promise<void>;
  render(data: MoveRevealData): void;
  toggleVisibility(show: boolean): void;
  triggerDefeat(side: Participant | "both"): Promise<void>;
  triggerImpact(side: Participant | "both"): Promise<void>;
}
