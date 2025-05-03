import { GameState, Move } from "../utils/dataObjectUtils";
import { MOVES } from "../utils/dataUtils";

export class Model {
  private state: GameState = {
    scores: {
      player: 0,
      computer: 0,
    },
    moves: {
      player: "",
      computer: "",
    },
  };

  constructor() {
    this.state.scores.player = this.getScoreFromStorage("player");
    this.state.scores.computer = this.getScoreFromStorage("computer");
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

  getPlayerMove(): Move | "" {
    return this.state.moves.player;
  }

  resetMoves(): void {
    this.state.moves.player = "";
  }

  setComputerMove(move: Move) {
    this.state.moves.computer = move;
  }

  getComputerMove(): Move | "" {
    return this.state.moves.computer;
  }

  chooseComputerMove(): void {
    const randomIndex = Math.floor(Math.random() * MOVES.length);
    this.setComputerMove(MOVES[randomIndex]);
  }
}
