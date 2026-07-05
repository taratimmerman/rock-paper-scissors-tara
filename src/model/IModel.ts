import {
  Health,
  Match,
  Move,
  Participant,
  RoundResult,
  StandardMove,
} from "../utils/dataObjectUtils";

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
  registerComputerMove(move: Move): void;
  getCalculatedComputerMove(): Move;
  evaluateRound(): RoundResult;
  resetMoves(): void;

  // Tara
  getPlayerTaraCount(): number;
  getComputerTaraCount(): number;
  taraIsEnabled(): boolean;

  // Most common moves
  getPlayerMostCommonMove(): StandardMove | null;
  getComputerMostCommonMove(): StandardMove | null;
  showMostCommonMove(): boolean;

  // Match & round
  isDoubleKO(): boolean;
  isMatchActive(): boolean;
  isMatchOver(): boolean;
  handleMatchWin(): Participant;
  incrementMatchNumber(): void;
  increaseRoundNumber(): void;
  getRoundNumber(): number;
  getMatchNumber(): number;
  setMatch(match: Match | null): void;
  setDefaultMatchData(): void;

  // Health
  getHealth(participant: Participant): Health;

  // Reset all match data
  resetGame(): void;
}
