import {
  GameState,
  Move,
  MoveCount,
  Participant,
  StandardMove,
} from "../utils/dataObjectUtils";
import {
  ALL_MOVE_NAMES,
  MOVES,
  MOVE_DATA_MAP,
  PARTICIPANTS,
  STANDARD_MOVE_NAMES,
} from "../utils/dataUtils";
import { IGameStorage } from "../storage/gameStorage";
import { LocalStorageGameStorage } from "../storage/localStorageGameStorage";

export class Model {
  private state: GameState = {
    scores: {
      player: 0,
      computer: 0,
    },
    moves: {
      player: null,
      computer: null,
    },
    taras: {
      player: 0,
      computer: 0,
    },
    mostCommonMove: {
      player: null,
      computer: null,
    },
    moveCounts: {
      player: { rock: 0, paper: 0, scissors: 0 },
      computer: { rock: 0, paper: 0, scissors: 0 },
    },
    roundNumber: 1,
    globalMatchNumber: 1,
    currentMatch: null,
  };
  private gameStorage: IGameStorage;

  constructor(gameStorage: IGameStorage = new LocalStorageGameStorage()) {
    this.gameStorage = gameStorage;
    this.state.scores.player = this.gameStorage.getScore(PARTICIPANTS.PLAYER);
    this.state.scores.computer = this.gameStorage.getScore(
      PARTICIPANTS.COMPUTER
    );
    this.state.taras.player = this.gameStorage.getTaraCount(
      PARTICIPANTS.PLAYER
    );
    this.state.taras.computer = this.gameStorage.getTaraCount(
      PARTICIPANTS.COMPUTER
    );
    this.state.mostCommonMove.player = this.gameStorage.getMostCommonMove(
      PARTICIPANTS.PLAYER
    );
    this.state.mostCommonMove.computer = this.gameStorage.getMostCommonMove(
      PARTICIPANTS.COMPUTER
    );
    this.state.moveCounts.player = this.gameStorage.getMoveCounts(
      PARTICIPANTS.PLAYER
    );
    this.state.moveCounts.computer = this.gameStorage.getMoveCounts(
      PARTICIPANTS.COMPUTER
    );
    this.state.roundNumber = this.gameStorage.getRoundNumber();
    this.state.globalMatchNumber = this.gameStorage.getGlobalMatchNumber();
    this.state.currentMatch = this.gameStorage.getMatch();
  }

  // ===== General Methods =====

  private doesMoveBeat(a: Move, b: Move): boolean {
    return MOVE_DATA_MAP.get(a)?.beats.includes(b) ?? false;
  }

  private handleRoundWin(winner: Participant, winningMove: Move): void {
    this.setScore(winner, this.getScore(winner) + 1);

    if (this.isStandardMove(winningMove)) {
      const currentTara = this.getTaraCount(winner);
      if (currentTara < 3) {
        this.setTaraCount(winner, currentTara + 1);
      }
    }
  }

  evaluateRound(): string {
    const playerMove = this.getPlayerMove();
    const computerMove = this.getComputerMove();

    if (playerMove === null || computerMove === null) return "Invalid round";

    this.handleTaraMove(PARTICIPANTS.PLAYER, playerMove);
    this.handleTaraMove(PARTICIPANTS.COMPUTER, computerMove);

    if (playerMove === computerMove) return "It's a tie!";

    if (this.doesMoveBeat(playerMove, computerMove)) {
      this.handleRoundWin(PARTICIPANTS.PLAYER, playerMove);
      return "You win!";
    } else {
      this.handleRoundWin(PARTICIPANTS.COMPUTER, computerMove);
      return "Computer wins!";
    }
  }

  // ===== Score Methods =====

  private setScore(key: Participant, value: number): void {
    this.state.scores[key] = value;
    this.gameStorage.setScore(key, value);
  }

  private getScore(key: Participant): number {
    return this.state.scores[key];
  }

  private resetScore(key: Participant): void {
    this.state.scores[key] = 0;
    this.gameStorage.removeScore(key);
  }

  setPlayerScore(score: number) {
    this.setScore(PARTICIPANTS.PLAYER, score);
  }

  setComputerScore(score: number) {
    this.setScore(PARTICIPANTS.COMPUTER, score);
  }

  getPlayerScore(): number {
    return this.getScore(PARTICIPANTS.PLAYER);
  }

  getComputerScore() {
    return this.getScore(PARTICIPANTS.COMPUTER);
  }

  resetScores(): void {
    this.resetScore(PARTICIPANTS.PLAYER);
    this.resetScore(PARTICIPANTS.COMPUTER);
  }

  // ===== Move Methods =====

  private isStandardMove(value: unknown): value is StandardMove {
    return typeof value === "string" && value !== MOVES.TARA;
  }

