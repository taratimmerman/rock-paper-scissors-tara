import {
  Match,
  MoveCount,
  Participant,
  StandardMove,
} from "../utils/dataObjectUtils";

export type ThemePreference = "system" | "light" | "dark";

/**
 * Interface for game state storage.
 * Abstracts the localStorage browser API
 */
export interface IGameStorage {
  // ===== Getters =====

  getScore(participant: Participant): number;
  getTaraCount(participant: Participant): number;
  getMostCommonMove(participant: Participant): StandardMove | null;
  getMoveCounts(participant: Participant): MoveCount;
  getGlobalMatchNumber(): number | null;
  getMatch(): Match | null;
  getThemePreference(): ThemePreference | null;

  // ===== Setters =====

  setScore(participant: Participant, score: number): void;
  setTaraCount(participant: Participant, count: number): void;
  setMostCommonMove(participant: Participant, move: StandardMove | null): void;
  setMoveCounts(participant: Participant, moveCounts: MoveCount): void;
  setGlobalMatchNumber(match: number | null): void;
  setMatch(match: Match | null): void;
  setThemePreference(theme: ThemePreference): void;

  // ===== Removers =====

  removeScore(participant: Participant): void;
  removeTaraCount(participant: Participant): void;
  removeMostCommonMove(participant: Participant): void;
  removeMoveCounts(participant: Participant): void;
  removeGlobalMatchNumber(): void;
}
