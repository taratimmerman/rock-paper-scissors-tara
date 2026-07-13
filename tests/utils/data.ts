export const defaultStats: Stats = {
  availableTaraMoves: 0,
  commonMove: null,
  health: 100,
  wins: 0,
};

export const defaultProgress: Progress = {
  match: 1,
  round: 1,
};

export const MAX_TARA_MOVES = 3;

export enum Move {
  PAPER = "paper",
  ROCK = "rock",
  SCISSORS = "scissors",
  TARA = "tara",
}

export enum Participant {
  COMPUTER = "computer",
  PLAYER = "player",
}

export interface Progress {
  match: number;
  round: number;
}

export interface Stats {
  availableTaraMoves: number;
  commonMove: Exclude<Move, Move.TARA> | null;
  health: number;
  wins: number;
}