  private setMove(key: Participant, move: Move | null): void {
    this.state.moves[key] = move;
  }

  private getMove(key: Participant): Move | null {
    return this.state.moves[key];
  }

  private determineMostCommonMove(moveCounts: MoveCount): StandardMove | null {
    let mostCommonMove: StandardMove | null = null;
    let highestCount = 0;
    let tie = false;

    for (const [move, count] of Object.entries(moveCounts)) {
      if (count > highestCount) {
        highestCount = count;
        mostCommonMove = move as StandardMove;
        tie = false;
      } else if (count === highestCount && count !== 0) {
        tie = true;
      }
    }

    return tie ? null : mostCommonMove;
  }

  private resetMostCommonMove(key: Participant): void {
    this.state.mostCommonMove[key] = null;
    this.gameStorage.removeMostCommonMove(key);
  }

  private setMostCommonMove(key: Participant, moveCounts: MoveCount): void {
    const mostCommonMove = this.determineMostCommonMove(moveCounts);
    this.state.mostCommonMove[key] = mostCommonMove;
    this.gameStorage.setMostCommonMove(key, mostCommonMove);
  }

  private getMostCommonMove(key: Participant): StandardMove | null {
    return this.state.mostCommonMove[key];
  }

  private getAvailableMoves(hasTara: boolean): Move[] {
    if (hasTara) {
      return ALL_MOVE_NAMES;
    } else {
      return STANDARD_MOVE_NAMES;
    }
  }

  private getBaseWeights(): Record<Move, number> {
    return {
      [MOVES.ROCK]: 1,
      [MOVES.PAPER]: 1,
      [MOVES.SCISSORS]: 1,
      [MOVES.TARA]: 0,
    };
  }

  private getTaraWeight(moves: Move[]): number | null {
    if (!moves.includes(MOVES.TARA)) return null;

    const { player, computer } = this.state.scores;
    const scoreDiff = player - computer;

    if (scoreDiff > 0) return Math.min(3 + scoreDiff, 10);
    if (scoreDiff < 0) return 1;
    return 2;
  }

  private getStandardMoveWeights(): Record<StandardMove, number> {
    const weights: Record<StandardMove, number> = {
      [MOVES.ROCK]: 1,
      [MOVES.PAPER]: 1,
      [MOVES.SCISSORS]: 1,
    };

    const mostCommon = this.state.mostCommonMove.player;
    if (!mostCommon) return weights;

    const counterMap: Record<StandardMove, StandardMove> = {
      [MOVES.ROCK]: MOVES.PAPER,
      [MOVES.PAPER]: MOVES.SCISSORS,
      [MOVES.SCISSORS]: MOVES.ROCK,
    };

    const counter = counterMap[mostCommon];
    return {
      [MOVES.ROCK]: counter === MOVES.ROCK ? 5 : 2,
      [MOVES.PAPER]: counter === MOVES.PAPER ? 5 : 2,
      [MOVES.SCISSORS]: counter === MOVES.SCISSORS ? 5 : 2,
    };
  }

  private chooseWeightedRandomMove(
    moves: Move[],
    weights: Record<Move, number>
  ): Move {
    const weightedPool = moves.flatMap((move) =>
      Array(weights[move]).fill(move)
    );
    const randomIndex = Math.floor(Math.random() * weightedPool.length);
    return weightedPool[randomIndex];
  }

  private getComputerMoveWeights(moves: Move[]): Record<Move, number> {
    const baseWeights = this.getBaseWeights();
    const taraWeight = this.getTaraWeight(moves);
    const standardWeights = this.getStandardMoveWeights();

    return {
      ...baseWeights,
      ...standardWeights,
      ...(taraWeight !== null ? { [MOVES.TARA]: taraWeight } : {}),
    };
  }

  private getWeightedComputerMove(): Move {
    const hasTara = this.getComputerTaraCount() > 0;
    const availableMoves = this.getAvailableMoves(hasTara);
    const weights = this.getComputerMoveWeights(availableMoves);

    return this.chooseWeightedRandomMove(availableMoves, weights);
  }

  setPlayerMove(move: Move | null) {
    this.setMove(PARTICIPANTS.PLAYER, move);
  }

  getPlayerMove(): Move | null {
    return this.getMove(PARTICIPANTS.PLAYER);
  }

  setComputerMove(move: Move | null) {
    this.setMove(PARTICIPANTS.COMPUTER, move);
  }

  getComputerMove(): Move | null {
    return this.getMove(PARTICIPANTS.COMPUTER);
  }

  resetMoves(): void {
    this.setPlayerMove(null);
    this.setComputerMove(null);
  }

  chooseComputerMove(): void {
    const move = this.getWeightedComputerMove();
    this.registerComputerMove(move);
  }

