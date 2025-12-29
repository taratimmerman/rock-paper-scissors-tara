/**
 * @jest-environment jsdom
 */
import progressView from "./ProgressView";

describe("ProgressView", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section id="game-progress-container">
        <h1 id="match"></h1>
        <h2 id="round"></h2>
      </section>
    `;
  });

  test("updates text content correctly", () => {
    progressView.updateProgress({
      matchNumber: 1,
      roundNumber: 5,
      isVisible: true,
    });

    expect(document.getElementById("match")?.textContent).toBe("Match 1");
    expect(document.getElementById("round")?.textContent).toBe("Round 5");
  });

  test("toggles visibility of the container", () => {
    const container = document.getElementById("game-progress-container")!;

    progressView.updateProgress({
      matchNumber: 1,
      roundNumber: 1,
      isVisible: false,
    });
    expect(container.classList.contains("hidden")).toBe(true);

    progressView.updateProgress({
      matchNumber: 1,
      roundNumber: 1,
      isVisible: true,
    });
    expect(container.classList.contains("hidden")).toBe(false);
  });
});
