import { Move, Participant, RoundResult } from "../../utils/dataObjectUtils";

export type ArenaPhase = "waiting" | "revealing" | "combat" | "result";

/**
 * Semantic announcement events interpreted and emitted by the Arena View.
 *
 * The Arena View owns the decision logic for converting game state (RoundResult, match outcome)
 * into these semantic events. This keeps the Controller focused on orchestration rather than
 * UI interpretation logic.
 */
export type ArenaAnnouncementEvent =
  | { type: "DOUBLE_KO" }
  | { type: "PLAYER_WIN"; payload: { winner: Participant } }
  | { type: "TIE" }
  | { type: "MATCH_DOUBLE_KO" }
  | { type: "MATCH_WINNER"; payload: { winner: Participant } }
  | { type: "CUSTOM"; message: string };

export interface ArenaViewData {
  phase: ArenaPhase;
  playerMoveId?: Move | null;
  computerMoveId?: Move | null;
  winner?: Participant | "tie" | null;
  isDoubleKO?: boolean;
  announcementMessage?: string;
}

/**
 * Arena View handles both the visual combat sequence and semantic interpretation of game results.
 */
export interface IArenaView {
  render(data: ArenaViewData): void;
  update(data: ArenaViewData): void;
  /**
   * Plays the full round animation sequence (card entrance, flip, stance, outcome).
   * The view does NOT handle announcements here—use `playRoundResult()` after this completes.
   */
  playRoundSequence(
    data: ArenaViewData,
    onOutcomeStart?: () => void,
  ): Promise<void>;
  clear(): void;
  setAnnouncement(event: ArenaAnnouncementEvent): void;
  /**
   * Interprets round outcome and announces it.
   * The view decides: is this a double KO, a win, or a tie?
   * @param roundResult - Game state containing winner and isDoubleKO
   */
  playRoundResult(roundResult: RoundResult): void;
  /**
/**
   * Interprets match outcome, announces it, and manages the visual timing.
   * Returns a Promise so the Controller can delay final stat/control updates.
   * @param winner - The match winner (player or computer)
   * @param isDoubleKO - Whether both participants were double KO'd
   */
  playMatchResult(winner: Participant, isDoubleKO: boolean): void;
}
