/**
 * @jest-environment jsdom
 */
import outcomeView from "./OutcomeView";

describe("OutcomeView", () => {
  const mockData = {
    resultMessage: "YOU WIN!",
    isMatchOver: false,
    roundNumber: 1,
    matchNumber: 1,
  };

  beforeEach(() => {
    document.body.innerHTML = `
      <h1 id="match" class="hidden"></h1>
      <h2 id="round" class="hidden"></h2>
      <div id="result-display" class="hidden"></div>
    `;
  });

  test("render() populates result display", () => {
    outcomeView.render(mockData);

    // Check internal display
    const resultDisplay = document.getElementById("result-display")!;
    expect(resultDisplay.innerHTML).toContain("YOU WIN!");
    expect(resultDisplay.innerHTML).toContain("Next Round");
  });

  test("updateOutcome() toggles button text when match ends", () => {
    outcomeView.render(mockData);
    const btn = document.getElementById("play-again")!;
    expect(btn.textContent).toBe("Next Round");

    // Update to match over state
    outcomeView.updateOutcome({
      isMatchOver: true,
      resultMessage: "PLAYER WON THE MATCH!",
    });

    expect(btn.textContent).toBe("Start New Match");
    expect(document.getElementById("round-result")!.textContent).toBe(
      "PLAYER WON THE MATCH!"
    );
  });

  test("updateOutcome() preserves existing data when only partial data is provided", () => {
    outcomeView.render(mockData);

    // Update ONLY the result message
    outcomeView.updateOutcome({ resultMessage: "SUDDEN DEATH!" });
    const resultEl = document.getElementById("round-result")!;

    // Move data should still be there from the initial render
    expect(resultEl.textContent).toBe("SUDDEN DEATH!");
  });

  test("bindPlayAgain() triggers handler on button click", () => {
    const handler = jest.fn();
    outcomeView.render(mockData);
    outcomeView.bindPlayAgain(handler);

    const btn = document.getElementById("play-again")!;
    btn.click();

    expect(handler).toHaveBeenCalledTimes(1);
  });

  test("toggleOutcomeVisibility() controls the result container", () => {
    outcomeView.render(mockData);
    const container = document.getElementById("result-display")!;

    outcomeView.toggleOutcomeVisibility(false);
    expect(container.classList.contains("hidden")).toBe(true);

    outcomeView.toggleOutcomeVisibility(true);
    expect(container.classList.contains("hidden")).toBe(false);
  });
});
