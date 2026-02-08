import { MOVES } from "../dataUtils";
import { GameState, Move, StandardMove } from "../dataObjectUtils";
import { IComputerBrain } from "./IComputerBrain";
import { getAvailableMoves } from "../gameRules";

export class AdaptiveComputer implements IComputerBrain {
  calculateNextMove(state: GameState): Move {
    const hasTara = state.taras.computer > 0;
    const availableMoves = getAvailableMoves(hasTara);
    const weights = this.getComputerMoveWeights(state, availableMoves);
    const move = this.chooseWeightedRandomMove(availableMoves, weights);

    return move;
  }

  private getBaseWeights(): Record<Move, number> {
    return {
      [MOVES.ROCK]: 1,
      [MOVES.PAPER]: 1,
      [MOVES.SCISSORS]: 1,
      [MOVES.TARA]: 0,
    };
  }

  private getTaraWeight(state: GameState, moves: Move[]): number | null {
    if (!moves.includes(MOVES.TARA)) return null;

    const { player, computer } = state.scores;
    const scoreDiff = player - computer;

    if (scoreDiff > 0) return Math.min(3 + scoreDiff, 10);
    if (scoreDiff < 0) return 1;
    return 2;
  }

  private getStandardMoveWeights(
    state: GameState,
  ): Record<StandardMove, number> {
    const weights: Record<StandardMove, number> = {
      [MOVES.ROCK]: 1,
      [MOVES.PAPER]: 1,
      [MOVES.SCISSORS]: 1,
    };

    const playerMostCommon = state.mostCommonMove.player;
    const computerMostCommon = state.mostCommonMove.computer;

    // SCENARIO A: Counter the player
    if (playerMostCommon) {
      const counterMap: Record<StandardMove, StandardMove> = {
        [MOVES.ROCK]: MOVES.PAPER,
        [MOVES.PAPER]: MOVES.SCISSORS,
        [MOVES.SCISSORS]: MOVES.ROCK,
      };

      const counter = counterMap[playerMostCommon];
      return {
        [MOVES.ROCK]: counter === MOVES.ROCK ? 5 : 2,
        [MOVES.PAPER]: counter === MOVES.PAPER ? 5 : 2,
        [MOVES.SCISSORS]: counter === MOVES.SCISSORS ? 5 : 2,
      };
    }

    // SCENARIO B: Fall back to computer habit
    if (computerMostCommon) {
      weights[computerMostCommon] += 2;
    }

    return weights;
  }

  private getComputerMoveWeights(
    state: GameState,
    moves: Move[],
  ): Record<Move, number> {
    const baseWeights = this.getBaseWeights();
    const taraWeight = this.getTaraWeight(state, moves);
    const standardWeights = this.getStandardMoveWeights(state);

    return {
      ...baseWeights,
      ...standardWeights,
      ...(taraWeight !== null ? { [MOVES.TARA]: taraWeight } : {}),
    };
  }

  private chooseWeightedRandomMove(
    moves: Move[],
    weights: Record<Move, number>,
  ): Move {
    const weightedPool = moves.flatMap((move) =>
      Array(weights[move]).fill(move),
    );
    const randomIndex = Math.floor(Math.random() * weightedPool.length);
    return weightedPool[randomIndex];
  }
}
