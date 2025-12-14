// =============================================================================
// 🧱 CONFIGURATION FILE: GAME CONSTANTS
//
// This module defines all core game data (moves, health, etc.).
// All move-related constants (lists, maps, types) are generated dynamically
// from the MOVES_DATABASE to ensure data consistency.
// =============================================================================

import { Match, MoveData } from "./dataObjectUtils";

// -----------------------------------------------------------------------------
// SECTION 1: SINGLE SOURCE OF TRUTH (MOVES_DATABASE)
//
// This is the only place where a move's definition should be edited.
// 'as const' ensures TypeScript treats values strictly (e.g., "rock" vs. string).
// -----------------------------------------------------------------------------
const MOVES_DATABASE = {
  ROCK: {
    id: "rock",
    beats: ["scissors"],
    isStandard: true, // Flag used to filter standard vs. special moves
    text: "Rock",
    icon: "🪨",
  },
  PAPER: {
    id: "paper",
    beats: ["rock"],
    isStandard: true,
    text: "Paper",
    icon: "📄",
  },
  SCISSORS: {
    id: "scissors",
    beats: ["paper"],
    isStandard: true,
    text: "Scissors",
    icon: "✂️",
  },
  TARA: {
    id: "tara",
    beats: ["rock", "paper", "scissors"],
    isStandard: false,
    text: "Tara",
    icon: "⭐",
  },
} as const;

type DbType = typeof MOVES_DATABASE;

// -----------------------------------------------------------------------------
// SECTION 2: DYNAMIC TYPES (Derived from the Database)
//
// These types prevent manual errors. They update automatically when MOVES_DATABASE
// changes.
// -----------------------------------------------------------------------------

/**
 * Type: Move
 * A union type of all move IDs defined in the database.
 * Result: "rock" | "paper" | "scissors" | "tara"
 */
export type Move = DbType[keyof DbType]["id"];

/**
 * Type: StandardMove
 * A union type that only includes move IDs where 'isStandard: true'.
 *
 * This uses advanced TypeScript logic (Conditional Types) to automatically filter
 * the database entries.
 * Result: "rock" | "paper" | "scissors"
 */
export type StandardMove = {
  [K in keyof DbType]: DbType[K]["isStandard"] extends true
    ? DbType[K]["id"] // Include the ID if the flag is true
    : never; // Use 'never' to exclude the ID from the final type
}[keyof DbType];

// -----------------------------------------------------------------------------
// SECTION 3: DYNAMIC CONSTANTS (Runtime Data Structures)
//
// Generated at runtime by mapping over the MOVES_DATABASE.
// -----------------------------------------------------------------------------

// Helper for iteration
const DB_VALUES = Object.values(MOVES_DATABASE);

/**
 * MOVES: Object mapping internal keys to move IDs.
 * { ROCK: "rock", PAPER: "paper", ... }
 */
export const MOVES = Object.fromEntries(
  Object.entries(MOVES_DATABASE).map(([key, val]) => [key, val.id])
) as { [K in keyof DbType]: DbType[K]["id"] };

/**
 * MOVE_DATA: Array of objects used by the core game logic (name/beats).
 */
export const MOVE_DATA = DB_VALUES.map((entry) => ({
  name: entry.id as Move,
  beats: entry.beats as readonly Move[],
}));

// All Move Lists and Maps
export const ALL_MOVE_NAMES: Move[] = DB_VALUES.map((entry) => entry.id);

export const MOVE_DATA_MAP: ReadonlyMap<Move, MoveData> = new Map(
  MOVE_DATA.map((m) => [m.name, m])
);

// Standard Move Lists and Maps (Filtered based on 'isStandard' flag)
export const STANDARD_MOVE_DATA = MOVE_DATA.filter(
  (_, i) => DB_VALUES[i].isStandard
);

export const STANDARD_MOVE_NAMES = STANDARD_MOVE_DATA.map(
  (data) => data.name
) as StandardMove[];

export const STANDARD_MOVE_DATA_MAP: ReadonlyMap<StandardMove, MoveData> =
  new Map(STANDARD_MOVE_DATA.map((m) => [m.name as StandardMove, m]));

/**
 * PLAYER_MOVES_DATA: Array used by the View to render cards dynamically.
 * It maps the database structure to the specific data needed by the UI.
 */
export const PLAYER_MOVES_DATA = DB_VALUES.map((entry) => ({
  id: entry.id as Move,
  text: entry.text,
  icon: entry.icon,
}));

// -----------------------------------------------------------------------------
// SECTION 4: BASIC GAME CONSTANTS
// -----------------------------------------------------------------------------

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
