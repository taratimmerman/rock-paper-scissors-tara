import { Health, Match, Move, Participant } from "../utils/dataObjectUtils";

export interface IModel {
  // Score
  getPlayerScore(): number;
  getComputerScore(): number;
  setPlayerScore(score: number): void;
  setComputerScore(score: number): void;

  // Moves
  doesMoveBeat(a: Move, b: Move): boolean;
  getPlayerMove(): Move;
  getComputerMove(): Move;
  registerPlayerMove(move: Move): void;
  chooseComputerMove(): void;
  evaluateRound(): string;
  resetMoves(): void;

  // Tara
  getPlayerTaraCount(): number;
  getComputerTaraCount(): number;
  taraIsEnabled(): boolean;
  resetTaras(): void;

  // Most common moves
  getPlayerMostCommonMove(): Move | null;
  getComputerMostCommonMove(): Move | null;
  resetBothMoveCounts(): void;
  resetMostCommonMoves(): void;
  showMostCommonMove(): boolean;

  // Match & round
  isMatchActive(): boolean;
  isMatchOver(): boolean;
  handleMatchWin(): Participant;
  incrementMatchNumber(): void;
  increaseRoundNumber(): void;
  getRoundNumber(): number;
  getMatchNumber(): number;
  setMatch(match: Match | null): void;
  setDefaultMatchData(): void;
  resetHistories(): void;
  resetMatchData(): void;

  // Health
  getHealth(participant: Participant): Health;

  // Optional setters for testing or future expansion
  resetScores(): void;
}
