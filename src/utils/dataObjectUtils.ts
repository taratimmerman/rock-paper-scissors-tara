import { MOVES } from "./dataUtils";

export type Move = (typeof MOVES)[number]["name"];

export type MoveData = {
  name: Move;
  beats: readonly Move[];
};

export interface GameState {
  scores: {
    player: number;
    computer: number;
  };
  moves: {
    player: Move | null;
    computer: Move | null;
  };
  taras: {
    player: number;
    computer: number;
  };
  roundNumber: number;
}
