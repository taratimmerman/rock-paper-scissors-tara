import {
  GameState,
  Health,
  Match,
  Move,
  MoveCount,
  Participant,
  StandardMove,
} from "../utils/dataObjectUtils";
import {
  DAMAGE_PER_LOSS,
  DAMAGE_PER_TARA_LOSS,
  DAMAGE_PER_TARA_TIE,
  DAMAGE_PER_TIE,
  DEFAULT_MATCH,
  HEALTH_KEYS,
  INITIAL_HEALTH,
  MOVES,
  MOVE_DATA_MAP,
  PARTICIPANTS,
} from "../utils/dataUtils";
import { IComputerBrain } from "../utils/computer/IComputerBrain";
import { AdaptiveComputer } from "../utils/computer/AdaptiveComputer";
import { IGameStorage } from "../storage/gameStorage";
import { LocalStorageGameStorage } from "../storage/localStorageGameStorage";

export class Model {
  private state: GameState = {
    scores: { player: 0, computer: 0 },
    moves: { player: null, computer: null },
    taras: { player: 0, computer: 0 },
    mostCommonMove: { player: null, computer: null },
    moveCounts: {
      player: { rock: 0, paper: 0, scissors: 0 },
      computer: { rock: 0, paper: 0, scissors: 0 },
    },
    globalMatchNumber: null,
    currentMatch: null,
  };

  private gameStorage: IGameStorage;
  private computer: IComputerBrain;

  constructor(
    gameStorage: IGameStorage = new LocalStorageGameStorage(),
    computer: IComputerBrain = new AdaptiveComputer(),
  ) {
    this.gameStorage = gameStorage;
    this.computer = computer;

    this.state.scores.player = this.gameStorage.getScore(PARTICIPANTS.PLAYER);
    this.state.scores.computer = this.gameStorage.getScore(
      PARTICIPANTS.COMPUTER,
    );
    this.state.taras.player = this.gameStorage.getTaraCount(
      PARTICIPANTS.PLAYER,
    );
    this.state.taras.computer = this.gameStorage.getTaraCount(
      PARTICIPANTS.COMPUTER,
    );
    this.state.mostCommonMove.player = this.gameStorage.getMostCommonMove(
      PARTICIPANTS.PLAYER,
    );
    this.state.mostCommonMove.computer = this.gameStorage.getMostCommonMove(
      PARTICIPANTS.COMPUTER,
    );
    this.state.moveCounts.player = this.gameStorage.getMoveCounts(
      PARTICIPANTS.PLAYER,
    );
    this.state.moveCounts.computer = this.gameStorage.getMoveCounts(
      PARTICIPANTS.COMPUTER,
    );

    this._loadOrMigrateMatchState();
  }

  // ===== General Methods =====

  doesMoveBeat(a: Move, b: Move): boolean {
    return MOVE_DATA_MAP.get(a)?.beats.includes(b) ?? false;
  }

  private handleRoundWin(winner: Participant, winningMove: Move): void {
    if (this.isStandardMove(winningMove)) {
      const currentTara = this.getTaraCount(winner);
      if (currentTara < 3) {
        this.setTaraCount(winner, currentTara + 1);
      }
    }
  }

  evaluateRound(): string {
    let playerMove = this.getPlayerMove();
    let computerMove = this.getComputerMove();
    if (playerMove === null || computerMove === null) return "Invalid round";

    this.handleTaraMove(PARTICIPANTS.PLAYER, playerMove);
    this.handleTaraMove(PARTICIPANTS.COMPUTER, computerMove);

    playerMove = this.getPlayerMove();
    computerMove = this.getComputerMove();

    const tieStatus = this.isTie();
    const taraInPlay = playerMove === MOVES.TARA || computerMove === MOVES.TARA;
    const damage = this.getDamageAmount(tieStatus, taraInPlay);

    if (tieStatus) {
      this.decrementHealth(PARTICIPANTS.PLAYER, damage);
      this.decrementHealth(PARTICIPANTS.COMPUTER, damage);
      return "It's a tie!";
    }

    if (this.doesMoveBeat(playerMove!, computerMove!)) {
      this.handleRoundWin(PARTICIPANTS.PLAYER, playerMove!);
      this.decrementHealth(PARTICIPANTS.COMPUTER, damage);
      return "You win the round!";
    } else {
      this.handleRoundWin(PARTICIPANTS.COMPUTER, computerMove!);
      this.decrementHealth(PARTICIPANTS.PLAYER, damage);
      return "Computer wins the round!";
    }
  }

  isMatchActive(): boolean {
    return this.gameStorage.getMatch() !== null;
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
    let hasMoveFrequencyTie = false;

    for (const [move, count] of Object.entries(moveCounts)) {
      if (count > highestCount) {
        highestCount = count;
        mostCommonMove = move as StandardMove;
        hasMoveFrequencyTie = false;
      } else if (count === highestCount && count !== 0) {
        hasMoveFrequencyTie = true;
      }
    }
    return hasMoveFrequencyTie ? null : mostCommonMove;
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
    const move = this.computer.calculateNextMove(this.state);
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
      this.getPlayerMostCommonMove() !== null ||
      this.getComputerMostCommonMove() !== null
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
    return this.state.currentMatch?.matchRoundNumber ?? 1;
  }

