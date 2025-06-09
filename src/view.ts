import { Move, Participant, StandardMove } from "./utils/dataObjectUtils";
import { MOVES } from "./utils/dataUtils";

export class View {
  private messageEl = document.getElementById("message");
  private playerScoreEl = document.getElementById("player-score");
  private computerScoreEl = document.getElementById("computer-score");
  private playerHealthEl = document.getElementById("player-health");
  private computerHealthEl = document.getElementById("computer-health");
  private playerMostCommonMoveEl = document.getElementById(
    "player-most-common-move"
  );
  private computerMostCommonMoveEl = document.getElementById(
    "computer-most-common-move"
  );
  private movesEl = document.getElementById("round-moves")!;
  private resultEl = document.getElementById("round-result")!;
  private taraBtn = document.getElementById("tara")!;
  private startBtn = document.getElementById("start");
  private playAgainBtn = document.getElementById("play-again");

  // ===== Helper =====
  private toggle(el: HTMLElement | null, show: boolean): void {
    if (el) el.classList.toggle("hidden", !show);
  }

  // ===== General Methods =====

  updateMessage(text: string): void {
    if (this.messageEl) {
      this.messageEl.textContent = text;
    }
  }

  toggleStartButton(show: boolean): void {
    this.toggle(this.startBtn, show);
  }

  updateRound(round: number): void {
    const roundElem = document.getElementById("round");
    if (roundElem) {
      roundElem.textContent = `Round ${round}`;
      this.toggle(roundElem, true);
    }
  }

  updateMatch(match: number): void {
    const matchElem = document.getElementById("match");
    if (matchElem) {
      matchElem.textContent = `Match ${match}`;
      this.toggle(matchElem, true);
    }
  }

  showRoundOutcome(
    playerMove: Move | null,
    computerMove: Move | null,
    result: string
  ): void {
    this.movesEl.textContent = `You played ${playerMove}. Computer played ${computerMove}.`;
    this.resultEl.textContent = result.toUpperCase();
    this.toggle(this.movesEl, true);
    this.toggle(this.resultEl, true);
  }

  showMatchOutcome(
    playerMove: Move | null,
    computerMove: Move | null,
    winner: Participant
  ): void {
    this.movesEl.textContent = `You played ${playerMove}. Computer played ${computerMove}.`;
    this.resultEl.textContent = `${winner.toUpperCase()} WON THE MATCH!`;
    this.toggle(this.movesEl, true);
    this.toggle(this.resultEl, true);
  }

  toggleResetGameState(show: boolean): void {
    const btn = document.getElementById("reset-game-state");
    this.toggle(btn, show);
  }

  toggleMoveButtons(show: boolean): void {
    Object.values(MOVES).forEach((move) => {
      const btn = document.getElementById(move);
      this.toggle(btn, show);
    });
  }

  togglePlayAgain(show: boolean): void {
    this.toggle(this.playAgainBtn, show);
  }

  toggleGameStats(show: boolean) {
    const gameStatsSection = document.getElementById("game-stats");
    this.toggle(gameStatsSection, show);
  }

  resetForNextRound(): void {
    this.toggleGameStats(true);
    this.toggleMoveButtons(true);
    this.togglePlayAgain(false);
    this.toggle(this.movesEl, false);
    this.toggle(this.resultEl, false);
  }

  updateStartButton(isMatchActive: boolean): void {
    if (this.startBtn) {
      this.startBtn.textContent = isMatchActive
        ? "Resume Match"
        : "Start Match";
    }
  }

  updatePlayAgainButton(isMatchOver: boolean): void {
    if (this.playAgainBtn) {
      this.playAgainBtn.textContent = isMatchOver
        ? "Start New Match"
        : "Next Round";
    }
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

  // ===== History Methods =====

  updateMostCommonMoves(
    player: StandardMove | null,
    computer: StandardMove | null
  ): void {
    if (this.playerMostCommonMoveEl) {
      this.playerMostCommonMoveEl.textContent = player ?? "X";
    }
    if (this.computerMostCommonMoveEl) {
      this.computerMostCommonMoveEl.textContent = computer ?? "X";
    }
  }

  // ===== Health Methods =====

  updateHealth(
    playerHealth: number | null,
    computerHealth: number | null
  ): void {
    if (this.playerHealthEl) {
      this.playerHealthEl.textContent = (playerHealth ?? 0).toString();
    }
    if (this.computerHealthEl) {
      this.computerHealthEl.textContent = (computerHealth ?? 0).toString();
    }
  }
}
