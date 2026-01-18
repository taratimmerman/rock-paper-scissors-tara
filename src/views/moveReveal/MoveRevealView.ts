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
    const playerMove = PLAYER_MOVES_DATA.find(
      (move) => move.id === playerMoveId
    );
    const computerMove = PLAYER_MOVES_DATA.find(
      (move) => move.id === computerMoveId
    );

    if (!playerMove || !computerMove) return "";

    const renderCard = (
      move: any,
      theme: "player-theme" | "computer-theme"
    ) => `
      <div class="card" data-id="${move.id}">
        <div class="card-inner">
          <div class="card-back ${theme}"></div> <div class="card-front">
            <span class="icon">${move.icon}</span>
            <span class="label">${move.text}</span>
          </div>
        </div>
      </div>
    `;

    return `
      ${renderCard(playerMove, "player-theme")}
      <span class="vs-label">VS</span>
      ${renderCard(computerMove, "computer-theme")}
    `;
  }

  public toggleVisibility(show: boolean): void {
    this._toggleVisibility(this._parentElement, show);
  }

  public async flipCards(): Promise<void> {
    const cards = this._parentElement.querySelectorAll(".card-inner");
    if (cards.length === 0) return;

    // Force Reflow
    const _forceReflow = (cards[0] as HTMLElement).offsetHeight;

    cards.forEach((card) => card.classList.add("is-flipped"));

    await this._waitForAnimation(cards[0] as HTMLElement);
  }
}