  registerPlayerMove(move: Move) {
    this.setPlayerMove(move);
    if (this.isStandardMove(move)) {
      this.setMoveCounts(PARTICIPANTS.PLAYER, move);
      this.setPlayerMostCommonMove();
    }
  }

  registerComputerMove(move: Move) {
    this.setComputerMove(move);
    if (this.isStandardMove(move)) {
      this.setMoveCounts(PARTICIPANTS.COMPUTER, move);
      this.setComputerMostCommonMove();
    }
  }

  setPlayerMostCommonMove(): void {
    const moveCounts = this.getMoveCounts(PARTICIPANTS.PLAYER);
    this.setMostCommonMove(PARTICIPANTS.PLAYER, moveCounts);
  }

  setComputerMostCommonMove(): void {
    const moveCounts = this.getMoveCounts(PARTICIPANTS.COMPUTER);
    this.setMostCommonMove(PARTICIPANTS.COMPUTER, moveCounts);
  }

  resetMostCommonMoves(): void {
    this.resetMostCommonMove(PARTICIPANTS.PLAYER);
    this.resetMostCommonMove(PARTICIPANTS.COMPUTER);
  }

  getPlayerMostCommonMove(): StandardMove | null {
    return this.getMostCommonMove(PARTICIPANTS.PLAYER);
  }

  getComputerMostCommonMove(): StandardMove | null {
    return this.getMostCommonMove(PARTICIPANTS.COMPUTER);
  }

  private setMoveCounts(key: Participant, move: StandardMove): void {
    this.state.moveCounts[key][move] =
      (this.state.moveCounts[key][move] || 0) + 1;
    this.gameStorage.setMoveCounts(key, this.state.moveCounts[key]);
  }

  private resetMoveCounts(key: Participant): void {
    this.state.moveCounts[key] = { rock: 0, paper: 0, scissors: 0 };
    this.gameStorage.removeMoveCounts(key);
  }

  private getMoveCounts(key: Participant): MoveCount {
    return this.state.moveCounts[key];
  }

  resetBothMoveCounts(): void {
    this.resetMoveCounts(PARTICIPANTS.PLAYER);
    this.resetMoveCounts(PARTICIPANTS.COMPUTER);
  }

  showMostCommonMove(): boolean {
    return (
      this.getRoundNumber() > 1 &&
      (this.getPlayerMostCommonMove() !== null ||
        this.getComputerMostCommonMove() !== null)
    );
  }

  private resetHistory(key: Participant): void {
    this.gameStorage.removeHistory(key);
  }

  resetHistories(): void {
    this.resetHistory(PARTICIPANTS.PLAYER);
    this.resetHistory(PARTICIPANTS.COMPUTER);
  }

  // ===== Round Methods =====

  getRoundNumber(): number {
    return this.state.roundNumber;
  }

  setRoundNumber(value: number): void {
    this.state.roundNumber = value;
    this.gameStorage.setRoundNumber(value);
  }

  increaseRoundNumber(): void {
    this.setRoundNumber(this.getRoundNumber() + 1);
  }

  resetRoundNumber(): void {
    this.state.roundNumber = 1;
    this.gameStorage.removeRoundNumber();
  }

  // ===== Tara Methods =====

  private decrementTaraCount(key: Participant): void {
    const current = this.getTaraCount(key);
    if (current > 0) this.setTaraCount(key, current - 1);
  }

  private handleTaraMove(key: Participant, move: Move): void {
    if (move === MOVES.TARA) {
      const currentTara = this.getTaraCount(key);
      if (currentTara > 0) {
        this.decrementTaraCount(key);
      } else {
        this.setMove(key, MOVES.ROCK);
      }
    }
  }

  private setTaraCount(key: Participant, value: number): void {
    this.state.taras[key] = value;
    this.gameStorage.setTaraCount(key, value);
  }

  private getTaraCount(key: Participant): number {
    return this.state.taras[key];
  }

  private resetTaraCount(key: Participant): void {
    this.state.taras[key] = 0;
    this.gameStorage.removeTaraCount(key);
  }

  setPlayerTaraCount(count: number): void {
    this.setTaraCount(PARTICIPANTS.PLAYER, count);
  }

  setComputerTaraCount(count: number): void {
    this.setTaraCount(PARTICIPANTS.COMPUTER, count);
  }

  resetTaras(): void {
    this.resetTaraCount(PARTICIPANTS.PLAYER);
    this.resetTaraCount(PARTICIPANTS.COMPUTER);
  }

  getPlayerTaraCount(): number {
    return this.getTaraCount(PARTICIPANTS.PLAYER);
  }

  getComputerTaraCount(): number {
    return this.getTaraCount(PARTICIPANTS.COMPUTER);
  }

  taraIsEnabled(): boolean {
    return this.getTaraCount(PARTICIPANTS.PLAYER) > 0;
  }
}
