import {
  Health,
  Move,
  Participant,
  StandardMove,
  VoidHandler,
} from "../utils/dataObjectUtils";
import { MOVES } from "../utils/dataUtils";

export class View {
  private messageEl = this.getEl<HTMLElement>("message");
  private overlay = this.getEl<HTMLElement>("overlay");
  private controls = this.getEl<HTMLElement>("initial-controls");
  private playerScoreEl = this.getEl<HTMLElement>("player-score");
  private computerScoreEl = this.getEl<HTMLElement>("computer-score");
  private playerHealthEl = this.getEl<HTMLElement>("player-health-text");
  private computerHealthEl = this.getEl<HTMLElement>("computer-health-text");
  private playerHealthBarEl = this.getEl<HTMLElement>("player-health");
  private computerHealthBarEl = this.getEl<HTMLElement>("computer-health");
  private playerTaraCountEl = this.getEl<HTMLElement>("player-tara");
  private computerTaraCountEl = this.getEl<HTMLElement>("computer-tara");
  private playerMostCommonMoveEl = this.getEl<HTMLElement>(
    "player-most-common-move"
  );
  private computerMostCommonMoveEl = this.getEl<HTMLElement>(
    "computer-most-common-move"
  );
  private matchEl = this.getEl<HTMLElement>("match");
  private roundEl = this.getEl<HTMLElement>("round");
  private outcomeEl = this.getEl<HTMLElement>("result-display");
  private movesEl = this.getEl<HTMLElement>("round-moves");
  private resultEl = this.getEl<HTMLElement>("round-result");
  private moveChoicesEl = this.getEl<HTMLElement>("choices");
  private taraBtn = this.getEl<HTMLButtonElement>("tara");
  private startBtn = this.getEl<HTMLButtonElement>("start");
  private playAgainBtn = this.getEl<HTMLButtonElement>("play-again");
  private gameStatsEl = this.getEl<HTMLButtonElement>("game-stats");
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

  bindPlayerMove(handler: (move: Move) => void) {
    Object.values(MOVES).forEach((move) => {
      this.getEl(move)?.addEventListener("click", () => handler(move));
    });
  }

  // ===== General Methods =====

  updateMessage(text: string): void {
    if (!this.messageEl) return;
    this.messageEl.textContent = text;
  }

  toggleOverlay(show: boolean): void {
    this.toggle(this.overlay, show);
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

  toggleGameStats(show: boolean) {
    this.toggle(this.gameStatsEl, show);
  }

  updateRound(round: number): void {
    this.roundEl.textContent = `Round ${round}`;
    this.toggle(this.roundEl, true);
  }

  updateMatch(match: number): void {
    this.matchEl.textContent = `Match ${match}`;
    this.toggle(this.matchEl, true);
  }

  resetForNextRound(): void {
    this.toggleGameStats(true);
    this.toggleMoveButtons(true);
    this.togglePlayAgain(false);
    this.toggle(this.outcomeEl, false);
  }

  updateStartButton(isMatchActive: boolean): void {
    this.startBtn.textContent = isMatchActive ? "Resume Match" : "Start Match";
  }

  updatePlayAgainButton(isMatchOver: boolean): void {
    this.playAgainBtn.textContent = isMatchOver
      ? "Start New Match"
      : "Next Round";
  }

  activateSpinner(shouldActivate: boolean): void {
    this.toggleOverlay(shouldActivate);
  }

  // ===== Outcome Methods =====

  private showOutcomeText(
    playerMove: Move | null,
    computerMove: Move | null,
    resultText: string
  ): void {
    this.movesEl.textContent = `You played ${playerMove}. Computer played ${computerMove}.`;
    this.resultEl.textContent = resultText;
    this.toggle(this.outcomeEl, true);
  }

  showRoundOutcome(
    playerMove: Move | null,
    computerMove: Move | null,
    result: string
  ): void {
    this.showOutcomeText(playerMove, computerMove, result.toUpperCase());
  }

  showMatchOutcome(
    playerMove: Move | null,
    computerMove: Move | null,
    winner: Participant
  ): void {
    this.showOutcomeText(
      playerMove,
      computerMove,
      `${winner.toUpperCase()} WON THE MATCH!`
    );
  }

  // ===== Score Methods =====

  updateScores(player: number, computer: number): void {
    this.playerScoreEl.textContent = player.toString();
    this.computerScoreEl.textContent = computer.toString();
  }

  // ===== Tara Methods =====

  updateTaraCounts(playerCount: number, computerCount: number): void {
    this.playerTaraCountEl.textContent = playerCount.toString();
    this.computerTaraCountEl.textContent = computerCount.toString();
  }

  updateTaraButton(isEnabled: boolean, taraCount: number): void {
    this.taraBtn.disabled = !isEnabled;
    this.taraBtn.textContent = `Tara (x${taraCount})`;
  }

  // ===== History Methods =====

  updateMostCommonMoves(
    player: StandardMove | null,
    computer: StandardMove | null
  ): void {
    this.playerMostCommonMoveEl.textContent = player ?? "N/A";
    this.computerMostCommonMoveEl.textContent = computer ?? "N/A";
  }

  // ===== Health Methods =====

  updateHealth(playerHealth: Health, computerHealth: Health): void {
    this.playerHealthEl.textContent = (playerHealth ?? 0).toString();
    this.computerHealthEl.textContent = (computerHealth ?? 0).toString();
  }

  private getHealthBar(participant: Participant): HTMLElement {
    return participant === "player"
      ? this.playerHealthBarEl
      : this.computerHealthBarEl;
  }

  updateHealthBar(participant: Participant, health: Health): void {
    const bar = this.getHealthBar(participant);

    // Reset classes but keep the base 'bar'
    bar.className = "bar";

    switch (health) {
      case 100:
        bar.classList.add("full");
        break;
      case 50:
        bar.classList.add("half");
        break;
      case 0:
      case null:
        bar.classList.add("zero");
        break;
    }
  }
}
