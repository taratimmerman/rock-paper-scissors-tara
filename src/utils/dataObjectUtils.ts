import { MOVES, PARTICIPANTS } from "./dataUtils";

export type Move = (typeof MOVES)[keyof typeof MOVES];
export type StandardMove = Exclude<Move, "tara">;

export type Participant = (typeof PARTICIPANTS)[keyof typeof PARTICIPANTS];

export type MoveData = {
  name: Move;
  beats: readonly Move[];
};

export interface GameState {
  scores: Record<Participant, number>;
  moves: Record<Participant, Move | null>;
  taras: Record<Participant, number>;
  history: Record<Participant, StandardMove[]>;
  mostCommonMove: Record<Participant, StandardMove | null>;
  roundNumber: number;
}
