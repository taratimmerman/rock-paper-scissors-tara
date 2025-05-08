import { Move, MoveData, StandardMove } from "./dataObjectUtils";

export const PARTICIPANTS = {
  PLAYER: "player",
  COMPUTER: "computer",
} as const;

export const MOVES = {
  ROCK: "rock",
  PAPER: "paper",
  SCISSORS: "scissors",
  TARA: "tara",
} as const;

const MOVE_DATA = [
  { name: MOVES.ROCK, beats: [MOVES.SCISSORS] },
  { name: MOVES.PAPER, beats: [MOVES.ROCK] },
  { name: MOVES.SCISSORS, beats: [MOVES.PAPER] },
  {
    name: MOVES.TARA,
    beats: [MOVES.ROCK, MOVES.PAPER, MOVES.SCISSORS],
  },
] as const;

export const MOVE_DATA_MAP: ReadonlyMap<Move, MoveData> = new Map(
  MOVE_DATA.map((move) => [move.name, move])
);

const STANDARD_MOVE_DATA = MOVE_DATA.filter((move) => move.name !== MOVES.TARA);

export const STANDARD_MOVE_DATA_MAP: ReadonlyMap<StandardMove, MoveData> =
  new Map(STANDARD_MOVE_DATA.map((move) => [move.name, move]));
