// ArenaView.ts
import View from "../View";
import {
  IArenaView,
  ArenaViewData,
  ArenaAnnouncementEvent,
} from "./IArenaView";
import { PLAYER_MOVES_DATA, PARTICIPANTS } from "../../utils/dataUtils";
import { Participant, RoundResult } from "../../utils/dataObjectUtils";
import { t } from "../../utils/i18n";

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

  private spawnDamageText(targetCard: HTMLElement, damageValue: number): void {
    const rect = targetCard.getBoundingClientRect();
    const floater = document.createElement("div");

    floater.textContent = `-${damageValue}`;
    floater.classList.add("floating-damage");

    floater.style.position = "fixed";
    floater.style.left = `${rect.left + rect.width / 2}px`;
    floater.style.top = `${rect.top + rect.height / 2}px`;

    document.body.appendChild(floater);
    floater.addEventListener("animationend", () => floater.remove());
  }

  private async executeOutcomeDrama(data: ArenaViewData): Promise<void> {
    const playerCard = this._getElement("reveal-player");
    const computerCard = this._getElement("reveal-computer");
    const container = this._getElement("move-reveal");
    const damage = data.damage || 0;

    // Helper to spawn damage
    const hit = (card: HTMLElement) => {
      if (damage > 0) this.spawnDamageText(card, damage);
      card.classList.add("card-impact", "card-defeated");
    };

    if (data.isDoubleKO || data.winner === "tie") {
      // Both take damage in a tie/double KO
      hit(playerCard);
      hit(computerCard);
      container.classList.add("arena-shake");
      await this._waitForAnimation(playerCard);
      return;
    }

    // Standard Win/Loss
    const losingCard =
      data.winner === PARTICIPANTS.PLAYER ? computerCard : playerCard;
    hit(losingCard);
    container.classList.add("arena-shake");
    await this._waitForAnimation(losingCard);

    // Winner gets highlight
    const winningCard =
      data.winner === PARTICIPANTS.PLAYER ? playerCard : computerCard;
    winningCard.classList.add("winner-highlight");
    await this._waitForAnimation(winningCard);
  }

  public clear(): void {
    this.render({ phase: "waiting" });
  }

  /**
   * Interprets round outcome and emits the corresponding announcement.
   *
   * Decision logic:
   * 1. If both took mutual damage (double KO) → DOUBLE_KO event
   * 2. If there's a winner → ROUND_WIN with winner name
   * 3. If neither won → TIE event
   *
   * This demonstrates the data-driven pattern: the view receives semantic game state
   * and decides what UI event to emit, rather than the controller deciding.
   */
  public playRoundResult(roundResult: RoundResult): void {
    const event = this.determineRoundAnnouncement(roundResult);
    this.setAnnouncement(event);
  }

  /**
   * Interprets match outcome, manages the cinematic delay, and emits the announcement.
   */
  public playMatchResult(winner: Participant, isDoubleKO: boolean): void {
    // 1. Announce the match winner
    const event = this.determineMatchAnnouncement(winner, isDoubleKO);
    this.setAnnouncement(event);

    // 2. Re-enforce the winner styles (in case of a tie-breaker or double KO context)
    this.applyWinnerStyles(winner);
  }

  /**
   * Helper: Determines which round announcement event to emit based on game state.
   * @private
   */
  private determineRoundAnnouncement(
    roundResult: RoundResult,
  ): ArenaAnnouncementEvent {
    if (roundResult.isDoubleKO) {
      return { type: "DOUBLE_KO" };
    }

    if (roundResult.winner !== "tie") {
      return {
        type: "ROUND_WIN",
        payload: { winner: roundResult.winner },
      };
    }

    return { type: "TIE" };
  }

  /**
   * Helper: Determines which match announcement event to emit based on game outcome.
   * @private
   */
  private determineMatchAnnouncement(
    winner: Participant,
    isDoubleKO: boolean,
  ): ArenaAnnouncementEvent {
    return isDoubleKO
      ? { type: "MATCH_DOUBLE_KO" }
      : { type: "MATCH_WIN", payload: { winner } };
  }

  public setAnnouncement(event: ArenaAnnouncementEvent): void {
    let announcementMessage: string;

    switch (event.type) {
      case "DOUBLE_KO":
        announcementMessage = t("arena_doubleKo");
        break;
      case "ROUND_WIN":
        announcementMessage = t("arena_roundWin", {
          winner: event.payload.winner.toUpperCase(),
        });
        break;
      case "TIE":
        announcementMessage = t("arena_tie");
        break;
      case "MATCH_DOUBLE_KO":
        announcementMessage = t("arena_matchDoubleKo");
        break;
      case "MATCH_WIN":
        announcementMessage = t("arena_matchWinner", {
          winner: event.payload.winner.toUpperCase(),
        });
        break;
      case "CUSTOM":
        announcementMessage = event.message;
        break;
      default:
        const _exhaustive: never = event;
        throw new Error(`Unhandled event type: ${_exhaustive}`);
    }

    this._data = { ...this._data, announcementMessage };

    // Update only the announcement container to preserve animation classes on cards
    const announcementContainer = this._getElement("announcement-container");
    announcementContainer.innerHTML = `<h2>${announcementMessage}</h2>`;
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

    const playerCard = this._getElement("reveal-player");
    const computerCard = this._getElement("reveal-computer");

    if (winner === "player") {
      playerCard.classList.add("winner-highlight");
      computerCard.classList.add("card-defeated");
    } else if (winner === "computer") {
      computerCard.classList.add("winner-highlight");
      playerCard.classList.add("card-defeated");
    }
  }
}
