/**
 * @jest-environment jsdom
 */
import menuView from "./MenuView";

describe("MenuView", () => {
  let container: HTMLElement;
  let startButton: HTMLButtonElement;
  let resetButton: HTMLButtonElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <section id="initial-controls"></section>
    `;

    menuView.render({ isMatchActive: false });

    container = document.getElementById("initial-controls")!;
    startButton = document.getElementById("start") as HTMLButtonElement;
    resetButton = document.getElementById(
      "reset-game-state"
    ) as HTMLButtonElement;

    (menuView as any)._parentElement = container;
  });

  describe("Rendering Logic", () => {
    test("sets correct text for 'Start' vs 'Continue'", () => {
      expect(startButton.textContent).toBe("Start Match");

      menuView.updateMenu({ isMatchActive: true });
      expect(startButton.textContent).toBe("Continue Match");
    });

    test("always ensures reset button is present", () => {
      expect(resetButton).toBeTruthy();
    });
  });

  describe("Visibility & State", () => {
    test("controls CSS hidden class", () => {
      menuView.toggleMenuVisibility(false);
      expect(container.classList.contains("hidden")).toBe(true);

      menuView.toggleMenuVisibility(true);
      expect(container.classList.contains("hidden")).toBe(false);
    });
  });

  describe("Interaction Bindings", () => {
    test("triggers 'Start' handler on click", () => {
      const handler = jest.fn();
      menuView.bindStartMatch(handler);

      startButton.click();
      expect(handler).toHaveBeenCalled();
    });

    test("triggers 'Reset' handler on click", () => {
      const handler = jest.fn();
      menuView.bindResetGame(handler);

      resetButton.click();
      expect(handler).toHaveBeenCalled();
    });
  });
});
