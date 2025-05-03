import { GameState, Move } from "../utils/dataObjectUtils";
import { MOVES, MOVE_MAP } from "../utils/dataUtils";

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
    roundNumber: 1,
  };

  constructor() {
    this.state.scores.player = this.getScoreFromStorage("player");
    this.state.scores.computer = this.getScoreFromStorage("computer");
    this.state.roundNumber = this.getRoundNumberFromStorage();
  }

  // ===== General Methods =====

  doesMoveBeat(a: Move, b: Move): boolean {
    return MOVE_MAP.get(a)?.beats.includes(b) ?? false;
  }

  evaluateRound(): string {
    const playerMove = this.getPlayerMove();
    const computerMove = this.getComputerMove();

    if (playerMove === null || computerMove === null) return "Invalid round";
    if (playerMove === computerMove) return "It's a tie!";

    if (this.doesMoveBeat(playerMove, computerMove)) {
      this.setScore("player", this.getScore("player") + 1);
      return "You win!";
    } else {
      this.setScore("computer", this.getScore("computer") + 1);
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

  setPlayerMove(move: Move) {
    this.state.moves.player = move;
  }

  getPlayerMove(): Move | null {
    return this.state.moves.player;
  }

  resetMoves(): void {
    this.state.moves.player = null;
    this.state.moves.computer = null;
  }

  setComputerMove(move: Move) {
    this.state.moves.computer = move;
  }

  getComputerMove(): Move | null {
    return this.state.moves.computer;
  }

  chooseComputerMove(): void {
    const randomIndex = Math.floor(Math.random() * MOVES.length);
    this.setComputerMove(MOVES[randomIndex].name);
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
}
