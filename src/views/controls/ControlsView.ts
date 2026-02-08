import View from "../View";
import { Move } from "../../utils/dataObjectUtils";
import { ControlsViewData, IControlsView } from "./IControlsView";

export default class ControlsView
  extends View<ControlsViewData>
  implements IControlsView
{
  declare protected _parentElement: HTMLElement;
  private _moveHandler?: (move: Move) => void;
  private _isFaceUp: boolean = false;

  public render(data: ControlsViewData): void {
    this._parentElement = this._getElement<HTMLElement>("game-controls");
    super.render(data);
    this._setupListeners();
  }

  /**
   * Orchestrates the 3D flip for all choice cards.
   */
  public async flipAll(faceUp: boolean): Promise<void> {
    this._isFaceUp = faceUp;
    const cards = this._parentElement.querySelectorAll(".card-inner");

    if (cards.length === 0) return;

    this._parentElement.classList.toggle("interaction-locked", !faceUp);

    // Force reflow to ensure transition runs correctly
    const _forceReflow = (cards[0] as HTMLElement).offsetHeight;

    cards.forEach((card) => {
      faceUp
        ? card.classList.add("is-flipped")
        : card.classList.remove("is-flipped");
    });

    await this._waitForAnimation(cards[0] as HTMLElement);
  }

  protected _generateMarkup(): string {
    const { isMatchOver, moves, taraIsEnabled } = this._data;

    if (isMatchOver) {
      return `
        <div id="progression-zone" aria-live="polite">
          <button id="play-again" class="btn-primary">
            Start New Match
          </button>
        </div>`;
    }

    return `
      <div id="choices" role="group" aria-label="Select your move">
        ${moves
          .map((move) => {
            const isRuleDisabled = move.id === "tara" && !taraIsEnabled;
            const flipClass = this._isFaceUp ? "is-flipped" : "";

            return `
            <button
              id="${move.id}"
              class="card-button"
              ${isRuleDisabled ? "disabled" : ""}
            >
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

  public toggleVisibility(show: boolean): void {
    if (!this._parentElement) {
      this._parentElement = this._getElement<HTMLElement>("game-controls");
    }
    this._toggleVisibility(this._parentElement, show);
  }

  public bindPlayerMove(handler: (move: Move) => void): void {
    this._moveHandler = handler;
  }

  /**
   * Uses event delegation to ensure the listener survives re-renders.
   */
  public bindStartNewMatch(handler: () => void): void {
    this._parentElement.addEventListener("click", (e) => {
      const btn = (e.target as HTMLElement).closest("#play-again");
      if (btn) handler();
    });
  }

  private _setupListeners(): void {
    this._parentElement.onclick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Prevent interaction if cards are face-down or match is over
      if (!this._isFaceUp) return;

      const moveBtn = target.closest(".card-button") as HTMLButtonElement;
      if (moveBtn && !moveBtn.disabled && this._moveHandler) {
        this._moveHandler(moveBtn.id as Move);
      }
    };
  }
}
