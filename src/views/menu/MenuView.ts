import View from "../View";
import { IModal } from "../../components/modal/IModal";
import { IMenuView, MenuViewData } from "./IMenuView";

export default class MenuView extends View<MenuViewData> implements IMenuView {
  protected declare _parentElement: HTMLElement;
  private readonly modal: IModal;
  // Cache the specific buttons
  private _startBtn?: HTMLButtonElement;
  private _resetBtn?: HTMLButtonElement;

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
  }
}
