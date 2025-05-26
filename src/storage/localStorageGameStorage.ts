import { IGameStorage } from "./gameStorage";
import {
  Match,
  MoveCount,
  Participant,
  StandardMove,
} from "../utils/dataObjectUtils";
import {
  DAMAGE_PER_LOSS,
  INITIAL_HEALTH,
  MOVES,
  STANDARD_MOVE_NAMES,
} from "../utils/dataUtils";

const KEY_SUFFIX_SCORE = "Score";
const KEY_SUFFIX_TARA_COUNT = "TaraCount";
const KEY_SUFFIX_MOST_COMMON_MOVE = "MostCommonMove";
const KEY_SUFFIX_MOVE_COUNTS = "MoveCounts";
const KEY_SUFFIX_HISTORY = "History";

const KEY_ROUND_NUMBER = "roundNumber";
const KEY_GLOBAL_MATCH_NUMBER = "globalMatchNumber";
const KEY_CURRENT_MATCH = "currentMatch";

const DEFAULT_NUMERIC_VALUE = 0;
const DEFAULT_ROUND_NUMBER_GET = 1;
const DEFAULT_MATCH_NUMBER_GET = 1;

const DEFAULT_MOVE_COUNTS: MoveCount = {
  [MOVES.ROCK]: 0,
  [MOVES.PAPER]: 0,
  [MOVES.SCISSORS]: 0,
};

const DEFAULT_MATCH: Match = {
  matchRoundNumber: DEFAULT_ROUND_NUMBER_GET,
  playerHealth: INITIAL_HEALTH,
  computerHealth: INITIAL_HEALTH,
  initialHealth: INITIAL_HEALTH,
  damagePerLoss: DAMAGE_PER_LOSS,
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

  getRoundNumber(): number {
    return parseInt(
      localStorage.getItem(KEY_ROUND_NUMBER) ||
        DEFAULT_ROUND_NUMBER_GET.toString(),
      10
    );
  }

  getGlobalMatchNumber(): number {
    return parseInt(
      localStorage.getItem(KEY_ROUND_NUMBER) ||
        DEFAULT_MATCH_NUMBER_GET.toString(),
      10
    );
  }

  getMatch(): Match | null {
    try {
      const raw = localStorage.getItem(KEY_CURRENT_MATCH);
      return raw ? JSON.parse(raw) : DEFAULT_MATCH;
    } catch (e) {
      console.warn(`LocalStorage Error: Failed to parse currentMatch.`, e);
      return DEFAULT_MATCH;
    }
  }

  getOldGlobalRoundNumber(): number | null {
    return null; // stub: return null to simulate absence of legacy data
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

  setRoundNumber(round: number): void {
    const key = KEY_ROUND_NUMBER;
    this.safelySetItem(key, round.toString());
  }

  setGlobalMatchNumber(matchNumber: number): void {
    this.safelySetItem(KEY_GLOBAL_MATCH_NUMBER, matchNumber.toString());
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

  removeRoundNumber(): void {
    localStorage.removeItem(KEY_ROUND_NUMBER);
  }

  removeHistory(participant: Participant): void {
    const key = this.formatKey(participant, KEY_SUFFIX_HISTORY);
    localStorage.removeItem(key);
  }

  removeGlobalMatchNumber(): void {
    localStorage.removeItem(KEY_GLOBAL_MATCH_NUMBER);
  }

  removeOldGlobalRoundNumber(): void {
    // stub: do nothing for now
  }
}
