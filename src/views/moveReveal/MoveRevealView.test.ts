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
});
