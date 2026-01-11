import View from "../View";
import { Move } from "../../utils/dataObjectUtils";
import { ControlsViewData, IControlsView } from "./IControlsView";

export default class ControlsView
  extends View<ControlsViewData>
  implements IControlsView
{
  protected declare _parentElement: HTMLElement;
  private _moveHandler?: (move: Move) => void;
  private _nextRoundHandler?: () => void;

  public render(data: ControlsViewData): void {
    this._parentElement = this._getElement<HTMLElement>("game-controls");
    super.render(data);
    this._setupListeners();
  }

  // ControlsView.ts
  protected _generateMarkup(): string {
    const { playerMove, isMatchOver, moves, taraIsEnabled } = this._data;

    if (!playerMove) {
      return `
      <div id="choices" role="group" aria-label="Select your move">
        ${moves
          .map((move) => {
            const disabled = move.id === "tara" && !taraIsEnabled;
            return `
            <button id="${move.id}" class="card-button" ${
              disabled ? "disabled" : ""
            }>
              <div class="card-inner">
                <div class="card-back">BACK</div>
                <div class="card-front">
                  <span class="icon" aria-hidden="true">${move.icon}</span>
                  <span class="label">${move.text}</span>
                </div>
              </div>
            </button>`;
          })
          .join("")}
      </div>`;
    }

    return `
    <div id="progression-zone" aria-live="polite">
      <button id="play-again" class="btn-primary">
        ${isMatchOver ? "Start New Match" : "Next Round"}
      </button>
    </div>`;
  }

  public toggleVisibility(show: boolean): void {
    if (!this._parentElement) {
      this._parentElement = this._getElement<HTMLElement>("game-controls");
    }
    this._toggleVisibility(this._parentElement, show);
  }

  public bindPlayerMove(handler: (move: Move) => void) {
    this._moveHandler = handler;
  }
  public bindNextRound(handler: () => void) {
    this._nextRoundHandler = handler;
  }

  private _setupListeners(): void {
    this._parentElement.onclick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const moveBtn = target.closest(".card-button");
      const nextBtn = target.closest("#play-again");

      if (moveBtn && this._moveHandler) this._moveHandler(moveBtn.id as Move);
      if (nextBtn && this._nextRoundHandler) this._nextRoundHandler();
    };
  }
}
