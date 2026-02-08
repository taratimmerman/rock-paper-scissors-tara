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
  bindStartNewMatch(handler: () => void): void;
  flipAll(faceUp: boolean): Promise<void>;
  toggleVisibility(show: boolean): void;
}
