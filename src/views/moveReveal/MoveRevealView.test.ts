import moveRevealView from "./MoveRevealView";
import { PLAYER_MOVES_DATA } from "../../utils/dataUtils";
import { Move } from "../../utils/dataObjectUtils";

describe("MoveRevealView", () => {
  let container: HTMLElement;

  beforeEach(() => {
    // 1. Setup the DOM element the View expects to find
    document.body.innerHTML =
      '<section id="move-reveal" class="hidden"></section>';
    container = document.getElementById("move-reveal")!;

    // 2. Since it's a singleton, manually re-assign the parent element
    // to the fresh DOM node created for this specific test.
    // @ts-ignore - accessing protected member for testing purposes
    moveRevealView._parentElement = container;
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

      moveRevealView.render(mockData);

      // Check for icons
      expect(container.innerHTML).toContain(playerData.icon);
      expect(container.innerHTML).toContain(computerData.icon);

      // Check for labels
      expect(container.innerHTML).toContain(playerData.text);
      expect(container.innerHTML).toContain(computerData.text);
    });

    it("should render cards with the 'disabled' attribute to prevent hover/clicks", () => {
      moveRevealView.render({
        playerMoveId: "paper" as Move,
        computerMoveId: "paper" as Move,
      });

      const cards = container.querySelectorAll(".card-container");
      expect(cards.length).toBe(2);
      cards.forEach((card) => {
        expect(card.hasAttribute("disabled")).toBe(true);
      });
    });

    it("should return an empty string if move IDs are not found", () => {
      // Cast as any to force a runtime check of safety logic
      const invalidData = {
        playerMoveId: "ghost-move" as any,
        computerMoveId: "rock" as Move,
      };

      moveRevealView.render(invalidData);

      expect(container.innerHTML).toBe("");
    });
  });

  describe("toggleVisibility", () => {
    it("should remove the 'hidden' class when show is true", () => {
      container.classList.add("hidden");

      moveRevealView.toggleVisibility(true);

      expect(container.classList.contains("hidden")).toBe(false);
    });

    it("should add the 'hidden' class when show is false", () => {
      container.classList.remove("hidden");

      moveRevealView.toggleVisibility(false);

      expect(container.classList.contains("hidden")).toBe(true);
    });
  });
});
