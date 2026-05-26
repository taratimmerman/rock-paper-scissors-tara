// ArenaView.ts
import View from "../View";
import { IArenaView, ArenaViewData } from "./IArenaView";
import { PLAYER_MOVES_DATA, PARTICIPANTS } from "../../utils/dataUtils";
import { Participant } from "../../utils/dataObjectUtils";

export default class ArenaView
  extends View<ArenaViewData>
  implements IArenaView
{
  protected _parentElement = document.getElementById("arena") as HTMLElement;

  protected _generateMarkup(): string {
    const { phase, playerMoveId, computerMoveId, announcementMessage } =
      this._data;

    if (phase === "waiting") {
      return `<div class="arena-content" inert></div>`;
    }

    const isFullyRevealed = phase === "combat" || phase === "result";

    const positionClass = isFullyRevealed ? "slide-in" : "";
    const flipClass = isFullyRevealed ? "is-flipped" : "";

    const getStanceClass = (moveId: string | null | undefined): string => {
      return phase === "combat" && moveId ? `stance-${moveId}` : "";
    };

    const getCardContent = (moveId: string | null | undefined) => {
      if (!moveId) {
        return `<div class="icon">❓</div><div class="label">Waiting...</div>`;
      }

      const moveData = PLAYER_MOVES_DATA.find((m) => m.id === moveId);
      const icon = moveData ? moveData.icon : "❓";
      const label = moveData ? moveData.text : moveId;

      return `
    <div class="icon">${icon}</div>
    <div class="label">${label}</div>
  `;
    };

    const playerStanceClass = getStanceClass(playerMoveId);
    const computerStanceClass = getStanceClass(computerMoveId);

    return `
      <div class="arena-content">
        <div id="announcement-container" aria-live="polite" aria-atomic="true">
          <h2>${announcementMessage || ""}</h2>
        </div>
        
        <div id="move-reveal">
          <div id="reveal-player" class="card entering-player ${positionClass} ${playerStanceClass}" style="--facing: 1;">
            <div class="card-inner ${flipClass}">
              <div class="card-back player-theme"></div>
              <div class="card-front">
                ${getCardContent(playerMoveId)}
              </div>
            </div>
          </div>

          <div class="vs-label">VS</div>

          <div id="reveal-computer" class="card entering-computer ${positionClass} ${computerStanceClass}" style="--facing: -1;">
            <div class="card-inner ${flipClass}">
              <div class="card-back computer-theme"></div>
              <div class="card-front">
                 ${getCardContent(computerMoveId)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  public async playRoundSequence(
    data: ArenaViewData,
    onOutcomeStart?: () => void,
  ): Promise<void> {
    // 1. Render initial hidden cards
    this.render({ ...data, phase: "revealing", announcementMessage: "" });
    this._toggleVisibility(this._parentElement, true);

    const pCard = this._getElement("reveal-player");
    const cCard = this._getElement("reveal-computer");
    const moveRevealContainer = this._getElement("move-reveal");

    // 2. Entrance
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
    pCard.classList.add("slide-in");
    cCard.classList.add("slide-in");
    await this._waitForAnimation(pCard);

    // 3. Flip
    await new Promise((resolve) => setTimeout(resolve, 300));
    pCard.querySelector(".card-inner")?.classList.add("is-flipped");
    cCard.querySelector(".card-inner")?.classList.add("is-flipped");
    await this._waitForAnimation(
      pCard.querySelector(".card-inner") as HTMLElement,
    );

    // 4. Stances (stance classes now part of markup when phase === "combat")
    this.update({ ...data, phase: "combat", announcementMessage: "" });

    // Get fresh card references after DOM update
    const pCardUpdated = this._getElement("reveal-player");
    const cCardUpdated = this._getElement("reveal-computer");

    // Add arena shake for rock moves
    if (data.playerMoveId === "rock" || data.computerMoveId === "rock") {
      moveRevealContainer.classList.add("arena-shake");
    }

    // Wait for stance animations to complete
    const stancePromises: Promise<void>[] = [];
    if (data.playerMoveId)
      stancePromises.push(this._waitForAnimation(pCardUpdated));
    if (data.computerMoveId)
      stancePromises.push(this._waitForAnimation(cCardUpdated));
    if (data.playerMoveId === "rock" || data.computerMoveId === "rock") {
      stancePromises.push(this._waitForAnimation(moveRevealContainer));
    }

    if (stancePromises.length > 0) {
      await Promise.all(stancePromises);
      moveRevealContainer.classList.remove("arena-shake");
    }

    // 5. Outcome Drama
    this.update({ ...data, phase: "result" });
    // Trigger health update the moment the blow lands
    onOutcomeStart?.();
    await this.executeOutcomeDrama(data);
  }

  private async executeOutcomeDrama(data: ArenaViewData): Promise<void> {
    // Get fresh element references after DOM update
    const pCard = this._getElement("reveal-player");
    const cCard = this._getElement("reveal-computer");
    const container = this._getElement("move-reveal");

    if (data.isDoubleKO || data.winner === "tie") {
      pCard.classList.add("card-impact", "card-defeated");
      cCard.classList.add("card-impact", "card-defeated");
      container.classList.add("arena-shake");
      await this._waitForAnimation(pCard);
      return;
    }

    const winningCard = data.winner === PARTICIPANTS.PLAYER ? pCard : cCard;
    const losingCard = data.winner === PARTICIPANTS.PLAYER ? cCard : pCard;

    losingCard.classList.add("card-impact", "card-defeated");
    container.classList.add("arena-shake");

    await this._waitForAnimation(losingCard);

    winningCard.classList.add("winner-highlight");
    await this._waitForAnimation(winningCard);
  }

  public clear(): void {
    this.render({ phase: "waiting" });
  }

  public update(data: ArenaViewData): void {
    this._data = { ...this._data, ...data };
    this._parentElement.innerHTML = this._generateMarkup();

    // If we are in the result phase and have a winner, re-apply the styles
    if (data.phase === "result" && data.winner) {
      this.applyWinnerStyles(data.winner);
    }
  }

  private applyWinnerStyles(winner: Participant | "tie"): void {
    if (winner === "tie") return;

    const pCard = document.getElementById("reveal-player");
    const cCard = document.getElementById("reveal-computer");

    if (!pCard || !cCard) return;

    if (winner === "player") {
      pCard.classList.add("winner-highlight");
      cCard.classList.add("card-defeated");
    } else if (winner === "computer") {
      cCard.classList.add("winner-highlight");
      pCard.classList.add("card-defeated");
    }
  }
}
