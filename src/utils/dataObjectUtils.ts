import { MOVES, PARTICIPANTS } from "./dataUtils";

export type Move = (typeof MOVES)[keyof typeof MOVES];
export type StandardMove = Exclude<Move, "tara">;

export type Participant = (typeof PARTICIPANTS)[keyof typeof PARTICIPANTS];

export type MoveData = {
  name: Move;
  beats: readonly Move[];
};

export type MoveCount = Record<StandardMove, number>;

export interface Match {
  matchRoundNumber: number;
  playerHealth: number;
  computerHealth: number;
  initialHealth: number;
  damagePerLoss: number;
}

export interface GameState {
  scores: Record<Participant, number>;
  moves: Record<Participant, Move | null>;
  taras: Record<Participant, number>;
  mostCommonMove: Record<Participant, StandardMove | null>;
  moveCounts: Record<Participant, MoveCount>;
  roundNumber: number;
  globalMatchNumber: number;
  currentMatch: Match | null;
}