  setRoundNumber(value: number): void {
    if (!this.state.currentMatch) return;
    this.state.currentMatch.matchRoundNumber = value;
    this.gameStorage.setMatch(this.state.currentMatch);
  }

  increaseRoundNumber(): void {
    this.setRoundNumber(this.getRoundNumber() + 1);
  }

  isTie(): boolean | "tara-tie" {
    const playerMove = this.getPlayerMove();
    const computerMove = this.getComputerMove();
    const isTaraTie = playerMove === MOVES.TARA && computerMove === MOVES.TARA;
    if (isTaraTie) return "tara-tie";
    return playerMove !== null &&
      computerMove !== null &&
      playerMove === computerMove
      ? true
      : false;
  }

  // ===== Tara Methods =====

  private decrementTaraCount(key: Participant): void {
    const current = this.getTaraCount(key);
    if (current > 1) {
      this.setTaraCount(key, current - 1);
    } else if (current === 1) {
      this.resetTaraCount(key);
    }
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

  // ===== Match Methods =====

  handleMatchWin(): Participant | "draw" {
    const result = this.getMatchWinner();
    if (result !== "draw") {
      this.setScore(result, this.getScore(result) + 1);
    }
    return result;
  }

  isDoubleKO(): boolean {
    return (
      this.isMatchOver() &&
      this.getHealth(PARTICIPANTS.PLAYER) === 0 &&
      this.getHealth(PARTICIPANTS.COMPUTER) === 0
    );
  }

  setMatch(match: Match | null): void {
    this.state.currentMatch = match;
    this.gameStorage.setMatch(match);
  }

  setMatchNumber(matchNumber: number | null): void {
    this.state.globalMatchNumber = matchNumber;
    this.gameStorage.setGlobalMatchNumber(matchNumber);
  }

  setDefaultMatchData(): void {
    if (!this.isMatchActive()) {
      this.setMatch({ ...DEFAULT_MATCH });
    }
  }

  resetMatchData(): void {
    this.state.currentMatch = null;
    this.gameStorage.setMatch(null);
    this.setMatchNumber(null);
  }

  getMatchNumber(): number {
    return this.state.globalMatchNumber ?? 1;
  }

  isMatchOver(): boolean {
    return (
      this.isDefeated(PARTICIPANTS.PLAYER) ||
      this.isDefeated(PARTICIPANTS.COMPUTER)
    );
  }

  getMatchWinner(): Participant | "draw" {
    const playerDefeated = this.isDefeated(PARTICIPANTS.PLAYER);
    const computerDefeated = this.isDefeated(PARTICIPANTS.COMPUTER);
    if (playerDefeated && computerDefeated) return "draw";
    if (playerDefeated) return PARTICIPANTS.COMPUTER;
    if (computerDefeated) return PARTICIPANTS.PLAYER;
    return "draw";
  }

  incrementMatchNumber(): void {
    this.setMatchNumber(this.getMatchNumber() + 1);
  }

  private _loadOrMigrateMatchState(): void {
    if (this.isMatchActive()) {
      this.state.globalMatchNumber = this.gameStorage.getGlobalMatchNumber();
      this.state.currentMatch = this.gameStorage.getMatch();
      return;
    }
    const oldRound = this.gameStorage.getOldGlobalRoundNumber();
    if (oldRound !== null && oldRound > 0) {
      const match = {
        matchRoundNumber: oldRound,
        playerHealth: INITIAL_HEALTH,
        computerHealth: INITIAL_HEALTH,
        initialHealth: INITIAL_HEALTH,
        damagePerLoss: DAMAGE_PER_LOSS,
      };
      this.setMatch(match);
      this.gameStorage.removeOldGlobalRoundNumber();
      this.state.globalMatchNumber = 1;
      this.gameStorage.setGlobalMatchNumber(1);
    }
  }

  // ===== Health Methods =====

  getHealth(participant: Participant): Health {
    const match = this.state.currentMatch;
    if (!match) return null;
    const value = match[HEALTH_KEYS[participant]];
    return value !== undefined && value !== null ? value : null;
  }

  private getDamageAmount(
    isTie: boolean | "tara-tie",
    taraInPlay: boolean,
  ): number {
    if (isTie === "tara-tie") return DAMAGE_PER_TARA_TIE;
    if (isTie) return DAMAGE_PER_TIE;
    if (taraInPlay) return DAMAGE_PER_TARA_LOSS;
    return DAMAGE_PER_LOSS;
  }

  private decrementHealth(participant: Participant, damage: number): boolean {
    const match = this.state.currentMatch;
    if (!match) return false;
    const key = HEALTH_KEYS[participant];
    this.setMatch({ ...match, [key]: Math.max(0, (match[key] ?? 0) - damage) });
    return true;
  }

  private isDefeated(participant: Participant): boolean {
    const health = this.getHealth(participant);
    return health !== null && health <= 0;
  }
}
