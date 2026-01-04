/**
 * @jest-environment jsdom
 */
import ScoreView from "./ScoreView";

describe("ScoreView", () => {
  let view: ScoreView;

  beforeEach(() => {
    // Mimic the actual index.html structure
    document.body.innerHTML = `
      <section id="game-stats">
        <span id="player-score">00</span>
        <span id="computer-score">00</span>
      </section>
    `;

    view = new ScoreView();
    // This now safely assigns the parent without wiping the HTML
    view.render();
  });

  test("updates scores with padding to match your HTML style (00)", () => {
    view.updateScores(5, 12);

    expect(document.getElementById("player-score")?.textContent).toBe("05");
    expect(document.getElementById("computer-score")?.textContent).toBe("12");
  });

  describe("updateScores", () => {
    test("updates the text content of score elements correctly", () => {
      // Act
      view.updateScores(10, 5);

      // Assert
      const playerEl = document.getElementById("player-score");
      const computerEl = document.getElementById("computer-score");

      expect(playerEl?.textContent).toBe("10");
      expect(computerEl?.textContent).toBe("05");
    });

    test("handles zero values correctly", () => {
      view.updateScores(0, 0);

      expect(document.getElementById("player-score")?.textContent).toBe("00");
      expect(document.getElementById("computer-score")?.textContent).toBe("00");
    });

    test("throws an error if the DOM elements are missing", () => {
      // Clear the DOM to simulate a broken state
      document.body.innerHTML = "";

      // Wrap in a function to test the error throw from _getElement
      expect(() => {
        view.updateScores(1, 1);
      }).toThrow("Element #player-score not found.");
    });
  });
});
