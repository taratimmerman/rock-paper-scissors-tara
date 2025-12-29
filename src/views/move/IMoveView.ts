import { Move, MoveCard } from "../../utils/dataObjectUtils";

/**
 * The specific shape of data required to render the MoveView.
 */
export interface MoveViewData {
  moves: readonly MoveCard[];
  taraIsEnabled: boolean;
}

export interface IMoveView {
  /**
   * Renders the initial set of move buttons.
   * @param data - Contains the moves list and the initial Tara status.
   */
  render(data: MoveViewData): void;

  /**
   * Surgically updates the Tara button state using DOM diffing.
   * @param isEnabled - Whether the special move is available.
   */
  updateTaraButton(isEnabled: boolean): void;

  /**
   * Shows or hides the entire moves container.
   */
  toggleMoveButtons(show: boolean): void;

  /**
   * Provides a callback for when a player selects a move.
   */
  bindPlayerMove(handler: (move: Move) => void): void;
}
