import View from "../View";
import { IMoveView, MoveViewData } from "./IMoveView";
import { Move } from "../../utils/dataObjectUtils";
import { MOVES } from "../../utils/dataUtils";

class MoveView extends View<MoveViewData> implements IMoveView {
  protected declare _parentElement: HTMLElement;
  private _moveHandler?: (move: Move) => void;

  // ===== General Methods =====

  protected _generateMarkup(): string {
    const { moves, taraIsEnabled } = this._data;

    return moves
      .map((move) => {
        const isDisabled = move.id === MOVES.TARA && !taraIsEnabled;

        return `
        <button id="${move.id}" class="card-container" ${
          isDisabled ? "disabled" : ""
        }>
          <span class="icon" aria-hidden="true">${move.icon}</span>
          <span class="label">${move.text}</span>
        </button>
      `;
      })
      .join("");
  }

  public toggleMoveButtons(show: boolean): void {
    // Late assignment check in case toggle is called before render
    if (!this._parentElement) this._parentElement = this._getElement("choices");
    this._toggleVisibility(this._parentElement, show);
  }

  // ===== Move Methods =====

  public render(data: MoveViewData): void {
    this._parentElement = this._getElement<HTMLElement>("choices");

    super.render(data);

    this._setupListeners();
  }

  public bindPlayerMove(handler: (move: Move) => void): void {
    this._moveHandler = handler;
  }

  public updateTaraButton(isEnabled: boolean): void {
    this._data = { ...this._data, taraIsEnabled: isEnabled };
    this.update(this._data);
  }

  private _setupListeners(): void {
    this._parentElement.onclick = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest(".card-container");
      if (!btn || !this._moveHandler) return;

      this._moveHandler(btn.id as Move);
    };
  }
}

export default new MoveView();
