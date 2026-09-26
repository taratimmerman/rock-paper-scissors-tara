/**
 * @jest-environment jsdom
 */
import MenuView from "./MenuView";
import { IModal, ModalOptions } from "../../components/modal/IModal";

describe("MenuView", () => {
  let view: MenuView;
  let container: HTMLElement;
  let modal: jest.Mocked<IModal>;

  const getStartBtn = () =>
    document.getElementById("start") as HTMLButtonElement;
  const getResetBtn = () =>
    document.getElementById("reset-game-state") as HTMLButtonElement;
  const getSettingsBtn = () =>
    document.getElementById("open-settings") as HTMLButtonElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <section id="main-menu" class="menu-view"></section>
    `;
    container = document.getElementById("main-menu")!;

    modal = { open: jest.fn(), close: jest.fn() };
    view = new MenuView(modal);

    view.render({
      isMatchActive: false,
      hasDataToReset: true,
      themePreference: "system",
    });
  });

  describe("Rendering Logic", () => {
    test("sets correct text for 'Start' vs 'Continue'", () => {
      expect(getStartBtn().textContent?.trim()).toBe("Start Match");

      view.updateMenu({ isMatchActive: true });
      expect(getStartBtn().textContent?.trim()).toBe("Continue Match");
    });

    test("renders reset button when there is data to reset", () => {
      expect(getResetBtn()).toBeTruthy();
    });

    test("places Settings between Start and Reset Game State", () => {
      const buttonIds = Array.from(
        container.querySelectorAll<HTMLButtonElement>(".menu-controls button"),
      ).map((button) => button.id);

      expect(buttonIds).toEqual(["start", "open-settings", "reset-game-state"]);
    });

    test("does not render reset button when there is no data to reset", () => {
      view.updateMenu({ hasDataToReset: false });

      expect(document.getElementById("reset-game-state")).toBeNull();
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

      expect(handler).not.toHaveBeenCalled();
      expect(modal.open).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.any(String),
          actions: expect.arrayContaining([
            expect.objectContaining({ id: "cancel" }),
            expect.objectContaining({ id: "reset" }),
          ]),
          initialFocusActionId: "cancel",
        }),
      );

      const options = modal.open.mock.calls[0][0] as ModalOptions;
      options.actions.find((action) => action.id === "reset")?.onSelect();
      expect(handler).toHaveBeenCalledTimes(1);
    });

    test("emits Settings clicks and theme preference changes", () => {
      const settingsHandler = jest.fn();
      const themeHandler = jest.fn();
      view.bindSettings(settingsHandler);
      view.bindThemePreference(themeHandler);

      getSettingsBtn().click();
      expect(settingsHandler).toHaveBeenCalledTimes(1);

      view.openSettings();
      const options = modal.open.mock.calls[0][0] as ModalOptions;
      const darkOption =
        options.content?.querySelector<HTMLInputElement>("#theme-dark");
      expect(options.title).toBe("Settings");
      expect(options.content?.tagName).toBe("FIELDSET");

      if (!darkOption) throw new Error("Dark theme option was not rendered");
      darkOption.checked = true;
      darkOption.dispatchEvent(new Event("change", { bubbles: true }));
      expect(themeHandler).toHaveBeenCalledWith("dark");
    });
  });
});
