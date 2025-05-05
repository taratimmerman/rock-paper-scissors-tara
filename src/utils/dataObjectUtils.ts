import { MOVES, PARTICIPANTS } from "./dataUtils";

export type Move = (typeof MOVES)[keyof typeof MOVES];

export type MoveData = {
  name: Move;
  beats: readonly Move[];
};

export type Participant = (typeof PARTICIPANTS)[keyof typeof PARTICIPANTS];

export interface GameState {
  scores: Record<Participant, number>;
  moves: Record<Participant, Move | null>;
  taras: Record<Participant, number>;
  roundNumber: number;
}
