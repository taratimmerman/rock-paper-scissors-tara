/**
 * @jest-environment jsdom
 */
import { MOVES } from "../../utils/dataUtils";
import StatsView from "./StatsView";

describe("StatsView", () => {
  let view: StatsView;

  beforeEach(() => {
    // Scaffold the full expected DOM for all StatsView methods
    document.body.innerHTML = `
      <section id="game-stats">
        <aside id="player-stats">
          <span id="player-score">00</span>
          <div id="player-health"></div>
          <span id="player-tara">0</span>
          <span id="player-most-common-move">–</span>
        </aside>
        
        <section id="game-progress-container">
          <h2 id="match"></h2>
          <h3 id="round"></h3>
        </section>
        
        <aside id="computer-stats">
          <span id="computer-score">00</span>
          <div id="computer-health"></div>
          <span id="computer-tara">0</span>
          <span id="computer-most-common-move">–</span>
        </aside>
      </section>
    `;

    view = new StatsView();

    // In StatsView, render() just hooks up the _parentElement
    view.render();
  });

  describe("toggleGameStatsVisibility()", () => {
    test("adds or removes the hidden class on the main stats container", () => {
      const statsContainer = document.getElementById("game-stats")!;

      view.toggleGameStatsVisibility(false);
      expect(statsContainer.classList.contains("hidden")).toBe(true);

      view.toggleGameStatsVisibility(true);
      expect(statsContainer.classList.contains("hidden")).toBe(false);
    });
  });

  describe("updateProgress()", () => {
    test("updates text content while preserving DOM nodes", () => {
      const matchText = document.getElementById("match")!;
      const roundText = document.getElementById("round")!;

      // Store current references to check persistence
      const oldMatchRef = matchText;

      view.updateProgress(2, 5, true);

      expect(matchText.textContent).toBe("Match 2");
      expect(roundText.textContent).toBe("Round 5");

      // Verify node persistence (no innerHTML wiping)
      expect(document.getElementById("match")).toBe(oldMatchRef);
    });

    test("toggles visibility of the progress container", () => {
      const progressContainer = document.getElementById(
        "game-progress-container",
      )!;

      view.updateProgress(1, 1, false);
      expect(progressContainer.classList.contains("hidden")).toBe(true);

      view.updateProgress(1, 1, true);
      expect(progressContainer.classList.contains("hidden")).toBe(false);
    });
  });

  describe("updateHealthBar()", () => {
    test("updates the inline width style of the player health bar", () => {
      view.updateHealthBar("player", 75);
      const playerHealth = document.getElementById("player-health")!;
      expect(playerHealth.style.width).toBe("75%");
    });

    test("updates the inline width style of the computer health bar", () => {
      view.updateHealthBar("computer", 40);
      const computerHealth = document.getElementById("computer-health")!;
      expect(computerHealth.style.width).toBe("40%");
    });
  });

  describe("updateMostCommonMoves()", () => {
    test("updates text content for both participants", () => {
      view.updateMostCommonMoves(MOVES.ROCK, MOVES.PAPER);
      expect(
        document.getElementById("player-most-common-move")!.textContent,
      ).toBe(MOVES.ROCK);
      expect(
        document.getElementById("computer-most-common-move")!.textContent,
      ).toBe(MOVES.PAPER);
    });

    test("defaults to 'N/A' if null is passed", () => {
      view.updateMostCommonMoves(null, null);
      expect(
        document.getElementById("player-most-common-move")!.textContent,
      ).toBe("N/A");
      expect(
        document.getElementById("computer-most-common-move")!.textContent,
      ).toBe("N/A");
    });
  });

  describe("updateScores()", () => {
    test("pads single-digit scores with a leading zero", () => {
      view.updateScores(5, 9);
      expect(document.getElementById("player-score")!.textContent).toBe("05");
      expect(document.getElementById("computer-score")!.textContent).toBe("09");
    });

    test("does not pad double-digit scores", () => {
      view.updateScores(12, 10);
      expect(document.getElementById("player-score")!.textContent).toBe("12");
      expect(document.getElementById("computer-score")!.textContent).toBe("10");
    });
  });

  describe("updateTaraCounts()", () => {
    test("updates text content with the correct counts", () => {
      view.updateTaraCounts(3, 1);
      expect(document.getElementById("player-tara")!.textContent).toBe("3");
      expect(document.getElementById("computer-tara")!.textContent).toBe("1");
    });
  });
});
