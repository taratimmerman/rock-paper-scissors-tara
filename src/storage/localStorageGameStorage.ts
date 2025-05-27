import { IGameStorage } from "./gameStorage";
import {
  Match,
  MoveCount,
  Participant,
  StandardMove,
} from "../utils/dataObjectUtils";
import { MOVES, STANDARD_MOVE_NAMES } from "../utils/dataUtils";

const KEY_SUFFIX_SCORE = "Score";
const KEY_SUFFIX_TARA_COUNT = "TaraCount";
const KEY_SUFFIX_MOST_COMMON_MOVE = "MostCommonMove";
const KEY_SUFFIX_MOVE_COUNTS = "MoveCounts";
const KEY_SUFFIX_HISTORY = "History";

const KEY_ROUND_NUMBER = "roundNumber";
const KEY_GLOBAL_MATCH_NUMBER = "globalMatchNumber";
const KEY_CURRENT_MATCH = "currentMatch";

const DEFAULT_NUMERIC_VALUE = 0;

const DEFAULT_MOVE_COUNTS: MoveCount = {
  [MOVES.ROCK]: 0,
  [MOVES.PAPER]: 0,
  [MOVES.SCISSORS]: 0,
};

/**
 * Implementation of IGameStorage using browser's localStorage.
 */
export class LocalStorageGameStorage implements IGameStorage {
  private formatKey(participant: Participant, suffix: string): string {
    return `${participant}${suffix}`;
  }

  private safelySetItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`LocalStorage Error: Failed to save "${key}".`, e);
    }
  }

  // ===== Getters =====

  getScore(participant: Participant): number {
    const key = this.formatKey(participant, KEY_SUFFIX_SCORE);
    return parseInt(
      localStorage.getItem(key) || DEFAULT_NUMERIC_VALUE.toString(),
      10
    );
  }

  getTaraCount(participant: Participant): number {
    const key = this.formatKey(participant, KEY_SUFFIX_TARA_COUNT);
    return parseInt(
      localStorage.getItem(key) || DEFAULT_NUMERIC_VALUE.toString(),
      10
    );
  }

  getMostCommonMove(participant: Participant): StandardMove | null {
    const key = this.formatKey(participant, KEY_SUFFIX_MOST_COMMON_MOVE);
    const move = localStorage.getItem(key);
    return move && STANDARD_MOVE_NAMES.includes(move as StandardMove)
      ? (move as StandardMove)
      : null;
  }

  getMoveCounts(participant: Participant): MoveCount {
    const key = this.formatKey(participant, KEY_SUFFIX_MOVE_COUNTS);
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : DEFAULT_MOVE_COUNTS;
    } catch (e) {
      console.warn(`LocalStorage Error: Failed to parse "${key}".`, e);
      return DEFAULT_MOVE_COUNTS;
    }
  }

  getGlobalMatchNumber(): number | null {
    const stored = localStorage.getItem(KEY_GLOBAL_MATCH_NUMBER);
    return stored !== null ? parseInt(stored, 10) : null;
  }

  getMatch(): Match | null {
    try {
      const raw = localStorage.getItem(KEY_CURRENT_MATCH);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn(`LocalStorage Error: Failed to parse currentMatch.`, e);
      return null;
    }
  }

  getOldGlobalRoundNumber(): number | null {
    const roundString = localStorage.getItem(KEY_ROUND_NUMBER);

    // If the item doesn't exist in localStorage, getItem returns null.
    if (roundString === null) {
      return null;
    }

    // Attempt to parse the string to an integer.
    const parsedRound = parseInt(roundString, 10);

    // Check if parsing resulted in NaN (Not a Number), meaning the stored value was invalid.
    if (isNaN(parsedRound)) {
      console.warn(
        `Legacy 'roundNumber' in localStorage (${roundString}) is not a valid number. Skipping migration.`
      );
      return null; // Treat invalid data as if it doesn't exist for migration purposes
    }

    return parsedRound;
  }

  // ===== Setters =====

  setScore(participant: Participant, score: number): void {
    const key = this.formatKey(participant, KEY_SUFFIX_SCORE);
    this.safelySetItem(key, score.toString());
  }

  setTaraCount(participant: Participant, count: number): void {
    const key = this.formatKey(participant, KEY_SUFFIX_TARA_COUNT);
    this.safelySetItem(key, count.toString());
  }

  setMostCommonMove(participant: Participant, move: StandardMove | null): void {
    const key = this.formatKey(participant, KEY_SUFFIX_MOST_COMMON_MOVE);
    if (move) {
      this.safelySetItem(key, move);
    } else {
      localStorage.removeItem(key);
    }
  }

  setMoveCounts(participant: Participant, moveCounts: MoveCount): void {
    const key = this.formatKey(participant, KEY_SUFFIX_MOVE_COUNTS);
    this.safelySetItem(key, JSON.stringify(moveCounts));
  }

  setGlobalMatchNumber(matchNumber: number | null): void {
    if (matchNumber) {
      this.safelySetItem(KEY_GLOBAL_MATCH_NUMBER, matchNumber.toString());
    } else {
      localStorage.removeItem(KEY_GLOBAL_MATCH_NUMBER);
    }
  }

  setMatch(match: Match | null): void {
    if (match) {
      this.safelySetItem(KEY_CURRENT_MATCH, JSON.stringify(match));
    } else {
      localStorage.removeItem(KEY_CURRENT_MATCH);
    }
  }

  // ===== Removers =====

  removeScore(participant: Participant): void {
    const key = this.formatKey(participant, KEY_SUFFIX_SCORE);
    localStorage.removeItem(key);
  }

  removeTaraCount(participant: Participant): void {
    const key = this.formatKey(participant, KEY_SUFFIX_TARA_COUNT);
    localStorage.removeItem(key);
  }

  removeMostCommonMove(participant: Participant): void {
    const key = this.formatKey(participant, KEY_SUFFIX_MOST_COMMON_MOVE);
    localStorage.removeItem(key);
  }

  removeMoveCounts(participant: Participant): void {
    const key = this.formatKey(participant, KEY_SUFFIX_MOVE_COUNTS);
    localStorage.removeItem(key);
  }

  removeHistory(participant: Participant): void {
    const key = this.formatKey(participant, KEY_SUFFIX_HISTORY);
    localStorage.removeItem(key);
  }

  removeGlobalMatchNumber(): void {
    localStorage.removeItem(KEY_GLOBAL_MATCH_NUMBER);
  }

  removeOldGlobalRoundNumber(): void {
    localStorage.removeItem(KEY_ROUND_NUMBER);
  }
}
