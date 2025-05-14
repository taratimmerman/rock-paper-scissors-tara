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
  };

  constructor() {
    this.state.scores.player = this.getPlayerScoreFromStorage();
    this.state.scores.computer = this.getComputerScoreFromStorage();
    this.state.taras.player = this.getPlayerTaraCountFromStorage();
    this.state.taras.computer = this.getComputerTaraCountFromStorage();
    this.state.mostCommonMove.player =
      this.getPlayerMostCommonMoveFromStorage();
    this.state.mostCommonMove.computer =
      this.getComputerMostCommonMoveFromStorage();
    this.state.moveCounts.player = this.getMoveCountsFromStorage(
      PARTICIPANTS.PLAYER
    );
    this.state.moveCounts.computer = this.getMoveCountsFromStorage(
      PARTICIPANTS.COMPUTER
    );
    this.state.roundNumber = this.getRoundNumberFromStorage();
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
    localStorage.setItem(`${key}Score`, value.toString());
  }

  private getScoreFromStorage(key: Participant): number {
    return parseInt(localStorage.getItem(`${key}Score`) || "0", 10);
  }

  private getPlayerScoreFromStorage(): number {
    return this.getScoreFromStorage(PARTICIPANTS.PLAYER);
  }

  private getComputerScoreFromStorage(): number {
    return this.getScoreFromStorage(PARTICIPANTS.COMPUTER);
  }

  private getScore(key: Participant): number {
    return this.state.scores[key];
  }

  private resetScore(key: Participant): void {
    this.state.scores[key] = 0;
    localStorage.removeItem(`${key}Score`);
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
    localStorage.removeItem(`${key}MostCommonMove`);
  }

  private setMostCommonMove(key: Participant, moveCounts: MoveCount): void {
    const mostCommonMove = this.determineMostCommonMove(moveCounts);

    if (mostCommonMove) {
      this.state.mostCommonMove[key] = mostCommonMove;
      localStorage.setItem(`${key}MostCommonMove`, mostCommonMove.toString());
    } else {
      this.resetMostCommonMove(key);
    }
  }

  private getMostCommonMoveFromStorage(key: Participant): StandardMove | null {
    const move = localStorage.getItem(`${key}MostCommonMove`);
    return move && this.isStandardMove(move) ? move : null;
  }

  private getPlayerMostCommonMoveFromStorage(): StandardMove | null {
    return this.getMostCommonMoveFromStorage(PARTICIPANTS.PLAYER);
  }

  private getComputerMostCommonMoveFromStorage(): StandardMove | null {
    return this.getMostCommonMoveFromStorage(PARTICIPANTS.COMPUTER);
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

    try {
      localStorage.setItem(
        `${key}MoveCounts`,
        JSON.stringify(this.state.moveCounts[key])
      );
    } catch (e) {
      console.warn(`Failed to save ${key} data to localStorage`, e);
    }
  }

  private getMoveCountsFromStorage(key: Participant): MoveCount {
    try {
      const raw = localStorage.getItem(`${key}MoveCounts`);
      return raw ? JSON.parse(raw) : { rock: 0, paper: 0, scissors: 0 };
    } catch {
      return { rock: 0, paper: 0, scissors: 0 };
    }
  }

  private resetMoveCounts(key: Participant): void {
    this.state.moveCounts[key] = { rock: 0, paper: 0, scissors: 0 };
    localStorage.removeItem(`${key}MoveCounts`);
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
    try {
      localStorage.removeItem(`${key}History`);
    } catch (e) {
      console.warn(`Failed to remove ${key} history from localStorage`, e);
    }
  }

  resetHistories(): void {
    this.resetHistory(PARTICIPANTS.PLAYER);
    this.resetHistory(PARTICIPANTS.COMPUTER);
  }

  // ===== Round Methods =====

  private getRoundNumberFromStorage(): number {
    return parseInt(localStorage.getItem(`roundNumber`) || "1", 10);
  }

  getRoundNumber(): number {
    return this.state.roundNumber;
  }

  setRoundNumber(value: number): void {
    this.state.roundNumber = value;
    localStorage.setItem(`roundNumber`, value.toString());
  }

  increaseRoundNumber(): void {
    this.setRoundNumber(this.getRoundNumber() + 1);
  }

  resetRoundNumber(): void {
    this.state.roundNumber = 1;
    localStorage.removeItem(`roundNumber`);
  }

  // ===== Tara Methods =====

  private getTaraCountFromStorage(key: Participant): number {
    return parseInt(localStorage.getItem(`${key}TaraCount`) || "0", 10);
  }

  private getPlayerTaraCountFromStorage(): number {
    return this.getTaraCountFromStorage(PARTICIPANTS.PLAYER);
  }

  private getComputerTaraCountFromStorage(): number {
    return this.getTaraCountFromStorage(PARTICIPANTS.COMPUTER);
  }

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
    localStorage.setItem(`${key}TaraCount`, value.toString());
  }

  private getTaraCount(key: Participant): number {
    return this.state.taras[key];
  }

  private resetTaraCount(key: Participant): void {
    this.state.taras[key] = 0;
    localStorage.removeItem(`${key}TaraCount`);
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
