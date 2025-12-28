/**
 * @jest-environment jsdom
 */
import statsView from "./StatsView";

describe("StatsView", () => {
  let parentElement: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="game-stats">
      </div>
    `;

    parentElement = document.getElementById("game-stats")!;
  });

  test("toggleGameStatsVisibility() hides and shows the game stats element", () => {
    statsView.toggleGameStatsVisibility(false); // Toggle again

    expect(parentElement.classList.contains("hidden")).toBe(true);

    statsView.toggleGameStatsVisibility(true);
    expect(parentElement.classList.contains("hidden")).toBe(false);
  });
});
