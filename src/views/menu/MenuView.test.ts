/**
 * @jest-environment jsdom
 */
import MenuView from "./MenuView";

describe("MenuView", () => {
  let view: MenuView;
  let container: HTMLElement;

  const getStartBtn = () =>
    document.getElementById("start") as HTMLButtonElement;
  const getResetBtn = () =>
    document.getElementById("reset-game-state") as HTMLButtonElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <section id="main-menu" class="menu-view"></section>
    `;
    container = document.getElementById("main-menu")!;

    view = new MenuView();

    view.render({ isMatchActive: false });
  });

  describe("Rendering Logic", () => {
    test("sets correct text for 'Start' vs 'Continue'", () => {
      expect(getStartBtn().textContent?.trim()).toBe("Start Match");

      view.updateMenu({ isMatchActive: true });
      expect(getStartBtn().textContent?.trim()).toBe("Continue Match");
    });

    test("always ensures reset button is present", () => {
      expect(getResetBtn()).toBeTruthy();
    });
  });

  describe("Visibility & State", () => {
    test("controls CSS hidden class", () => {
      view.toggleMenuVisibility(false);
      expect(container.classList.contains("hidden")).toBe(true);

      view.toggleMenuVisibility(true);
      expect(container.classList.contains("hidden")).toBe(false);
    });
  });

  describe("Interaction Bindings", () => {
    test("triggers 'Start' handler on click", () => {
      const handler = jest.fn();
      view.bindStartMatch(handler);

      getStartBtn().click();
      expect(handler).toHaveBeenCalled();
    });

    test("triggers 'Reset' handler on click", () => {
      const handler = jest.fn();
      view.bindResetGame(handler);

      getResetBtn().click();
      expect(handler).toHaveBeenCalled();
    });
  });

  describe("Accessibility Logic", () => {
    test("toggleMenuVisibility(false) sets aria-hidden, hidden class, and tabindex", () => {
      view.toggleMenuVisibility(false);

      expect(container.classList.contains("hidden")).toBe(true);
      expect(container.getAttribute("aria-hidden")).toBe("true");
      expect(container.getAttribute("tabindex")).toBe("-1");
    });

    test("focus() shifts keyboard focus to the first button", () => {
      view.focus();
      expect(document.activeElement).toBe(getStartBtn());
    });
  });
});
