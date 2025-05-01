export class Model {
  getScore(key: "player" | "computer"): number {
    return parseInt(localStorage.getItem(`${key}Score`) || "0", 10);
  }
}
