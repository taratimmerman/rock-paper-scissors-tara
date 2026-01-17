/**
 * @jest-environment jsdom
 */
import ControlsView from "./ControlsView";
import { MOVES, PLAYER_MOVES_DATA } from "../../utils/dataUtils";

describe("ControlsView", () => {
  let view: ControlsView;

  const mockMoves = [
    { id: MOVES.ROCK, text: "Rock", icon: "🪨" },
    { id: MOVES.PAPER, text: "Paper", icon: "📄" },
    { id: MOVES.SCISSORS, text: "Scissors", icon: "✂️" },
    { id: MOVES.TARA, text: "Tara", icon: "✨" },
  ];

  beforeEach(() => {
    document.body.innerHTML = `<div id="game-controls"></div>`;
    view = new ControlsView();
  });

  // ===== TRANSITION & VISIBILITY =====

  test("toggleVisibility(false) makes element inert and hidden", () => {
    const container = document.getElementById("game-controls")!;

    view.render({
      playerMove: null,
      isMatchOver: false,
      taraIsEnabled: true,
      moves: mockMoves,
    });

    // INITIAL STATE CHECK: Should be visible and active after a standard render
    expect(container.hasAttribute("inert")).toBe(false);
    expect(container.classList.contains("hidden")).toBe(false);

    // ACT
    view.toggleVisibility(false);

    // ASSERT
    expect(container.hasAttribute("inert")).toBe(true);
    expect(container.classList.contains("hidden")).toBe(true);
  });

  test("toggleVisibility(true) removes inert and hidden states", () => {
    const container = document.getElementById("game-controls")!;

    // ARRANGE: Set the state to "hidden"
    container.setAttribute("inert", "");
    container.classList.add("hidden");

    // INITIAL STATE CHECK
    expect(container.hasAttribute("inert")).toBe(true);
    expect(container.classList.contains("hidden")).toBe(true);

    // ACT
    view.toggleVisibility(true);

    // ASSERT
    expect(container.hasAttribute("inert")).toBe(false);
    expect(container.classList.contains("hidden")).toBe(false);
  });

  // ===== STATE A: PLAYER MOVE SELECTION =====

  test("renders move buttons when playerMove is null", () => {
    view.render({
      playerMove: null,
      isMatchOver: false,
      taraIsEnabled: true,
      moves: mockMoves,
    });

    const buttons = document.querySelectorAll(".card-button");
    expect(buttons.length).toBe(mockMoves.length);
    expect(document.getElementById(MOVES.ROCK)).toBeTruthy();
    expect(document.getElementById("play-again")).toBeFalsy();
  });

  test("disables Tara button when taraIsEnabled is false", () => {
    view.render({
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
    view.bindPlayerMove(handler);
    view.render({
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
    view.render({
      playerMove: MOVES.ROCK,
      isMatchOver: false,
      taraIsEnabled: true,
      moves: mockMoves,
    });

    const btn = document.getElementById("play-again");
    expect(btn).toBeTruthy();
    expect(btn?.textContent?.trim()).toBe("Next Round");
    expect(document.querySelector(".card-button")).toBeFalsy();
  });

  test("renders 'Start New Match' button when match is over", () => {
    view.render({
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
    view.bindNextRound(handler);

    view.render({
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
    view.render({
      playerMove: null,
      isMatchOver: false,
      taraIsEnabled: true,
      moves: mockMoves,
    });
    expect(document.getElementById("choices")).toBeTruthy();

    view.render({
      playerMove: MOVES.ROCK,
      isMatchOver: false,
      taraIsEnabled: true,
      moves: mockMoves,
    });

    expect(document.getElementById("choices")).toBeFalsy();
    expect(document.getElementById("play-again")).toBeTruthy();
  });

  test("maintains flipped state in markup across multiple renders", async () => {
    const data = {
      playerMove: null,
      isMatchOver: false,
      moves: PLAYER_MOVES_DATA,
      taraIsEnabled: true,
    };

    view.render(data);
    await view.flipAll(true);
    view.render(data);

    const cards = document.querySelectorAll(".card-inner");
    cards.forEach((card) => {
      expect(card.classList.contains("is-flipped")).toBe(true);
    });
  });

  test("flipAll waits for the animation to complete", async () => {
    const data = {
      playerMove: null,
      isMatchOver: false,
      moves: PLAYER_MOVES_DATA,
      taraIsEnabled: true,
    };
    view.render(data);

    const flipPromise = view.flipAll(true);
    await expect(flipPromise).resolves.toBeUndefined();

    const card = document.querySelector(".card-inner");
    expect(card?.classList.contains("is-flipped")).toBe(true);
  });
});
