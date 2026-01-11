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

    const renderCard = (move: any) => `
    <div class="card" data-id="${move.id}">
      <div class="card-inner">
        <div class="card-back">BACK</div>
        <div class="card-front">
          <span class="icon">${move.icon}</span>
          <span class="label">${move.text}</span>
        </div>
      </div>
    </div>
  `;

    return `
    ${renderCard(playerMove)}
    <span class="vs-label">VS</span>
    ${renderCard(computerMove)}
  `;
  }

  public toggleVisibility(show: boolean): void {
    this._toggleVisibility(this._parentElement, show);
  }

  public async flipCards(): Promise<void> {
    const cards =
      this._parentElement.querySelectorAll<HTMLElement>(".card-inner");

    cards.forEach((card) => card.classList.add("is-flipped"));

    // Wait for the first card's animation to finish before resolving
    if (cards.length > 0) {
      await this._waitForAnimation(cards[0]);
    }
  }
}
