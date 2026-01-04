import View from "../View";
import { IMoveRevealView, MoveRevealData } from "./IMoveRevealView";
import { PLAYER_MOVES_DATA } from "../../utils/dataUtils";

export default class MoveRevealView
  extends View<MoveRevealData>
  implements IMoveRevealView
{
  protected _parentElement = document.getElementById(
    "move-reveal"
  ) as HTMLElement;

  protected _generateMarkup(): string {
    const { playerMoveId, computerMoveId } = this._data;

    const pMove = PLAYER_MOVES_DATA.find((m) => m.id === playerMoveId);
    const cMove = PLAYER_MOVES_DATA.find((m) => m.id === computerMoveId);

    if (!pMove || !cMove) return "";

    return `
    <div class="card-container" disabled>
      <span class="icon">${pMove.icon}</span>
      <span class="label">${pMove.text}</span>
    </div>

    <span class="vs-label">VS</span>

    <div class="card-container" disabled>
      <span class="icon">${cMove.icon}</span>
      <span class="label">${cMove.text}</span>
    </div>
  `;
  }

  public toggleVisibility(show: boolean): void {
    this._toggleVisibility(this._parentElement, show);
  }
}
