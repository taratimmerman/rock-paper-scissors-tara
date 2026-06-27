/**
 * Semantic events that Status View interprets and translates to localized messages.
 * The view owns the logic for converting these events to UI text.
 */
export type StatusViewEvent =
  | { type: "READY" }
  | { type: "LOCK_IN" }
  | { type: "PREPARE" }
  | { type: "CHOOSE" }
  | { type: "CUSTOM"; message: string };

export interface StatusViewData {
  message: string;
}

/**
 * Status View displays game state messages (status bar text).
 */
export interface IStatusView {
  render(data: StatusViewData): void;
  setMessage(message: string): void;
  handleEvent(event: StatusViewEvent): void;
  /**
   * Announces the result of a round by translating move names to a localized message.
   * The view handles all text formatting and i18n concerns.
   * @param playerMove - The player's move display name (e.g., "Rock", "Paper")
   * @param computerMove - The computer's move display name
   */
  announceRound(playerMove: string, computerMove: string): void;
}
