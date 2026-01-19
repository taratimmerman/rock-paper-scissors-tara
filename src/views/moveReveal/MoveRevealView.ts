import View from "../View";
import { IMoveRevealView, MoveRevealData } from "./IMoveRevealView";
import { PLAYER_MOVES_DATA, PARTICIPANTS } from "../../utils/dataUtils";
import { Move, Participant } from "../../utils/dataObjectUtils";

export default class MoveRevealView
  extends View<MoveRevealData>
  implements IMoveRevealView
{
  protected _parentElement = document.getElementById(
    "move-reveal",
  ) as HTMLElement;

  protected _generateMarkup(): string {
    const { playerMoveId, computerMoveId } = this._data;
    const pMove = PLAYER_MOVES_DATA.find((m) => m.id === playerMoveId);
    const cMove = PLAYER_MOVES_DATA.find((m) => m.id === computerMoveId);

    if (!pMove || !cMove) return "";

    return `
      <div class="card entering-player" id="reveal-player">
        <div class="card-inner">
          <div class="card-back player-theme"></div>
          <div class="card-front">
            <span class="icon">${pMove.icon}</span>
            <span class="label">${pMove.text}</span>
          </div>
        </div>
      </div>
      <span class="vs-label">VS</span>
      <div class="card entering-computer" id="reveal-computer">
        <div class="card-inner">
          <div class="card-back computer-theme"></div>
          <div class="card-front">
            <span class="icon">${cMove.icon}</span>
            <span class="label">${cMove.text}</span>
          </div>
        </div>
      </div>
    `;
  }

  public async animateEntrance(): Promise<void> {
    const pCard = this._getElement("reveal-player");
    const cCard = this._getElement("reveal-computer");

    pCard.classList.remove("slide-in");
    cCard.classList.remove("slide-in");

    // 2. Double-frame wait to ensure the browser has painted
    // the 'off-screen' position before triggering the slide
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );

    pCard.classList.add("slide-in");
    cCard.classList.add("slide-in");

    await this._waitForAnimation(pCard);
  }

  public toggleVisibility(show: boolean): void {
    if (!show) {
      this._parentElement.querySelectorAll(".card").forEach((el) => {
        const card = el as HTMLElement;
        // Simply removing classes now handles the reset because we removed !important
        card.className = "card";
        card.style.cssText = ""; // Final safety wipe
      });
    }
    this._toggleVisibility(this._parentElement, show);
  }

  public async flipCards(): Promise<void> {
    const cards = this._parentElement.querySelectorAll(".card-inner");
    if (cards.length === 0) return;

    await new Promise((resolve) => setTimeout(resolve, 300));

    cards.forEach((card) => {
      (card as HTMLElement).classList.add("is-flipped");
    });

    // Wait for the rotation animation to finish
    await this._waitForAnimation(cards[0] as HTMLElement);
  }

  public async highlightWinner(participant: Participant): Promise<void> {
    const selector =
      participant === PARTICIPANTS.PLAYER ? ".player-theme" : ".computer-theme";
    const winningCard = this._parentElement
      .querySelector(selector)
      ?.closest(".card") as HTMLElement;

    if (winningCard) {
      winningCard.classList.add("winner-highlight");
      await this._waitForAnimation(winningCard);
    }
  }

  public async playFightAnimations(
    playerMove: Move,
    computerMove: Move,
  ): Promise<void> {
    const pCard = this._getElement("reveal-player");
    const cCard = this._getElement("reveal-computer");

    pCard.classList.add(`stance-${playerMove}`);
    cCard.classList.add(`stance-${computerMove}`);

    if (playerMove === "rock" || computerMove === "rock") {
      this._parentElement.classList.add("arena-shake");
      // Wait for the shake to finish naturally
      await this._waitForAnimation(this._parentElement);
      this._parentElement.classList.remove("arena-shake");
    }

    // Wait for the cards to reach their "Stance" positions
    // For infinite animations (paper/tara), _waitForAnimation will resolve
    // after the first cycle or the safety timeout.
    await Promise.all([
      this._waitForAnimation(pCard),
      this._waitForAnimation(cCard),
    ]);
  }
}
