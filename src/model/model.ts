export class Model {
  getScore(key: "player" | "computer"): number {
    return parseInt(localStorage.getItem(`${key}Score`) || "0", 10);
  }

  setScore(key: "player" | "computer", value: number): void {
    localStorage.setItem(`${key}Score`, value.toString());
  }
}
