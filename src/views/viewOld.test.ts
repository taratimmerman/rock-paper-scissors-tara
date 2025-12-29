/**
 * @jest-environment jsdom
 */
import { ViewOld } from "./viewOld";

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

  // === Standard Update Tests ===

  test("updateMessage sets the message text", () => {
    view.updateMessage("Hello world!");
    expect(document.getElementById("message")?.textContent).toBe(
      "Hello world!"
    );
  });
});
