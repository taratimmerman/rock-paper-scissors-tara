export class Model {
  private state = {
    scores: {
      player: 0,
      computer: 0,
    },
    moves: {
      player: "",
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

  setPlayerMove(move: "rock" | "paper" | "scissors") {
    this.state.moves.player = move;
  }

  getPlayerMove(): string {
    return this.state.moves.player;
  }

  resetMoves(): void {
    this.state.moves.player = "";
  }
}
