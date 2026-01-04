/**
 * @jest-environment jsdom
 */
import controlsView from "./ControlsView";
import { MOVES, PLAYER_MOVES_DATA } from "../../utils/dataUtils";

describe("ControlsView", () => {
  const mockMoves = [
    { id: MOVES.ROCK, text: "Rock", icon: "🪨" },
    { id: MOVES.PAPER, text: "Paper", icon: "📄" },
    { id: MOVES.SCISSORS, text: "Scissors", icon: "✂️" },
    { id: MOVES.TARA, text: "Tara", icon: "✨" },
  ];

  beforeEach(() => {
    controlsView.test_clearElement();

    document.body.innerHTML = `<div id="game-controls" class="hidden" aria-hidden="true"></div>`;
  });

  test("toggleVisibility() adds/removes the hidden class from the container", () => {
    const container = document.getElementById("game-controls")!;

    controlsView.toggleVisibility(true);
    expect(container.classList.contains("hidden")).toBe(false);

    controlsView.toggleVisibility(false);
    expect(container.classList.contains("hidden")).toBe(true);
  });

  // ===== STATE A: PLAYER MOVE SELECTION =====

  test("renders move buttons when playerMove is null", () => {
    controlsView.render({
      playerMove: null,
      isMatchOver: false,
      taraIsEnabled: true,
      moves: mockMoves,
    });

    const buttons = document.querySelectorAll(".card-container");
    expect(buttons.length).toBe(mockMoves.length);
    expect(document.getElementById(MOVES.ROCK)).toBeTruthy();
    expect(document.getElementById("play-again")).toBeFalsy();
  });

  test("disables Tara button when taraIsEnabled is false", () => {
    controlsView.render({
      playerMove: null,
      isMatchOver: false,
      taraIsEnabled: false,
      moves: mockMoves,
    });

    const taraBtn = document.getElementById(MOVES.TARA) as HTMLButtonElement;
    const rockBtn = document.getElementById(MOVES.ROCK) as HTMLButtonElement;

    expect(taraBtn.disabled).toBe(true);
    expect(rockBtn.disabled).toBe(false);
  });

  test("bindPlayerMove() dispatches move id on click", () => {
    const handler = jest.fn();
    controlsView.bindPlayerMove(handler);
    controlsView.render({
      playerMove: null,
      isMatchOver: false,
      taraIsEnabled: true,
      moves: mockMoves,
    });

    document.getElementById(MOVES.PAPER)?.click();
    expect(handler).toHaveBeenCalledWith(MOVES.PAPER);
  });

  // ===== STATE B: ROUND/MATCH PROGRESSION =====

  test("renders 'Next Round' button when playerMove exists and match is NOT over", () => {
    controlsView.render({
      playerMove: MOVES.ROCK,
      isMatchOver: false,
      taraIsEnabled: true,
      moves: mockMoves,
    });

    const btn = document.getElementById("play-again");
    expect(btn).toBeTruthy();
    expect(btn?.textContent?.trim()).toBe("Next Round");
    // Ensure cards are gone
    expect(document.querySelector(".card-container")).toBeFalsy();
  });

  test("renders 'Start New Match' button when match is over", () => {
    controlsView.render({
      playerMove: MOVES.ROCK,
      isMatchOver: true,
      taraIsEnabled: true,
      moves: mockMoves,
    });

    const btn = document.getElementById("play-again");
    expect(btn?.textContent?.trim()).toBe("Start New Match");
  });

  test("bindNextRound() triggers handler on play-again button click", () => {
    const handler = jest.fn();
    controlsView.bindNextRound(handler);

    // Set view to Progression state
    controlsView.render({
      playerMove: MOVES.SCISSORS,
      isMatchOver: false,
      taraIsEnabled: true,
      moves: mockMoves,
    });

    document.getElementById("play-again")?.click();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  // ===== RE-RENDERING / DOM DIFFING =====

  test("switching from Selection to Progression clears the container", () => {
    // 1. Initial State: Moves
    controlsView.render({
      playerMove: null,
      isMatchOver: false,
      taraIsEnabled: true,
      moves: mockMoves,
    });
    expect(document.getElementById("choices")).toBeTruthy();

    // 2. State Change: Move made
    controlsView.render({
      playerMove: MOVES.ROCK,
      isMatchOver: false,
      taraIsEnabled: true,
      moves: mockMoves,
    });

    expect(document.getElementById("choices")).toBeFalsy();
    expect(document.getElementById("play-again")).toBeTruthy();
  });

  // ===== ACCESSABILITY =====

  test("toggleVisibility(false) syncs aria-hidden attribute", () => {
    const container = document.getElementById("game-controls")!;

    controlsView.toggleVisibility(false);

    expect(container.classList.contains("hidden")).toBe(true);
    expect(container.getAttribute("aria-hidden")).toBe("true");
  });

  test("focus() shifts focus to the first button in the markup", () => {
    controlsView.render({
      playerMove: null,
      isMatchOver: false,
      taraIsEnabled: true,
      moves: PLAYER_MOVES_DATA,
    });

    controlsView.focus();

    // Now testing real browser-like behavior
    const firstButton = document.querySelector(
      ".card-container"
    ) as HTMLElement;
    expect(document.activeElement).toBe(firstButton);
  });

  test("toggleVisibility(false) removes element from tab order", () => {
    const container = document.getElementById("game-controls")!;

    controlsView.render({
      playerMove: null,
      isMatchOver: false,
      taraIsEnabled: true,
      moves: mockMoves,
    });

    controlsView.toggleVisibility(false);

    expect(container.getAttribute("tabindex")).toBe("-1");
  });

  test("toggleVisibility(true) restores element to tab order", () => {
    const container = document.getElementById("game-controls")!;

    controlsView.render({
      playerMove: null,
      isMatchOver: false,
      taraIsEnabled: true,
      moves: mockMoves,
    });

    container.setAttribute("tabindex", "-1");
    expect(container.hasAttribute("tabindex")).toBe(true);

    controlsView.toggleVisibility(true);
    expect(container.hasAttribute("tabindex")).toBe(false);
  });
});
