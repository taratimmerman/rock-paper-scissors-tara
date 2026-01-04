import { Move } from "../../utils/dataUtils";
import { MoveCard } from "../../utils/dataObjectUtils";

export interface ControlsViewData {
  playerMove: Move | null;
  isMatchOver: boolean;
  taraIsEnabled: boolean;
  moves: MoveCard[];
}

export interface IControlsView {
  render(data: ControlsViewData): void;
  bindPlayerMove(handler: (move: Move) => void): void;
  bindNextRound(handler: () => void): void;
  focus(): void;
  toggleVisibility(show: boolean): void;
}
