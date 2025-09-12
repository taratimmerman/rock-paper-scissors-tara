import { Match, Move, MoveData, StandardMove } from "./dataObjectUtils";

export const DEFAULT_DELAY = 500;

export const PARTICIPANTS = {
  PLAYER: "player",
  COMPUTER: "computer",
} as const;

export const VALID_HEALTH = [0, 50, 100, null] as const;
export const INITIAL_ROUND_NUMBER = 1;
export const INITIAL_HEALTH = 100;
export const DAMAGE_PER_LOSS = 50;
export const DEFAULT_MATCH_NUMBER = 1;

export const DEFAULT_MATCH: Match = {
  matchRoundNumber: INITIAL_ROUND_NUMBER,
  playerHealth: INITIAL_HEALTH,
  computerHealth: INITIAL_HEALTH,
};

export const HEALTH_KEYS = {
  player: "playerHealth",
  computer: "computerHealth",
} as const;

export const MOVES = {
  ROCK: "rock",
  PAPER: "paper",
  SCISSORS: "scissors",
  TARA: "tara",
} as const;

export const MOVE_DATA = [
  { name: MOVES.ROCK, beats: [MOVES.SCISSORS] },
  { name: MOVES.PAPER, beats: [MOVES.ROCK] },
  { name: MOVES.SCISSORS, beats: [MOVES.PAPER] },
  {
    name: MOVES.TARA,
    beats: [MOVES.ROCK, MOVES.PAPER, MOVES.SCISSORS],
  },
] as const;

export const ALL_MOVE_NAMES: Move[] = MOVE_DATA.map((data) => data.name);

export const MOVE_DATA_MAP: ReadonlyMap<Move, MoveData> = new Map(
  MOVE_DATA.map((move) => [move.name, move])
);

export const STANDARD_MOVE_DATA = MOVE_DATA.filter(
  (move) => move.name !== MOVES.TARA
);
export const STANDARD_MOVE_NAMES: StandardMove[] = STANDARD_MOVE_DATA.map(
  (data) => data.name
);

export const STANDARD_MOVE_DATA_MAP: ReadonlyMap<StandardMove, MoveData> =
  new Map(STANDARD_MOVE_DATA.map((move) => [move.name, move]));
