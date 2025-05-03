export interface GameState {
  scores: {
    player: number;
    computer: number;
  };
  moves: {
    player: Move | "";
    computer: Move | "";
  };
}

export type Move = "rock" | "paper" | "scissors";

export type MoveData = {
  name: Move;
  beats: Move[];
};
