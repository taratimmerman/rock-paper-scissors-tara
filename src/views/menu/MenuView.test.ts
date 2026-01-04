/**
 * @jest-environment jsdom
 */
import menuView from "./MenuView";

describe("MenuView", () => {
  let container: HTMLElement;
  let startButton: HTMLButtonElement;
  let resetButton: HTMLButtonElement;

  beforeEach(() => {
    menuView.test_clearElement();

    document.body.innerHTML = `
      <section id="main-menu" class="menu-view"></section>
    `;

    menuView.render({ isMatchActive: false });

    container = document.getElementById("main-menu")!;
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

  describe("Accessibility Logic", () => {
    test("toggleMenuVisibility(false) sets aria-hidden, hidden class, and tabindex", () => {
      menuView.toggleMenuVisibility(false);

      expect(container.classList.contains("hidden")).toBe(true);
      expect(container.getAttribute("aria-hidden")).toBe("true");
      expect(container.getAttribute("tabindex")).toBe("-1");
    });

    test("toggleMenuVisibility(true) restores visibility and removes tabindex", () => {
      // SETUP: Start in a 'hidden' state with tabindex
      container.setAttribute("tabindex", "-1");
      container.classList.add("hidden");

      menuView.toggleMenuVisibility(true);

      expect(container.classList.contains("hidden")).toBe(false);
      expect(container.getAttribute("aria-hidden")).toBe("false");
      // PROOF: Verify it was actually removed
      expect(container.hasAttribute("tabindex")).toBe(false);
    });

    test("focus() shifts keyboard focus to the first button", () => {
      // Ensure the element is attached to document for focus tracking
      document.body.appendChild(container);

      menuView.render({ isMatchActive: false });
      menuView.focus();

      const startBtn = document.getElementById("start");
      expect(document.activeElement).toBe(startBtn);
    });
  });
});
