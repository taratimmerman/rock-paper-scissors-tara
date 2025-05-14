import { Participant, MoveCount, StandardMove } from "../utils/dataObjectUtils";

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
  getRoundNumber(): number;

  // ===== Setters =====

  setScore(participant: Participant, score: number): void;
  setTaraCount(participant: Participant, count: number): void;
  setMostCommonMove(participant: Participant, move: StandardMove | null): void;
  setMoveCounts(participant: Participant, moveCounts: MoveCount): void;
  setRoundNumber(round: number): void;

  // ===== Removers =====

  removeScore(participant: Participant): void;
  removeTaraCount(participant: Participant): void;
  removeMostCommonMove(participant: Participant): void;
  removeMoveCounts(participant: Participant): void;
  removeRoundNumber(): void;
  removeHistory(participant: Participant): void;
}
