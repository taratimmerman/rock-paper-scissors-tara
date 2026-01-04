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

  protected _generateMarkup(): string {
    const { playerMove, isMatchOver, moves, taraIsEnabled } = this._data;

    // STATE A: Waiting for Player Selection
    if (!playerMove) {
      return `
        <div id="choices" role="group" aria-label="Select your move">
          ${moves
            .map((move) => {
              const disabled = move.id === "tara" && !taraIsEnabled;
              return `
              <button id="${move.id}" class="card-container" ${
                disabled ? "disabled" : ""
              }>
                <span class="icon" aria-hidden="true">${move.icon}</span>
                <span class="label">${move.text}</span>
              </button>`;
            })
            .join("")}
        </div>`;
    }

    // STATE B: Round/Match Over - Progression
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
      const moveBtn = target.closest(".card-container");
      const nextBtn = target.closest("#play-again");

      if (moveBtn && this._moveHandler) this._moveHandler(moveBtn.id as Move);
      if (nextBtn && this._nextRoundHandler) this._nextRoundHandler();
    };
  }
}
