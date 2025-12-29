import { VoidHandler } from "../utils/dataObjectUtils";

export class ViewOld {
  private messageEl = this.getEl<HTMLElement>("message");
  private controls = this.getEl<HTMLElement>("initial-controls");
  private matchEl = this.getEl<HTMLElement>("match");
  private roundEl = this.getEl<HTMLElement>("round");
  private outcomeEl = this.getEl<HTMLElement>("result-display");
  private movesEl = this.getEl<HTMLElement>("round-moves");
  private resultEl = this.getEl<HTMLElement>("round-result");
  private moveChoicesEl = this.getEl<HTMLElement>("choices");
  private startBtn = this.getEl<HTMLButtonElement>("start");
  private playAgainBtn = this.getEl<HTMLButtonElement>("play-again");
  private resetBtn = this.getEl<HTMLButtonElement>("reset-game-state");

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

  bindStartGame(handler: VoidHandler) {
    this.startBtn?.addEventListener("click", handler);
  }

  bindPlayAgain(handler: VoidHandler) {
    this.playAgainBtn?.addEventListener("click", handler);
  }

  bindResetGame(handler: VoidHandler) {
    this.resetBtn?.addEventListener("click", handler);
  }

  // ===== General Methods =====

  updateMessage(text: string): void {
    if (!this.messageEl) return;
    this.messageEl.textContent = text;
  }

  toggleControls(show: boolean): void {
    this.toggle(this.controls, show);
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

  updateStartButton(isMatchActive: boolean): void {
    this.startBtn.textContent = isMatchActive ? "Resume Match" : "Start Match";
  }

  updatePlayAgainButton(isMatchOver: boolean): void {
    this.playAgainBtn.textContent = isMatchOver
      ? "Start New Match"
      : "Next Round";
  }
}
