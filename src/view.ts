import { Move } from "./utils/dataObjectUtils";
import { MOVES } from "./utils/dataUtils";

export class View {
  private messageEl = document.getElementById("message");
  private playerScoreEl = document.getElementById("player-score");
  private computerScoreEl = document.getElementById("computer-score");
  private movesEl = document.getElementById("round-moves")!;
  private resultEl = document.getElementById("round-result")!;
  private taraBtn = document.getElementById("tara")!;

  // ===== General Methods =====

  updateMessage(text: string): void {
    if (this.messageEl) {
      this.messageEl.textContent = text;
    }
  }

  toggleStartButton(show: boolean): void {
    const btn = document.getElementById("start-game");
    if (btn) btn.style.display = show ? "inline" : "none";
  }

  updateRound(round: number): void {
    const roundElem = document.getElementById("round");
    if (roundElem) {
      roundElem.textContent = `Round ${round}`;
      roundElem.style.display = "block";
    }
  }

  showRoundOutcome(
    playerMove: Move | null,
    computerMove: Move | null,
    result: string
  ): void {
    this.movesEl.textContent = `You played ${playerMove}. Computer played ${computerMove}.`;
    this.resultEl.textContent = result.toUpperCase();
    this.movesEl.style.display = "block";
    this.resultEl.style.display = "block";
  }

  toggleMoveButtons(show: boolean): void {
    Object.values(MOVES).forEach((move) => {
      const btn = document.getElementById(move);
      if (btn) btn.style.display = show ? "inline" : "none";
    });
  }

  togglePlayAgain(show: boolean): void {
    const btn = document.getElementById("play-again");
    if (btn) btn.style.display = show ? "inline-block" : "none";
  }

  resetForNextRound(): void {
    this.toggleMoveButtons(true);
    this.togglePlayAgain(false);

    this.movesEl.style.display = "none";
    this.resultEl.style.display = "none";
  }

  // ===== Score Methods =====

  updateScores(player: number, computer: number): void {
    if (this.playerScoreEl) this.playerScoreEl.textContent = player.toString();
    if (this.computerScoreEl)
      this.computerScoreEl.textContent = computer.toString();
  }

  // ===== Tara Methods =====

  updateTaraCounts(playerCount: number, computerCount: number): void {
    document.getElementById("player-tara")!.textContent =
      playerCount.toString();
    document.getElementById("computer-tara")!.textContent =
      computerCount.toString();
  }

  updateTaraButton(isEnabled: boolean, taraCount: number): void {
    if (this.taraBtn instanceof HTMLButtonElement) {
      this.taraBtn.disabled = !isEnabled;
    }

    this.taraBtn.textContent = `Tara (x${taraCount})`;
  }
}
