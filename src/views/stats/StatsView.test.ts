/**
 * @jest-environment jsdom
 */
import statsView from "./StatsView";
import { PARTICIPANTS, MOVES } from "../../utils/dataUtils";

describe("StatsView", () => {
  let parentElement: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <section id="game-stats" class="hidden">
        <aside id="player-stats" class="stats">
          <div class="score-row">WINS <span id="player-score">00</span></div>
          <div class="bar-wrapper">
            <div class="bar" id="player-health">
              <span class="bar-text">PLAYER</span>
            </div>
          </div>
          <p>Tara x<span id="player-tara">0</span></p>
          <p>
            <small>Common: <span id="player-most-common-move">–</span></small>
          </p>
        </aside>

        <aside id="computer-stats" class="stats">
          <div class="score-row"><span id="computer-score">00</span> WINS</div>
          <div class="bar-wrapper">
            <div class="bar" id="computer-health">
              <span class="bar-text">COMPUTER</span>
            </div>
          </div>
          <p>Tara x<span id="computer-tara">0</span></p>
          <p>
            <small>Common: <span id="computer-most-common-move">–</span></small>
          </p>
        </aside>
      </section>
    `;

    parentElement = document.getElementById("game-stats")!;
  });

  // ===== General Tests =====

  test("toggleGameStatsVisibility() hides and shows the game stats element", () => {
    statsView.toggleGameStatsVisibility(false);
    expect(parentElement.classList.contains("hidden")).toBe(true);

    statsView.toggleGameStatsVisibility(true);
    expect(parentElement.classList.contains("hidden")).toBe(false);
  });

  // ===== Health Tests =====

  test("updateHealthBar() sets the correct width style for full health", () => {
    const bar = document.getElementById("player-health")!;
    statsView.updateHealthBar(PARTICIPANTS.PLAYER, 100);
    expect(bar.style.width).toBe("100%");
  });

  test("updateHealthBar() sets 0% width for computer at zero health", () => {
    const bar = document.getElementById("computer-health")!;
    statsView.updateHealthBar(PARTICIPANTS.COMPUTER, 0);
    expect(bar.style.width).toBe("0%");
  });

  test("updateHealthBar() handles mid-range health correctly", () => {
    const bar = document.getElementById("player-health")!;
    statsView.updateHealthBar(PARTICIPANTS.PLAYER, 50);
    expect(bar.style.width).toBe("50%");
  });

  // ===== History Tests =====

  test("updateMostCommonMoves() updates move text correctly", () => {
    statsView.updateMostCommonMoves(MOVES.ROCK, MOVES.PAPER);

    expect(
      document.getElementById("player-most-common-move")?.textContent
    ).toBe(MOVES.ROCK);
    expect(
      document.getElementById("computer-most-common-move")?.textContent
    ).toBe(MOVES.PAPER);
  });

  test("updateMostCommonMoves() defaults to 'N/A' when moves are null", () => {
    statsView.updateMostCommonMoves(null, null);

    expect(
      document.getElementById("player-most-common-move")?.textContent
    ).toBe("N/A");
    expect(
      document.getElementById("computer-most-common-move")?.textContent
    ).toBe("N/A");
  });

  // ===== Score Tests =====

  test("updateScores() updates player and computer score", () => {
    statsView.updateScores(3, 5);
    expect(document.getElementById("player-score")?.textContent).toBe("03");
    expect(document.getElementById("computer-score")?.textContent).toBe("05");
  });

  // ===== Tara Count/Amount Tests =====

  test("updateTaraCounts() updates tara count text", () => {
    statsView.updateTaraCounts(2, 1);
    expect(document.getElementById("player-tara")?.textContent).toBe("2");
    expect(document.getElementById("computer-tara")?.textContent).toBe("1");
  });
});
