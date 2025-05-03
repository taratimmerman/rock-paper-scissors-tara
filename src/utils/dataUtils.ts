import { MoveData } from "./dataObjectUtils";

export const MOVES: readonly MoveData[] = [
  { name: "rock", beats: ["scissors"] },
  { name: "paper", beats: ["rock"] },
  { name: "scissors", beats: ["paper"] },
];
