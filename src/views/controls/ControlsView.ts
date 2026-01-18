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
  // Track visual state to prevent markup-regressions during render
  private _isFaceUp: boolean = false;

  public render(data: ControlsViewData): void {
    this._parentElement = this._getElement<HTMLElement>("game-controls");
    super.render(data);
    this._setupListeners();
  }

  /**
   * Orchestrates the 3D flip for all choice cards.
   * @param faceUp - True to show icons, False to show "BACK"
   */
  public async flipAll(faceUp: boolean): Promise<void> {
    this._isFaceUp = faceUp;
    const cards = this._parentElement.querySelectorAll(".card-inner");

    if (cards.length === 0) return;

    // Read 'offsetHeight' to force the browser to paint the cards
    // in their current state (visible but 0deg) BEFORE we add the class.
    // This ensures the transition actually runs.
    const _forceReflow = (cards[0] as HTMLElement).offsetHeight;

    cards.forEach((card) => {
      faceUp
        ? card.classList.add("is-flipped")
        : card.classList.remove("is-flipped");
    });

    // Wait for the transition
    await this._waitForAnimation(cards[0] as HTMLElement);
  }

  protected _generateMarkup(): string {
    const { playerMove, isMatchOver, moves, taraIsEnabled } = this._data;

    if (!playerMove) {
      return `
      <div id="choices" role="group" aria-label="Select your move">
        ${moves
          .map((move) => {
            const disabled = move.id === "tara" && !taraIsEnabled;
            // Maintain current flip state during re-renders
            const flipClass = this._isFaceUp ? "is-flipped" : "";

            return `
            <button id="${move.id}" class="card-button" ${
              disabled ? "disabled" : ""
            }>
              <div class="card-inner ${flipClass}">
                <div class="card-back player-theme"></div>
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
