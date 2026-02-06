import { Move } from "../../utils/dataUtils";
import { Participant } from "../../utils/dataObjectUtils";

export interface MoveRevealData {
  playerMoveId: Move;
  computerMoveId: Move;
}

export interface IMoveRevealView {
  animateEntrance(): Promise<void>;
  applyDefeat(side: Participant): Promise<void>;
  flipCards(): Promise<void>;
  highlightWinner(participant: Participant): Promise<void>;
  playFightAnimations(playerMove: Move, computerMove: Move): Promise<void>;
  render(data: MoveRevealData): void;
  toggleVisibility(show: boolean): void;
  triggerImpact(side: Participant): Promise<void>;
}
