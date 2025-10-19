/**
 * @jest-environment jsdom
 */
import { View } from "./view";
import { PARTICIPANTS } from "../utils/dataUtils";

// Create the minimal HTML structure for View to interact with
const setupDOM = () => {
  document.body.innerHTML = `
    <div id="message"></div>
    <div id="player-score"></div>
    <div id="computer-score"></div>
    <div id="overlay"></div>
    <div id="initial-controls"></div>
    <div id="player-health-text"></div>
    <div id="computer-health-text"></div>
    <div id="player-health" class="bar"></div>
    <div id="computer-health" class="bar"></div>
    <div id="player-tara"></div>
    <div id="computer-tara"></div>
    <div id="player-most-common-move"></div>
    <div id="computer-most-common-move"></div>
    <div id="match"></div>
    <div id="round"></div>
    <div id="result-display" class="hidden">
      <div id="round-moves"></div>
      <div id="round-result"></div>
    </div>
    <div id="choices"></div>
    <button id="tara"></button>
    <button id="start"></button>
    <button id="play-again"></button>
    <button id="reset-game-state"></button>
    <button id="game-stats"></button>
  `;
};

describe("View", () => {
  let view: View;

  beforeEach(() => {
    setupDOM();
    view = new View();
  });

  test("updateMessage sets the message text", () => {
    view.updateMessage("Hello world!");
    expect(document.getElementById("message")?.textContent).toBe(
      "Hello world!"
    );
  });

  test("updateScores updates player and computer score", () => {
    view.updateScores(3, 5);
    expect(document.getElementById("player-score")?.textContent).toBe("3");
    expect(document.getElementById("computer-score")?.textContent).toBe("5");
  });

  test("updateTaraButton enables", () => {
    const taraBtn = document.getElementById("tara") as HTMLButtonElement;
    view.updateTaraButton(true);
    expect(taraBtn.disabled).toBe(false);
  });

  test("updateHealth updates health text", () => {
    view.updateHealth(50, 100);
    expect(document.getElementById("player-health-text")?.textContent).toBe(
      "50"
    );
    expect(document.getElementById("computer-health-text")?.textContent).toBe(
      "100"
    );
  });

  test("updateHealthBar applies correct class for full health", () => {
    const bar = document.getElementById("player-health")!;
    view.updateHealthBar(PARTICIPANTS.PLAYER, 100);
    expect(bar.classList.contains("full")).toBe(true);
  });

  test("toggleOutcome shows result display when moves and result are provided", () => {
    view.showRoundOutcome("rock", "scissors", "win");
    const outcomeEl = document.getElementById("result-display")!;
    expect(outcomeEl.classList.contains("hidden")).toBe(false);
    expect(outcomeEl.textContent).toContain("WIN");
  });

  test("showRoundOutcome sets move and result text", () => {
    view.showRoundOutcome("rock", "scissors", "you win!");
    expect(document.getElementById("round-moves")?.textContent).toContain(
      "rock"
    );
    expect(document.getElementById("round-result")?.textContent).toBe(
      "YOU WIN!"
    );
    expect(
      document.getElementById("result-display")?.classList.contains("hidden")
    ).toBe(false);
  });
});
