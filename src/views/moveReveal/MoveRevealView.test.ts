import MoveRevealView from "./MoveRevealView";
import { PLAYER_MOVES_DATA } from "../../utils/dataUtils";
import { Move } from "../../utils/dataObjectUtils";

describe("MoveRevealView", () => {
  let container: HTMLElement;
  let view: MoveRevealView;

  beforeEach(() => {
    document.body.innerHTML =
      '<section id="move-reveal" class="hidden"></section>';
    container = document.getElementById("move-reveal")!;

    view = new MoveRevealView();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("render", () => {
    it("should render both player and computer cards with correct icons and text", () => {
      const mockData = {
        playerMoveId: "rock" as Move,
        computerMoveId: "scissors" as Move,
      };

      // Find the actual data from your config to compare
      const playerData = PLAYER_MOVES_DATA.find((m) => m.id === "rock")!;
      const computerData = PLAYER_MOVES_DATA.find((m) => m.id === "scissors")!;

      view.render(mockData);

      // Check for icons
      expect(container.innerHTML).toContain(playerData.icon);
      expect(container.innerHTML).toContain(computerData.icon);

      // Check for labels
      expect(container.innerHTML).toContain(playerData.text);
      expect(container.innerHTML).toContain(computerData.text);
    });

    it("should return an empty string if move IDs are not found", () => {
      // Cast as any to force a runtime check of safety logic
      const invalidData = {
        playerMoveId: "ghost-move" as any,
        computerMoveId: "rock" as Move,
      };

      view.render(invalidData);

      expect(container.innerHTML).toBe("");
    });

    it("should render the flippable structure", () => {
      view.render({
        playerMoveId: "paper" as Move,
        computerMoveId: "paper" as Move,
      });

      // Check that we have the inner container which handles the rotation
      const inner = container.querySelector(".card-inner");
      expect(inner).toBeTruthy();
    });
  });

  describe("toggleVisibility", () => {
    it("should remove the 'hidden' class when show is true", () => {
      container.classList.add("hidden");

      view.toggleVisibility(true);

      expect(container.classList.contains("hidden")).toBe(false);
    });

    it("should add the 'hidden' class when show is false", () => {
      container.classList.remove("hidden");

      view.toggleVisibility(false);

      expect(container.classList.contains("hidden")).toBe(true);
    });
  });

  describe("flipCards", () => {
    it("should apply 'is-flipped' class to all move cards and resolve", async () => {
      view.render({
        playerMoveId: "rock" as Move,
        computerMoveId: "paper" as Move,
      });

      // Initially, cards should not have the flipped class
      const cards = container.querySelectorAll(".card-inner");
      cards.forEach((card) => {
        expect(card.classList.contains("is-flipped")).toBe(false);
      });

      // Act: Trigger the flip
      const flipPromise = view.flipCards();

      // In JSDOM with our _waitForAnimation fix, this resolves immediately
      await expect(flipPromise).resolves.toBeUndefined();

      // Assert: Both cards now have the flipped class
      cards.forEach((card) => {
        expect(card.classList.contains("is-flipped")).toBe(true);
      });
    });

    it("should resolve immediately if no cards are rendered", async () => {
      // Don't call render, or render invalid data
      view.render({ playerMoveId: "" as any, computerMoveId: "" as any });

      const flipPromise = view.flipCards();
      await expect(flipPromise).resolves.toBeUndefined();
    });
  });

  describe("highlightWinner", () => {
    it("should apply 'winner-highlight' class to the player card when player wins", () => {
      view.render({
        playerMoveId: "rock" as Move,
        computerMoveId: "scissors" as Move,
      });

      // Act
      view.highlightWinner("player");

      const playerCard = container.querySelector(".card:first-child");
      const computerCard = container.querySelector(".card:last-child");

      expect(playerCard?.classList.contains("winner-highlight")).toBe(true);
      expect(computerCard?.classList.contains("winner-highlight")).toBe(false);
    });

    it("should apply 'winner-highlight' class to the computer card when computer wins", () => {
      view.render({
        playerMoveId: "rock" as Move,
        computerMoveId: "paper" as Move,
      });

      // Act
      view.highlightWinner("computer");

      const computerCard = container.querySelector(".card:last-child");
      expect(computerCard?.classList.contains("winner-highlight")).toBe(true);
    });

    it("should remove existing winner highlights if the next result is a draw", () => {
      // 1. Setup: Player wins first
      view.render({
        playerMoveId: "rock" as Move,
        computerMoveId: "scissors" as Move,
      });
      view.highlightWinner("player");
      expect(container.querySelectorAll(".winner-highlight").length).toBe(1);

      // 2. Act: A draw occurs (rendering new moves)
      // Assuming your render() or a specific reset() method clears classes
      view.render({
        playerMoveId: "paper" as Move,
        computerMoveId: "paper" as Move,
      });

      // 3. Assert: The glow is gone
      const highlights = container.querySelectorAll(".winner-highlight");
      expect(highlights.length).toBe(0);
    });

    describe("toggleVisibility - State Cleanup", () => {
      it("should strip 'winner-highlight' from all cards when visibility is set to false", () => {
        // 1. Setup: Render cards and apply a winner highlight
        view.render({
          playerMoveId: "rock" as Move,
          computerMoveId: "scissors" as Move,
        });
        const playerCard = container.querySelector(
          ".card:first-child"
        ) as HTMLElement;
        playerCard.classList.add("winner-highlight");

        expect(playerCard.classList.contains("winner-highlight")).toBe(true);

        // 2. Act: Hide the view (The "Reset")
        view.toggleVisibility(false);

        // 3. Assert: The highlight is gone
        expect(playerCard.classList.contains("winner-highlight")).toBe(false);
      });
    });
  });
});
