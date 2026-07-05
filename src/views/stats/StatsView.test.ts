/**
 * @jest-environment jsdom
 */
import { MOVES, MOVES_DATABASE } from "../../utils/dataUtils";
import StatsView from "./StatsView";
import { StatsViewData } from "./IStatsView";

describe("StatsView", () => {
  let view: StatsView;
  let defaultData: StatsViewData;

  beforeEach(() => {
    // 1. Scaffold only the mount point, just like the real index.html
    document.body.innerHTML = `<section id="game-stats"></section>`;

    view = new StatsView();

    // 2. Setup baseline data for rendering
    defaultData = {
      playerHealth: 100,
      computerHealth: 100,
      playerScore: 0,
      computerScore: 0,
      playerTara: 0,
      computerTara: 0,
      playerMostCommonMove: null,
      computerMostCommonMove: null,
      matchNumber: 1,
      roundNumber: 1,
    };
  });

  describe("toggleGameStatsVisibility()", () => {
    test("adds or removes the hidden class on the main stats container", () => {
      // Must update first so the parent element is cached
      view.update(defaultData);
      const statsContainer = document.getElementById("game-stats")!;

      view.toggleGameStatsVisibility(false);
      expect(statsContainer.classList.contains("hidden")).toBe(true);

      view.toggleGameStatsVisibility(true);
      expect(statsContainer.classList.contains("hidden")).toBe(false);
    });
  });

  describe("update()", () => {
    test("generates and injects the full markup on first call (initial render)", () => {
      view.update(defaultData);

      expect(document.getElementById("player-health")!.style.width).toBe(
        "100%",
      );
      expect(document.getElementById("computer-health")!.style.width).toBe(
        "100%",
      );
      // Finds the <span> inside the score-row
      expect(
        document.querySelector("#player-stats .score-row span")!.textContent,
      ).toBe("00");
      expect(
        document.querySelector("#game-progress-container h2")!.textContent,
      ).toBe("Match 1");
    });

    test("hides all signature move icons when common move is null", () => {
      view.update(defaultData); // defaultData has null for most common moves

      // Query for any signature slots that DO NOT have the 'hidden' class
      const playerVisibleIcons = document.querySelectorAll(
        "#player-stats .signature-icon-slot:not(.hidden)",
      );
      const computerVisibleIcons = document.querySelectorAll(
        "#computer-stats .signature-icon-slot:not(.hidden)",
      );

      // Since the move is null, no icons should be visible (length of 0)
      expect(playerVisibleIcons.length).toBe(0);
      expect(computerVisibleIcons.length).toBe(0);
    });

    test("updates health bar width attributes without replacing elements (diff on subsequent calls)", () => {
      // First call does initial render
      view.update(defaultData);
      const oldPlayerHealthBar = document.getElementById("player-health")!;

      // Second call uses diff update
      const newData = { ...defaultData, playerHealth: 45, computerHealth: 12 };
      view.update(newData);

      const newPlayerHealthBar = document.getElementById("player-health")!;

      expect(newPlayerHealthBar.style.width).toBe("45%");
      expect(document.getElementById("computer-health")!.style.width).toBe(
        "12%",
      );

      // Crucial check: ensures DOM diffing worked and didn't just wipe innerHTML
      expect(newPlayerHealthBar).toBe(oldPlayerHealthBar);
    });

    test("updates scores and pads them correctly", () => {
      // First call does initial render
      view.update(defaultData);

      // Second call uses diff update
      const newData = { ...defaultData, playerScore: 5, computerScore: 12 };
      view.update(newData);

      expect(
        document.querySelector("#player-stats .score-row span:first-child")!
          .textContent,
      ).toBe("05");
      expect(
        document.querySelector("#computer-stats .score-row span:last-child")!
          .textContent,
      ).toBe("12");
    });

    test("updates most common moves by toggling the hidden class on the correct icon slot", () => {
      // First call does initial render
      view.update(defaultData);

      // Second call uses diff update
      const newData = {
        ...defaultData,
        playerMostCommonMove: MOVES.ROCK,
        computerMostCommonMove: MOVES.PAPER,
      };
      view.update(newData);

      // Select specific move slots for both players based on the data-move attribute
      const playerRockSlot = document.querySelector(
        '#player-stats .common-icon-slot[data-move="rock"]',
      )!;
      const playerPaperSlot = document.querySelector(
        '#player-stats .common-icon-slot[data-move="paper"]',
      )!;

      const computerPaperSlot = document.querySelector(
        '#computer-stats .common-icon-slot[data-move="paper"]',
      )!;
      const computerRockSlot = document.querySelector(
        '#computer-stats .common-icon-slot[data-move="rock"]',
      )!;

      // Player checks: Rock should be visible, Paper should be hidden
      expect(playerRockSlot.classList.contains("hidden")).toBe(false);
      expect(playerPaperSlot.classList.contains("hidden")).toBe(true);

      // Computer checks: Paper should be visible, Rock should be hidden
      expect(computerPaperSlot.classList.contains("hidden")).toBe(false);
      expect(computerRockSlot.classList.contains("hidden")).toBe(true);
    });

    test("renders tara icons using the shared move definition", () => {
      view.update(defaultData);

      const taraIcon = document.querySelector(
        ".tara-icon-wrapper img",
      ) as HTMLImageElement | null;

      expect(taraIcon).not.toBeNull();
      expect(taraIcon?.getAttribute("src")).toBe(MOVES_DATABASE.TARA.icon);
    });
  });
});
