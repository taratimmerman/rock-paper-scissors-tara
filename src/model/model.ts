import {
  GameState,
  Move,
  Participant,
  StandardMove,
} from "../utils/dataObjectUtils";
import {
  MOVES,
  MOVE_DATA_MAP,
  PARTICIPANTS,
  STANDARD_MOVE_DATA_MAP,
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
    history: {
      player: [],
      computer: [],
    },
    mostCommonMove: {
      player: null,
      computer: null,
    },
    roundNumber: 1,
  };

  constructor() {
    this.state.scores.player = this.getPlayerScoreFromStorage();
    this.state.scores.computer = this.getComputerScoreFromStorage();
    this.state.taras.player = this.getPlayerTaraCountFromStorage();
    this.state.taras.computer = this.getComputerTaraCountFromStorage();
    this.state.history.player = this.getPlayerHistoryFromStorage();
    this.state.history.computer = this.getComputerHistoryFromStorage();
    this.state.mostCommonMove.player =
      this.getPlayerMostCommonMoveFromStorage();
    this.state.mostCommonMove.computer =
      this.getComputerMostCommonMoveFromStorage();
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
    this.setPlayerScore(0);
    this.setComputerScore(0);
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

  private determineMostCommonMove(moves: StandardMove[]): StandardMove | null {
    if (moves.length === 0) return null;

    const counts = new Map<StandardMove, number>();

    for (const move of moves) {
      counts.set(move, (counts.get(move) || 0) + 1);
    }

    return [...counts.entries()].reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  }

  private setMostCommonMove(key: Participant, moves: StandardMove[]): void {
    const mostCommonMove = this.determineMostCommonMove(moves);

    if (mostCommonMove) {
      this.state.mostCommonMove[key] = mostCommonMove;
      localStorage.setItem(`${key}MostCommonMove`, mostCommonMove.toString());
    }
  }

  private resetMostCommonMove(key: Participant): void {
    this.state.mostCommonMove[key] = null;
    localStorage.removeItem(`${key}MostCommonMove`);
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
    const hasTara = this.getComputerTaraCount() > 0;
    const moveMap = hasTara ? MOVE_DATA_MAP : STANDARD_MOVE_DATA_MAP;

    const moveNames = Array.from(moveMap.keys());
    const randomIndex = Math.floor(Math.random() * moveNames.length);
    const randomMove = moveNames[randomIndex];

    this.registerComputerMove(randomMove);
  }

  registerPlayerMove(move: Move) {
    this.setPlayerMove(move);
    if (this.isStandardMove(move)) {
      this.setPlayerHistory(move);
      this.setPlayerMostCommonMove();
    }
  }

  registerComputerMove(move: Move) {
    this.setComputerMove(move);
    if (this.isStandardMove(move)) {
      this.setComputerHistory(move);
      this.setComputerMostCommonMove();
    }
  }

  setPlayerMostCommonMove(): void {
    const moves = this.getPlayerHistory();
    this.setMostCommonMove(PARTICIPANTS.PLAYER, moves);
  }

  setComputerMostCommonMove(): void {
    const moves = this.getComputerHistory();
    this.setMostCommonMove(PARTICIPANTS.COMPUTER, moves);
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
    this.setRoundNumber(1);
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

  setPlayerTaraCount(count: number): void {
    this.setTaraCount(PARTICIPANTS.PLAYER, count);
  }

  setComputerTaraCount(count: number): void {
    this.setTaraCount(PARTICIPANTS.COMPUTER, count);
  }

  resetTaras(): void {
    this.setPlayerTaraCount(0);
    this.setComputerTaraCount(0);
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

  // ===== History Methods =====

  private setHistory(key: Participant, move: StandardMove): void {
    this.state.history[key].push(move);

    try {
      localStorage.setItem(
        `${key}History`,
        JSON.stringify(this.state.history[key])
      );
    } catch (e) {
      console.warn(`Failed to save ${key} history to localStorage`, e);
    }
  }

  private getHistoryFromStorage(key: Participant): StandardMove[] {
    try {
      const raw = localStorage.getItem(`${key}History`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private getPlayerHistoryFromStorage(): StandardMove[] {
    return this.getHistoryFromStorage(PARTICIPANTS.PLAYER);
  }

  private getComputerHistoryFromStorage(): StandardMove[] {
    return this.getHistoryFromStorage(PARTICIPANTS.COMPUTER);
  }

  private getHistory(key: Participant): StandardMove[] {
    return this.state.history[key];
  }

  private resetHistory(key: Participant): void {
    this.state.history[key] = [];

    try {
      localStorage.setItem(`${key}History`, JSON.stringify([]));
    } catch (e) {
      console.warn(`Failed to save ${key} history to localStorage`, e);
    }
  }

  setPlayerHistory(move: StandardMove): void {
    this.setHistory(PARTICIPANTS.PLAYER, move);
  }

  setComputerHistory(move: StandardMove): void {
    this.setHistory(PARTICIPANTS.COMPUTER, move);
  }

  resetHistories(): void {
    this.resetHistory(PARTICIPANTS.PLAYER);
    this.resetHistory(PARTICIPANTS.COMPUTER);
  }

  getPlayerHistory(): StandardMove[] {
    return this.getHistory(PARTICIPANTS.PLAYER);
  }

  getComputerHistory(): StandardMove[] {
    return this.getHistory(PARTICIPANTS.COMPUTER);
  }

  showMostCommonMove(): boolean {
    return (
      this.getRoundNumber() > 1 &&
      !!this.getPlayerMostCommonMove() &&
      !!this.getComputerMostCommonMove()
    );
  }
}
