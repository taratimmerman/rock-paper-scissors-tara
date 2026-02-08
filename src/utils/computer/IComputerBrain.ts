import { GameState, Move } from "../dataObjectUtils";

export interface IComputerBrain {
  calculateNextMove(gameState: GameState): Move;
}
