import { Move, MoveData } from "./dataObjectUtils";

export const MOVES = [
  { name: "rock", beats: ["scissors"] },
  { name: "paper", beats: ["rock"] },
  { name: "scissors", beats: ["paper"] },
  { name: "tara", beats: ["rock", "paper", "scissors"] },
] as const;

export const MOVE_MAP: ReadonlyMap<Move, MoveData> = new Map(
  MOVES.map((move) => [move.name, move])
);

export const STANDARD_MOVES = MOVES.filter((move) => move.name !== "tara");

export const STANDARD_MOVE_MAP: ReadonlyMap<Move, MoveData> = new Map(
  STANDARD_MOVES.map((move) => [move.name, move])
);
