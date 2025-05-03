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
