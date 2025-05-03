export interface GameState {
  scores: {
    player: number;
    computer: number;
  };
  moves: {
    player: Move | "";
  };
}

export type Move = "rock" | "paper" | "scissors";
