/**
 * @jest-environment jsdom
 */
import ArenaView from "./ArenaView";
import { PLAYER_MOVES_DATA } from "../../utils/dataUtils";
import { Move } from "../../utils/dataObjectUtils";

describe("ArenaView", () => {
  let view: ArenaView;
  let arenaContainer: HTMLElement;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `<div id="arena"></div>`;
    arenaContainer = document.getElementById("arena")!;

    view = new ArenaView();

    // Mock the animation helper to avoid hanging tests
    // If your View base class has a _waitForAnimation method, we mock it:
    (view as any)._waitForAnimation = jest.fn().mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Initialization & Clear", () => {
    it("should render an empty state when phase is 'waiting'", () => {
      view.render({ phase: "waiting" });

      const content = arenaContainer.querySelector(".arena-content");
      // Assert it is empty or essentially blank
      expect(content?.innerHTML.trim()).toBe("");
      expect(content?.hasAttribute("inert")).toBe(true);
    });

    it("should clear content when clear() is called", () => {
      // First, populate it
      view.render({
        phase: "combat",
        playerMoveId: "rock",
        computerMoveId: "paper",
      });
      expect(arenaContainer.innerHTML).not.toBe("");

      // Then clear it
      view.clear();

      const content = arenaContainer.querySelector(".arena-content");
      expect(content?.innerHTML.trim()).toBe("");
    });
  });

  describe("Rendering", () => {
    it("should render correct cards when phase is 'result'", () => {
      view.render({
        phase: "result",
        playerMoveId: "rock",
        computerMoveId: "scissors",
        announcementMessage: "PLAYER WINS!",
      });

      // Check for cards
      const playerCard = document.getElementById("reveal-player");
      const computerCard = document.getElementById("reveal-computer");

      expect(playerCard).not.toBeNull();
      expect(computerCard).not.toBeNull();

      // Check for specific icons (using your dataUtils data)
      const rockData = PLAYER_MOVES_DATA.find((m) => m.id === "rock");
      expect(playerCard?.innerHTML).toContain(rockData?.icon);
    });
  });

  describe("Play Sequence (Async)", () => {
    it("should trigger animations on cards", async () => {
      // We spy on the classList to ensure animation classes are added
      const data = {
        phase: "revealing" as const,
        playerMoveId: "rock" as Move,
        computerMoveId: "paper" as Move,
        winner: "computer" as const,
        isDoubleKO: false,
        announcementMessage: "TEST",
      };

      await view.playRoundSequence(data);

      const pCard = document.getElementById("reveal-player");
      expect(pCard?.classList.contains("slide-in")).toBe(true);
    });
  });

  describe("Ported Logic from MoveRevealView", () => {
    it("should apply 'winner-highlight' class to the winning card", async () => {
      // 1. Arrange: Define the data
      const data = {
        phase: "result" as const,
        playerMoveId: "rock" as Move,
        computerMoveId: "scissors" as Move,
        winner: "player" as const,
        isDoubleKO: false,
        announcementMessage: "PLAYER WINS",
      };

      // 2. Act: Run the sequence
      // playRoundSequence performs the logic that applies the highlight class
      await view.playRoundSequence(data);

      // 3. Assert
      const playerCard = document.getElementById("reveal-player");
      expect(playerCard?.classList.contains("winner-highlight")).toBe(true);
    });

    it("should handle invalid moves gracefully", () => {
      view.render({
        phase: "combat",
        playerMoveId: "invalid-id" as any,
        computerMoveId: "rock",
      });

      const content = document.getElementById("reveal-player")?.innerHTML;
      expect(content).toContain("❓"); // The fallback we discussed earlier
    });
  });
});
