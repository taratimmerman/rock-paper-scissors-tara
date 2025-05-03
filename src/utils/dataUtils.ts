import { Move, MoveData } from "./dataObjectUtils";

export const MOVES = [
  { name: "rock", beats: ["scissors"] },
  { name: "paper", beats: ["rock"] },
  { name: "scissors", beats: ["paper"] },
] as const;

export const MOVE_MAP: ReadonlyMap<Move, MoveData> = new Map(
  MOVES.map((move) => [move.name, move])
);
