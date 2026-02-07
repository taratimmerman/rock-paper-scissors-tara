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
  ALL_MOVE_NAMES,
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
    globalMatchNumber: null,
    currentMatch: null,
  };
  private gameStorage: IGameStorage;

  constructor(gameStorage: IGameStorage = new LocalStorageGameStorage()) {
    this.gameStorage = gameStorage;

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

    // Sync effective moves
    playerMove = this.getPlayerMove();
    computerMove = this.getComputerMove();

    // Calculate damage context once
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
    weights: Record<Move, number>,
  ): Move {
    const weightedPool = moves.flatMap((move) =>
      Array(weights[move]).fill(move),
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
    const current = this.getRoundNumber();
    this.setRoundNumber(current + 1);
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

  private taraInPlay(): boolean {
    const playerMove = this.getPlayerMove();
    const computerMove = this.getComputerMove();

    if (this.isTie() === "tara-tie") return true;

    return playerMove === MOVES.TARA || computerMove === MOVES.TARA;
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
    if (
      this.isMatchOver() &&
      this.getHealth(PARTICIPANTS.PLAYER) === 0 &&
      this.getHealth(PARTICIPANTS.COMPUTER) === 0
    ) {
      return true;
    }
    return false;
  }

  setMatch(match: Match | null): void {
    this.state.currentMatch = match;
    this.gameStorage.setMatch(match);
  }

  setMatchNumber(matchNumber: number | null): void {
    this.state.globalMatchNumber = matchNumber;
    this.gameStorage.setGlobalMatchNumber(matchNumber);
  }

  /**
   * Sets default match data if no match is currently active.
   *
   * Used as a fallback when no match data is loaded (e.g., from `_loadOrMigrateMatchState()`).
   * Does not overwrite existing match state.
   */
  setDefaultMatchData(): void {
    const isMatchActive = this.isMatchActive();

    if (!isMatchActive) {
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
    const currentMatchNumber = this.getMatchNumber();
    this.setMatchNumber(currentMatchNumber + 1);
  }

  /**
   * Initializes the game state based on available storage.
   *
   * This method is called during Model construction. It checks for:
   * - A valid saved match (loads it and skips migration),
   * - An old-format global round number (migrates it into a new match),
   * - Or no valid data (leaves currentMatch unset).
   *
   * It also ensures the global match number is set appropriately.
   */
  private _loadOrMigrateMatchState(): void {
    if (this.isMatchActive()) {
      this._loadExistingMatchState();
      return;
    }

    const oldGlobalRoundNumber = this.gameStorage.getOldGlobalRoundNumber();

    if (oldGlobalRoundNumber !== null && oldGlobalRoundNumber > 0) {
      this._migrateOldData(oldGlobalRoundNumber);
    }
    // Otherwise: no migration, and no existing match — do nothing.
  }

  /**
   * Loads state for an existing match stored in the new format.
   */
  private _loadExistingMatchState(): void {
    this.state.globalMatchNumber = this.gameStorage.getGlobalMatchNumber();
    this.state.currentMatch = this.gameStorage.getMatch();
  }

  /**
   * Migrates match state from an older game version to the current format.
   *
   * @param oldRoundNumber - The round number from the old game format.
   */
  private _migrateOldData(oldRoundNumber: number): void {
    const migratedMatch = {
      matchRoundNumber: oldRoundNumber,
      playerHealth: INITIAL_HEALTH,
      computerHealth: INITIAL_HEALTH,
      initialHealth: INITIAL_HEALTH,
      damagePerLoss: DAMAGE_PER_LOSS,
    };

    this.setMatch(migratedMatch);
    this.gameStorage.removeOldGlobalRoundNumber();

    this.state.globalMatchNumber = 1;
    this.gameStorage.setGlobalMatchNumber(this.state.globalMatchNumber);
  }

  // ===== Health Methods =====

  private getHealthKey(participant: Participant): keyof Match {
    return HEALTH_KEYS[participant];
  }

  getHealth(participant: Participant): Health {
    const match = this.state.currentMatch;
    if (!match) return null;

    const key = this.getHealthKey(participant);
    const value = match[key];

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

    const key = this.getHealthKey(participant);

    const updatedMatch = {
      ...match,
      [key]: Math.max(0, (match[key] ?? 0) - damage),
    };

    this.setMatch(updatedMatch);
    return true;
  }

  private isDefeated(participant: Participant): boolean {
    const health = this.getHealth(participant);
    return health !== null && health <= 0;
  }

  // ===== END OF CLASS =====
}
