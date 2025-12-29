/**
 * @jest-environment jsdom
 */
import progressView from "./ProgressView";

describe("ProgressView", () => {
  let container: HTMLElement;
  let matchText: HTMLElement;
  let roundText: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <section id="game-progress-container"></section>
    `;

    // 1. Initial Render to create the elements
    progressView.render({
      matchNumber: 1,
      roundNumber: 1,
      isVisible: true,
    });

    // 2. Capture the references now that they exist
    container = document.getElementById("game-progress-container")!;
    matchText = document.getElementById("match")!;
    roundText = document.getElementById("round")!;

    // Force re-link parent for the singleton
    (progressView as any)._parentElement = container;
  });

  describe("render()", () => {
    test("initially injects the markup into the container", () => {
      expect(matchText.textContent).toBe("Match 1");
      expect(roundText.textContent).toBe("Round 1");
    });
  });

  describe("update()", () => {
    test("updates text content while preserving DOM nodes (Patching)", () => {
      // Store current references to check persistence
      const oldMatchRef = matchText;

      progressView.update({ matchNumber: 2, roundNumber: 5, isVisible: true });

      // Use the variables directly instead of document.getElementById
      expect(matchText.textContent).toBe("Match 2");
      expect(roundText.textContent).toBe("Round 5");

      // Verify node persistence
      expect(matchText).toBe(oldMatchRef);
    });

    test("toggles visibility via the update lifecycle", () => {
      progressView.update({ matchNumber: 1, roundNumber: 1, isVisible: false });
      expect(container.classList.contains("hidden")).toBe(true);

      progressView.update({ matchNumber: 1, roundNumber: 1, isVisible: true });
      expect(container.classList.contains("hidden")).toBe(false);
    });
  });
});
