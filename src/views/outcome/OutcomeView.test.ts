/**
 * @jest-environment jsdom
 */
import outcomeView from "./OutcomeView";

describe("OutcomeView", () => {
  const mockData = {
    isMatchOver: false,
  };

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="result-display" class="hidden"></div>
    `;
  });

  test("render() populates result display", () => {
    outcomeView.render(mockData);

    // Check internal display
    const resultDisplay = document.getElementById("result-display")!;
    expect(resultDisplay.innerHTML).toContain("Next Round");
  });

  test("updateOutcome() toggles button text when match ends", () => {
    outcomeView.render(mockData);
    const btn = document.getElementById("play-again")!;
    expect(btn.textContent).toBe("Next Round");

    // Update to match over state
    outcomeView.updateOutcome({
      isMatchOver: true,
    });

    expect(btn.textContent).toBe("Start New Match");
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
