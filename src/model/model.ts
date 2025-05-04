import { GameState, Move } from "../utils/dataObjectUtils";
import { MOVES, MOVE_MAP, STANDARD_MOVES } from "../utils/dataUtils";

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
    roundNumber: 1,
  };

  constructor() {
    this.state.scores.player = this.getScoreFromStorage("player");
    this.state.scores.computer = this.getScoreFromStorage("computer");
    this.state.taras.player = this.getTaraCountFromStorage("player");
    this.state.taras.computer = this.getTaraCountFromStorage("computer");
    this.state.roundNumber = this.getRoundNumberFromStorage();
  }

  // ===== General Methods =====

  private doesMoveBeat(a: Move, b: Move): boolean {
    return MOVE_MAP.get(a)?.beats.includes(b) ?? false;
  }

  private handleRoundWin(
    winner: "player" | "computer",
    winningMove: Move
  ): void {
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

    this.handleTaraMove("player", playerMove);
    this.handleTaraMove("computer", computerMove);

    if (playerMove === computerMove) return "It's a tie!";

    if (this.doesMoveBeat(playerMove, computerMove)) {
      this.handleRoundWin("player", playerMove);
      return "You win!";
    } else {
      this.handleRoundWin("computer", computerMove);
      return "Computer wins!";
    }
  }

  // ===== Score Methods =====

  private getScoreFromStorage(key: "player" | "computer"): number {
    return parseInt(localStorage.getItem(`${key}Score`) || "0", 10);
  }

  getScore(key: "player" | "computer"): number {
    return this.state.scores[key];
  }

  setScore(key: "player" | "computer", value: number): void {
    this.state.scores[key] = value;
    localStorage.setItem(`${key}Score`, value.toString());
  }

  // ===== Move Methods =====

  private setMove(key: "player" | "computer", move: Move | null): void {
    this.state.moves[key] = move;
  }

  setPlayerMove(move: Move | null) {
    this.setMove("player", move);
  }

  getPlayerMove(): Move | null {
    return this.state.moves.player;
  }

  setComputerMove(move: Move | null) {
    this.setMove("computer", move);
  }

  getComputerMove(): Move | null {
    return this.state.moves.computer;
  }

  resetMoves(): void {
    this.setPlayerMove(null);
    this.setComputerMove(null);
  }

  chooseComputerMove(): void {
    const hasTara = this.getTaraCount("computer") > 0;
    const availableMoves = hasTara ? MOVES : STANDARD_MOVES;

    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    this.setComputerMove(availableMoves[randomIndex].name);
  }

  private isStandardMove(move: Move): boolean {
    return move !== "tara";
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

  // ===== Tara Methods =====

  private getTaraCountFromStorage(key: "player" | "computer"): number {
    return parseInt(localStorage.getItem(`${key}TaraCount`) || "0", 10);
  }

  private decrementTaraCount(key: "player" | "computer"): void {
    const current = this.getTaraCount(key);
    if (current > 0) this.setTaraCount(key, current - 1);
  }

  private handleTaraMove(key: "player" | "computer", move: Move): void {
    if (move === "tara") {
      const currentTara = this.getTaraCount(key);
      if (currentTara > 0) {
        this.decrementTaraCount(key);
      } else {
        this.setMove(key, "rock");
      }
    }
  }

  getTaraCount(key: "player" | "computer"): number {
    return this.state.taras[key];
  }

  setTaraCount(key: "player" | "computer", value: number): void {
    this.state.taras[key] = value;
    localStorage.setItem(`${key}TaraCount`, value.toString());
  }

  taraIsEnabled(): boolean {
    return this.getTaraCount("player") > 0;
  }
}
