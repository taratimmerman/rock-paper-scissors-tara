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
        <!-- Player Stats -->
        <aside id="player-stats" class="stats">
          <h3>Player</h3>
          <div class="bar-wrapper">
            <div class="bar" id="player-health">
              <span class="bar-text" id="player-health-text"></span>
            </div>
          </div>
          <p>Tara x<span id="player-tara">0</span></p>
          <p>
            <small>Common: <span id="player-most-common-move">–</span></small>
          </p>
        </aside>

        <!-- Computer Stats -->
        <aside id="computer-stats" class="stats">
          <h3>Computer</h3>
          <div class="bar-wrapper">
            <div class="bar" id="computer-health">
              <span class="bar-text" id="computer-health-text"></span>
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

  test("updateHealth() updates health text", () => {
    statsView.updateHealth(50, 100);
    expect(document.getElementById("player-health-text")?.textContent).toBe(
      "50"
    );
    expect(document.getElementById("computer-health-text")?.textContent).toBe(
      "100"
    );
  });

  test("updateHealth() handles null values by defaulting to 0", () => {
    // @ts-ignore - testing runtime safety for null
    statsView.updateHealth(null, null);
    expect(document.getElementById("player-health-text")?.textContent).toBe(
      "0"
    );
  });

  test("updateHealthBar() applies correct class for full health", () => {
    const bar = document.getElementById("player-health")!;
    statsView.updateHealthBar(PARTICIPANTS.PLAYER, 100);
    expect(bar.classList.contains("full")).toBe(true);
  });

  test("updateHealthBar() applies 'zero' class to computer", () => {
    const bar = document.getElementById("computer-health")!;
    statsView.updateHealthBar(PARTICIPANTS.COMPUTER, 0);
    expect(bar.classList.contains("zero")).toBe(true);
  });

  test("updateHealthBar() removes old status classes", () => {
    const bar = document.getElementById("player-health")!;

    statsView.updateHealthBar(PARTICIPANTS.PLAYER, 100); // adds 'full'
    statsView.updateHealthBar(PARTICIPANTS.PLAYER, 50); // should remove 'full', add 'half'

    expect(bar.classList.contains("full")).toBe(false);
    expect(bar.classList.contains("half")).toBe(true);
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

  // ===== Tara Count/Amount Tests =====

  test("updateTaraCounts() updates tara count text", () => {
    statsView.updateTaraCounts(2, 1);
    expect(document.getElementById("player-tara")?.textContent).toBe("2");
    expect(document.getElementById("computer-tara")?.textContent).toBe("1");
  });
});
