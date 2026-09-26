import View from "../View";
import { IModal } from "../../components/modal/IModal";
import { IMenuView, MenuViewData } from "./IMenuView";
import { ThemePreference } from "../../storage/gameStorage";

export default class MenuView extends View<MenuViewData> implements IMenuView {
  protected declare _parentElement: HTMLElement;
  private readonly modal: IModal;
  // Cache the specific buttons
  private _startBtn?: HTMLButtonElement;
  private _resetBtn?: HTMLButtonElement;
  private _settingsBtn?: HTMLButtonElement;
  private _themePreferenceHandler?: (theme: ThemePreference) => void;

  constructor(modal: IModal) {
    super();
    this.modal = modal;
  }

  protected _generateMarkup(): string {
    const startText = this._data.isMatchActive
      ? "Continue Match"
      : "Start Match";

    return `
      <div class="menu-content">
        <h1 id="game-title" class="title-large">Rock Paper Scissors Tara</h1>
        <div class="menu-controls">
          <button id="start" class="btn-primary">${startText}</button>
          <button id="open-settings" class="btn-secondary">Settings</button>
          ${
            this._data.hasDataToReset
              ? '<button id="reset-game-state" class="btn-secondary">Reset Game State</button>'
              : ""
          }
        </div>
      </div>
    `;
  }

  private _ensureParentElement(): void {
    if (!this._parentElement || !document.body.contains(this._parentElement)) {
      this._parentElement = this._getElement("main-menu");
    }
  }

  public render(data: MenuViewData): void {
    this._ensureParentElement();
    super.render(data);

    // The reset control is conditional, so only the start control is required.
    this._startBtn = this._getElement<HTMLButtonElement>("start");
    this._resetBtn = document.getElementById(
      "reset-game-state",
    ) as HTMLButtonElement | undefined;
    this._settingsBtn = this._getElement<HTMLButtonElement>("open-settings");
  }

  // ===== Event Bindings (Much more efficient now) =====

  public bindStartMatch(handler: () => void): void {
    this._startBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      handler();
    });
  }

  public bindResetGame(handler: () => void): void {
    this._resetBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      this._showResetConfirmation(handler);
    });
  }

  public bindSettings(handler: () => void): void {
    this._settingsBtn?.addEventListener("click", (event) => {
      event.preventDefault();
      handler();
    });
  }

  public bindThemePreference(
    handler: (theme: ThemePreference) => void,
  ): void {
    this._themePreferenceHandler = handler;
  }

  public openSettings(): void {
    const options = [
      { value: "system", label: "System" },
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" },
    ] as const;
    const fieldset = document.createElement("fieldset");
    fieldset.className = "theme-options";
    const legend = document.createElement("legend");
    legend.textContent = "Color theme";
    fieldset.append(legend);

    let initialFocusElement: HTMLInputElement | undefined;
    options.forEach(({ value, label }) => {
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "theme-preference";
      input.id = `theme-${value}`;
      input.value = value;
      input.checked = this._data.themePreference === value;
      if (input.checked) initialFocusElement = input;
      input.addEventListener("change", () => {
        this._themePreferenceHandler?.(value);
      });

      const optionLabel = document.createElement("label");
      optionLabel.htmlFor = input.id;
      optionLabel.textContent = label;
      fieldset.append(input, optionLabel);
    });

    this.modal.open({
      title: "Settings",
      message: "Choose how the game looks.",
      actions: [],
      content: fieldset,
      initialFocusElement,
    });
  }

  public updateThemePreference(theme: ThemePreference): void {
    this._data.themePreference = theme;
    const selected = document.querySelector<HTMLInputElement>(
      `input[name="theme-preference"][value="${theme}"]`,
    );
    if (selected) selected.checked = true;
  }

  private _showResetConfirmation(onConfirm: () => void): void {
    this.modal.open({
      title: "Reset saved game data?",
      message:
        "This permanently clears your saved progress and statistics.",
      actions: [
        {
          id: "cancel",
          label: "Cancel",
          onSelect: () => {},
          variant: "secondary",
        },
        {
          id: "reset",
          label: "Reset Game State",
          onSelect: onConfirm,
          variant: "danger",
        },
      ],
      initialFocusActionId: "cancel",
    });
  }

  public toggleMenuVisibility(show: boolean): void {
    this._ensureParentElement();
    this._toggleVisibility(this._parentElement, show);
  }

  public updateMenu(data: Partial<MenuViewData>): void {
    this._data = { ...this._data, ...data };
    super.render(this._data);

    // Re-render because conditional controls may need to be added or removed.
    this._startBtn = this._getElement<HTMLButtonElement>("start");
    this._resetBtn = document.getElementById(
      "reset-game-state",
    ) as HTMLButtonElement | undefined;
    this._settingsBtn = this._getElement<HTMLButtonElement>("open-settings");
  }
}
