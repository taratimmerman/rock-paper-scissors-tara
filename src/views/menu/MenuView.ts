import View from "../View";
import { IMenuView, MenuViewData } from "./IMenuView";

class MenuView extends View<MenuViewData> implements IMenuView {
  protected declare _parentElement: HTMLElement;
  // Cache the specific buttons
  private _startBtn?: HTMLButtonElement;
  private _resetBtn?: HTMLButtonElement;

  protected _generateMarkup(): string {
    const startText = this._data.isMatchActive
      ? "Continue Match"
      : "Start Match";

    return `
      <div class="menu-content">
        <h1 id="game-title" class="title-large">Rock Paper Scissors Tara</h1>
        <div class="menu-controls">
          <button id="start" class="btn-primary">${startText}</button>
          <button id="reset-game-state" class="btn-secondary">Reset Game State</button>
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

    // Cache the elements immediately after they are injected into the DOM
    this._startBtn = this._getElement<HTMLButtonElement>("start");
    this._resetBtn = this._getElement<HTMLButtonElement>("reset-game-state");
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
      handler();
    });
  }

  public toggleMenuVisibility(show: boolean): void {
    this._ensureParentElement();
    this._toggleVisibility(this._parentElement, show);
  }

  public updateMenu(data: Partial<MenuViewData>): void {
    this._data = { ...this._data, ...data };
    this.update(this._data);

    // After an update, re-cache in case elements were replaced
    this._startBtn = this._getElement<HTMLButtonElement>("start");
    this._resetBtn = this._getElement<HTMLButtonElement>("reset-game-state");
  }
}

export default new MenuView();
