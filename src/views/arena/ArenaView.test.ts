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

    it("should render image-backed card backs for player and computer cards", () => {
      view.render({
        phase: "result",
        playerMoveId: "rock",
        computerMoveId: "scissors",
      });

      expect(document.querySelectorAll(".card-back-image").length).toBe(2);
    });

    it("should attach a fallback hook to card-back images", () => {
      view.render({
        phase: "result",
        playerMoveId: "rock",
        computerMoveId: "scissors",
      });

      const cardBackImage = document.querySelector(".card-back-image");
      expect(cardBackImage?.outerHTML).toContain("onerror=");
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

  describe("Tie Animation Regression", () => {
    it("should apply tie animation classes to both cards on tie", async () => {
      const data = {
        phase: "result" as const,
        playerMoveId: "rock" as Move,
        computerMoveId: "rock" as Move,
        winner: "tie" as const,
        isDoubleKO: false,
        announcementMessage: "IT'S A TIE!",
      };

      await view.playRoundSequence(data);

      const playerCard = document.getElementById("reveal-player");
      const computerCard = document.getElementById("reveal-computer");
      const container = document.getElementById("move-reveal");

      // Both cards should have impact and defeated classes
      expect(playerCard?.classList.contains("card-impact")).toBe(true);
      expect(playerCard?.classList.contains("card-defeated")).toBe(true);
      expect(computerCard?.classList.contains("card-impact")).toBe(true);
      expect(computerCard?.classList.contains("card-defeated")).toBe(true);

      // Container should shake
      expect(container?.classList.contains("arena-shake")).toBe(true);
    });

    it("should apply double KO animation classes when isDoubleKO is true", async () => {
      const data = {
        phase: "result" as const,
        playerMoveId: "rock" as Move,
        computerMoveId: "paper" as Move,
        winner: "player" as const, // winner doesn't matter for double KO
        isDoubleKO: true,
        announcementMessage: "MUTUAL DESTRUCTION!",
      };

      await view.playRoundSequence(data);

      const playerCard = document.getElementById("reveal-player");
      const computerCard = document.getElementById("reveal-computer");
      const container = document.getElementById("move-reveal");

      // Both cards should have impact and defeated classes
      expect(playerCard?.classList.contains("card-impact")).toBe(true);
      expect(playerCard?.classList.contains("card-defeated")).toBe(true);
      expect(computerCard?.classList.contains("card-impact")).toBe(true);
      expect(computerCard?.classList.contains("card-defeated")).toBe(true);

      // Container should shake
      expect(container?.classList.contains("arena-shake")).toBe(true);
    });
  });

  describe("Stance Animations Regression", () => {
    it("should include stance classes in markup during combat phase", () => {
      // Render directly with combat phase to verify markup generation
      view.render({
        phase: "combat" as const,
        playerMoveId: "rock" as Move,
        computerMoveId: "paper" as Move,
      });

      const playerCard = document.getElementById("reveal-player");
      const computerCard = document.getElementById("reveal-computer");

      // Stance classes should be generated in markup when phase === "combat"
      expect(playerCard?.classList.contains("stance-rock")).toBe(true);
      expect(computerCard?.classList.contains("stance-paper")).toBe(true);
    });

    it("should generate correct stance classes for all move types in combat phase", () => {
      const testCases: Array<[Move, string]> = [
        ["rock", "stance-rock"],
        ["paper", "stance-paper"],
        ["scissors", "stance-scissors"],
        ["tara", "stance-tara"],
      ];

      for (const [move, expectedClass] of testCases) {
        view.render({
          phase: "combat" as const,
          playerMoveId: move,
          computerMoveId: "rock" as Move,
        });

        const playerCard = document.getElementById("reveal-player");
        expect(playerCard?.classList.contains(expectedClass)).toBe(true);
      }
    });

    it("should not include stance classes in non-combat phases", () => {
      view.render({
        phase: "result" as const,
        playerMoveId: "rock" as Move,
        computerMoveId: "paper" as Move,
      });

      const playerCard = document.getElementById("reveal-player");
      const computerCard = document.getElementById("reveal-computer");

      // Stance classes should NOT be in markup when phase !== "combat"
      expect(playerCard?.classList.contains("stance-rock")).toBe(false);
      expect(computerCard?.classList.contains("stance-paper")).toBe(false);
    });

    it("should fire stance animations during combat phase", async () => {
      const data = {
        phase: "result" as const,
        playerMoveId: "rock" as Move,
        computerMoveId: "paper" as Move,
        winner: "computer" as const,
        isDoubleKO: false,
        announcementMessage: "TEST",
      };

      let stanceAnimationsTriggered = false;

      // Track calls to _waitForAnimation during the sequence
      (view as any)._waitForAnimation = jest.fn(function (
        element: HTMLElement,
      ) {
        // If we're waiting for animation on a card with a stance class, animations are firing
        if (
          (element.id === "reveal-player" ||
            element.id === "reveal-computer") &&
          Array.from(element.classList).some((cls) => cls.startsWith("stance-"))
        ) {
          stanceAnimationsTriggered = true;
        }
        return Promise.resolve();
      });

      await view.playRoundSequence(data);

      expect(stanceAnimationsTriggered).toBe(true);
    });

    it("should trigger arena-shake when rock is played", async () => {
      const data = {
        phase: "result" as const,
        playerMoveId: "rock" as Move,
        computerMoveId: "paper" as Move,
        winner: "computer" as const,
        isDoubleKO: false,
        announcementMessage: "TEST",
      };

      let arenaShakeTriggered = false;

      (view as any)._waitForAnimation = jest.fn(function (
        element: HTMLElement,
      ) {
        if (
          element.id === "move-reveal" &&
          element.classList.contains("arena-shake")
        ) {
          arenaShakeTriggered = true;
        }
        return Promise.resolve();
      });

      await view.playRoundSequence(data);

      expect(arenaShakeTriggered).toBe(true);
    });

    it("should not trigger arena-shake when neither player plays rock", async () => {
      const data = {
        phase: "result" as const,
        playerMoveId: "paper" as Move,
        computerMoveId: "scissors" as Move,
        winner: "computer" as const,
        isDoubleKO: false,
        announcementMessage: "TEST",
      };

      let arenaShakeTriggered = false;

      (view as any)._waitForAnimation = jest.fn(function (
        element: HTMLElement,
      ) {
        if (
          element.id === "move-reveal" &&
          element.classList.contains("arena-shake")
        ) {
          arenaShakeTriggered = true;
        }
        return Promise.resolve();
      });

      await view.playRoundSequence(data);

      expect(arenaShakeTriggered).toBe(false);
    });
  });

  describe("Combat Text (Floating Damage)", () => {
    beforeEach(() => {
      // Inject the required DOM structure that ArenaView expects
      document.body.innerHTML = `
        <div id="arena">
          <div id="move-reveal">
            <div id="reveal-player"></div>
            <div id="reveal-computer"></div>
          </div>
        </div>
      `;

      // Helper to mock card geometry
      const setupCardMock = (id: string) => {
        const card = document.getElementById(id);
        if (card) {
          card.getBoundingClientRect = () =>
            ({
              top: 10,
              left: 10,
              width: 100,
              height: 100,
              bottom: 110,
              right: 110,
              x: 10,
              y: 10,
              toJSON: () => {},
            }) as DOMRect;
        }
      };

      setupCardMock("reveal-player");
      setupCardMock("reveal-computer");
    });

    it("should spawn a floating damage element containing the calculated damage", async () => {
      const data = {
        phase: "result" as const,
        playerMoveId: "paper" as Move,
        computerMoveId: "rock" as Move,
        winner: "player" as const,
        isDoubleKO: false,
        announcementMessage: "PLAYER WINS!",
        damage: 25,
      };

      await view.playRoundSequence(data);
      await new Promise((resolve) => setTimeout(resolve, 0));

      const floatingTexts = document.querySelectorAll(".floating-damage");
      expect(floatingTexts.length).toBe(1);
      expect(floatingTexts[0].textContent).toBe("-25");
    });

    it("should spawn two floating damage elements during a double KO", async () => {
      const data = {
        phase: "result" as const,
        playerMoveId: "rock" as Move,
        computerMoveId: "paper" as Move,
        winner: "tie" as const,
        isDoubleKO: true,
        announcementMessage: "DOUBLE KO!",
        damage: 50,
      };

      await view.playRoundSequence(data);
      await new Promise((resolve) => setTimeout(resolve, 0));

      const floatingTexts = document.querySelectorAll(".floating-damage");
      expect(floatingTexts.length).toBe(2);
      expect(floatingTexts[0].textContent).toBe("-50");
      expect(floatingTexts[1].textContent).toBe("-50");
    });

    it("should clean up floating damage elements after the animation ends", async () => {
      const data = {
        phase: "result" as const,
        playerMoveId: "paper" as Move,
        computerMoveId: "rock" as Move,
        winner: "player" as const,
        isDoubleKO: false,
        announcementMessage: "PLAYER WINS!",
        damage: 25,
      };

      await view.playRoundSequence(data);
      await new Promise((resolve) => setTimeout(resolve, 0));

      const floater = document.querySelector(".floating-damage");
      floater?.dispatchEvent(new Event("animationend"));

      const floatingTexts = document.querySelectorAll(".floating-damage");
      expect(floatingTexts.length).toBe(0);
    });
  });
});
