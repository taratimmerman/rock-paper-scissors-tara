/**
 * @jest-environment jsdom
 */
import moveView from "./MoveView";
import { MOVES } from "../../utils/dataUtils";

describe("MoveView", () => {
  const mockMoves = [
    { id: MOVES.ROCK, text: "Rock", icon: "🪨" },
    { id: MOVES.PAPER, text: "Paper", icon: "📄" },
    { id: MOVES.SCISSORS, text: "Scissors", icon: "✂️" },
    { id: MOVES.TARA, text: "Tara", icon: "✨" },
  ];

  beforeEach(() => {
    document.body.innerHTML = `<div id="choices"></div>`;
  });

  test("render() correctly injects move buttons", () => {
    moveView.render({ moves: mockMoves, taraIsEnabled: true });

    const buttons = document.querySelectorAll(".card-container");
    expect(buttons.length).toBe(mockMoves.length);
    expect(document.getElementById(MOVES.ROCK)).toBeTruthy();
    expect(document.getElementById(MOVES.TARA)).toBeTruthy();
  });

  test("updateTaraButton(false) disables only the Tara button", () => {
    // 1. Initial render with Tara enabled
    moveView.render({ moves: mockMoves, taraIsEnabled: true });
    const taraBtn = document.getElementById(MOVES.TARA) as HTMLButtonElement;
    expect(taraBtn.disabled).toBe(false);

    // 2. Surgical update
    moveView.updateTaraButton(false);

    // 3. Verify state
    expect(taraBtn.disabled).toBe(true);
    // Verify Rock is still enabled
    const rockBtn = document.getElementById(MOVES.ROCK) as HTMLButtonElement;
    expect(rockBtn.disabled).toBe(false);
  });

  test("updateTaraButton(true) re-enables the Tara button after it was disabled", () => {
    // 1. Start disabled
    moveView.render({ moves: mockMoves, taraIsEnabled: false });
    const taraBtn = document.getElementById(MOVES.TARA) as HTMLButtonElement;
    expect(taraBtn.disabled).toBe(true);

    // 2. Enable it
    moveView.updateTaraButton(true);

    // 3. Verify
    expect(taraBtn.disabled).toBe(false);
  });

  test("bindPlayerMove() dispatches move id on click", () => {
    const handler = jest.fn();
    moveView.bindPlayerMove(handler);
    moveView.render({ moves: mockMoves, taraIsEnabled: true });

    const rockBtn = document.getElementById(MOVES.ROCK);
    rockBtn?.click();

    expect(handler).toHaveBeenCalledWith(MOVES.ROCK);
  });

  test("toggleMoveButtons() changes visibility", () => {
    moveView.render({ moves: mockMoves, taraIsEnabled: true });
    const container = document.getElementById("choices")!;

    moveView.toggleMoveButtons(false);
    expect(container.classList.contains("hidden")).toBe(true);

    moveView.toggleMoveButtons(true);
    expect(container.classList.contains("hidden")).toBe(false);
  });
});
