import { MOVES, PARTICIPANTS, VALID_HEALTH } from "./dataUtils";

export type Move = (typeof MOVES)[keyof typeof MOVES];
export type StandardMove = Exclude<Move, "tara">;

export type Participant = (typeof PARTICIPANTS)[keyof typeof PARTICIPANTS];

export type Health = (typeof VALID_HEALTH)[number];

export type MoveData = {
  name: Move;
  beats: readonly Move[];
};

export type MoveCount = Record<StandardMove, number>;

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
