import { Move } from "../../utils/dataUtils";

export interface MoveRevealData {
  playerMoveId: Move;
  computerMoveId: Move;
}

export interface IMoveRevealView {
  flipCards(): Promise<void>;
  render(data: MoveRevealData): void;
  toggleVisibility(show: boolean): void;
}
