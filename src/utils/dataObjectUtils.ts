import { MOVES, PARTICIPANTS } from "./dataUtils";

export type Move = (typeof MOVES)[keyof typeof MOVES];
export type StandardMove = Exclude<Move, "tara">;

export type Participant = (typeof PARTICIPANTS)[keyof typeof PARTICIPANTS];

export type Health = number | null;

export type MoveData = {
  name: Move;
  beats: readonly Move[];
};

export type MoveCount = Record<StandardMove, number>;

/**
 * Represents the pure data outcome of a single game round.
 * * @remarks
 * Returning this object from the Model keeps formatting and presentation
 * logic strictly out of the business layer.
 */
export interface RoundResult {
  /**
   * The participant who won the round, or `"tie"` if it was a draw.
   */
  winner: Participant | "tie";

  /**
   * The amount of health deducted from the losing participant(s).
   * In the event of a tie, this damage is applied to both participants.
   */
  damageCalculated: number;
}

export type VoidHandler = () => void;

export interface Match {
  matchRoundNumber: number;
  playerHealth: number;
  computerHealth: number;
}

export interface GameState {
  scores: Record<Participant, number>;
  moves: Record<Participant, Move | null>;
  taras: Record<Participant, number>;
  mostCommonMove: Record<Participant, StandardMove | null>;
  moveCounts: Record<Participant, MoveCount>;
  globalMatchNumber: number | null;
  currentMatch: Match | null;
}

export interface MoveCard {
  id: Move;
  text: string;
  icon: string;
}
