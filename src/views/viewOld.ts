import { VoidHandler } from "../utils/dataObjectUtils";

export class ViewOld {
  private messageEl = this.getEl<HTMLElement>("message");
  private matchEl = this.getEl<HTMLElement>("match");
  private roundEl = this.getEl<HTMLElement>("round");
  private outcomeEl = this.getEl<HTMLElement>("result-display");
  private movesEl = this.getEl<HTMLElement>("round-moves");
  private resultEl = this.getEl<HTMLElement>("round-result");
  private moveChoicesEl = this.getEl<HTMLElement>("choices");
  private playAgainBtn = this.getEl<HTMLButtonElement>("play-again");

  // ===== Helper Methods =====
  private getEl<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id);
    if (!element) {
      throw new Error(`Critical element not found: #${id}`);
    }
    return element as T;
  }

  private toggle(el: HTMLElement, show: boolean): void {
    el.classList.toggle("hidden", !show);
  }

  // ===== Binding Methods =====

  bindPlayAgain(handler: VoidHandler) {
    this.playAgainBtn?.addEventListener("click", handler);
  }

  // ===== General Methods =====

  updateMessage(text: string): void {
    if (!this.messageEl) return;
    this.messageEl.textContent = text;
  }

  toggleMoveButtons(show: boolean): void {
    this.toggle(this.moveChoicesEl, show);
  }

  togglePlayAgain(show: boolean): void {
    this.toggle(this.playAgainBtn, show);
  }

  toggleOutcome(show: boolean): void {
    this.toggle(this.outcomeEl, show);
  }

  updateRound(round: number): void {
    this.roundEl.textContent = `Round ${round}`;
    this.toggle(this.roundEl, true);
  }

  updateMatch(match: number): void {
    this.matchEl.textContent = `Match ${match}`;
    this.toggle(this.matchEl, true);
  }

  updatePlayAgainButton(isMatchOver: boolean): void {
    this.playAgainBtn.textContent = isMatchOver
      ? "Start New Match"
      : "Next Round";
  }
}
