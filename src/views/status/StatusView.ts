import View from "../View";
import { IStatusView, StatusViewData, StatusViewEvent } from "./IStatusView";
import { t, TranslationKey } from "../../utils/i18n";

const STATUS_EVENT_TRANSLATION_KEYS = {
  READY: "status_ready",
  LOCK_IN: "status_lockIn",
  PREPARE: "status_prepare",
  CHOOSE: "status_choose",
  ROUND_LIMIT_REACHED: "status_roundLimitReached",
  MATCH_LIMIT_REACHED: "status_matchLimitReached",
} satisfies Record<
  Exclude<StatusViewEvent, { type: "CUSTOM" }>["type"],
  TranslationKey
>;

/**
 * Status View displays game state messages to the player.
 *
 * ## Responsibility
 *
 * StatusView owns the mapping between semantic events/data and localized UI text.
 * This keeps text concerns (i18n, formatting) isolated from game logic.
 *
 * ## Examples
 *
 * - `handleEvent({ type: "READY" })` → translates to "Get ready..."
 * - `announceRound("Rock", "Paper")` → translates to "You played Rock. Computer played Paper."
 */
export default class StatusView
  extends View<StatusViewData>
  implements IStatusView
{
  declare protected _parentElement: HTMLElement;
  private _messageElement: HTMLElement | null = null;

  public render(data: StatusViewData): void {
    this._parentElement = this._getElement<HTMLElement>("status-container");
    super.render(data);
    // Cache the element right after rendering
    this._messageElement = this._parentElement.querySelector("#status");
  }

  protected _generateMarkup(): string {
    return `<p id="status">${this._data.message}</p>`;
  }

  public setMessage(message: string): void {
    this._data = { message };
    if (this._messageElement) {
      this._messageElement.textContent = message;
    } else {
      // Fallback in case setMessage is called before render
      const el = document.getElementById("status");
      if (el) el.textContent = message;
    }
  }

  /**
   * Handles semantic events by translating them to localized messages.
   *
   * The Controller sends events, the View decides what text to display.
   */
  public handleEvent(event: StatusViewEvent): void {
    const message = this.translateEvent(event);
    this.setMessage(message);
  }

  /**
   * Announces a round result by translating move names to a localized message.
   * Demonstrates data-driven pattern: Controller passes data, View handles translation.
   */
  public announceRound(playerMove: string, computerMove: string): void {
    const message = t("status_roundResult", {
      playerMove,
      computerMove,
    });
    this.setMessage(message);
  }

  /**
   * Helper: Translates a semantic event to its localized message.
   * Extracted for clarity and testability.
   * @private
   */
  private translateEvent(event: StatusViewEvent): string {
    if (event.type === "CUSTOM") {
      return event.message;
    }

    const translationKey = STATUS_EVENT_TRANSLATION_KEYS[event.type];
    if (!translationKey) {
      throw new Error(`Unhandled event type: ${event.type}`);
    }

    return t(translationKey);
  }
}
