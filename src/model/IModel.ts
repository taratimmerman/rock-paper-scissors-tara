import {
  GameOutcome,
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
  getPlayerMove(): Move | null;
  getComputerMove(): Move | null;
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
  determineGameOutcome(): GameOutcome;
  isDoubleKO(): boolean;
  isMatchActive(): boolean;
  isMatchOver(): boolean;
  incrementWinnerScore(winner: Participant): void;
  incrementMatchNumber(): void;
  setMatchNumber(matchNumber: number | null): void;
  increaseRoundNumber(): void;
  forceMatchWinner(): Participant | "draw";
  getRoundNumber(): number;
  getMatchNumber(): number;
  getMatchWinner(): Participant | "draw";
  setMatch(match: Match | null): void;
  setDefaultMatchData(): void;

  // Health
  getHealth(participant: Participant): Health;

  // Reset all persisted game data
  hasDataToReset(): boolean;
  resetGame(): void;
}
