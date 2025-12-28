/**
 * @jest-environment jsdom
 */
import { ViewOld } from "./viewOld";
import { PARTICIPANTS, PLAYER_MOVES_DATA, MOVES } from "../utils/dataUtils";

// --- MOCKING SETUP ---
// Define the mock data array inside the factory function to ensure it is initialized
// when the mock is executed, avoiding Temporal Dead Zone errors.
jest.mock("../utils/dataUtils", () => {
  const mockMoveData = [
    { id: "rock", text: "Rock", icon: "🪨" },
    { id: "paper", text: "Paper", icon: "📄" },
    { id: "scissors", text: "Scissors", icon: "✂️" },
    { id: "tara", text: "Tara", icon: "⭐" },
  ];

  return {
    PARTICIPANTS: { PLAYER: "player", COMPUTER: "computer" },
    MOVES: { ROCK: "rock", PAPER: "paper", SCISSORS: "scissors", TARA: "tara" },
    PLAYER_MOVES_DATA: mockMoveData,
  };
});

// --- DOM SETUP ---
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
    <button id="start"></button>
    <button id="play-again"></button>
    <button id="reset-game-state"></button>
    <button id="game-stats"></button>
  `;
};

// --- TESTS ---
describe("View", () => {
  let view: ViewOld;

  beforeEach(() => {
    setupDOM();
    view = new ViewOld();
  });

  // === Dynamic Rendering Tests ===

  test("bindPlayerMove dynamically renders all move choice buttons", () => {
    const choicesEl = document.getElementById("choices")!;
    view.bindPlayerMove(jest.fn());

    expect(choicesEl.children.length).toBe(PLAYER_MOVES_DATA.length);
    expect(document.getElementById(MOVES.TARA)).not.toBeNull();
  });

  test("bindPlayerMove attaches click listener to rendered buttons", () => {
    const mockHandler = jest.fn();
    view.bindPlayerMove(mockHandler);

    const rockBtn = document.getElementById(MOVES.ROCK)!;
    rockBtn.click();

    expect(mockHandler).toHaveBeenCalledWith(MOVES.ROCK);
  });

  test("updateTaraButton disables the dynamically rendered Tara button", () => {
    view.bindPlayerMove(jest.fn());
    const taraBtn = document.getElementById(MOVES.TARA) as HTMLButtonElement;

    view.updateTaraButton(false);

    expect(taraBtn.disabled).toBe(true);
  });

  test("updateTaraButton enables the dynamically rendered Tara button", () => {
    view.bindPlayerMove(jest.fn());
    const taraBtn = document.getElementById(MOVES.TARA) as HTMLButtonElement;
    taraBtn.disabled = true;

    view.updateTaraButton(true);

    expect(taraBtn.disabled).toBe(false);
  });

  // === Standard Update Tests ===

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
