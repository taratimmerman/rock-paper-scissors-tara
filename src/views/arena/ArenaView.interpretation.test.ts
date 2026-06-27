/**
 * @jest-environment jsdom
 *
 * Unit tests for ArenaView's interpretation logic (decision-making).
 *
 * This test file focuses on the private helper methods that interpret game state
 * and decide which announcement events to emit. This demonstrates the
 * "View owns UI interpretation" pattern and makes the decision logic testable.
 */
import ArenaView from "./ArenaView";
import { RoundResult } from "../../utils/dataObjectUtils";

describe("ArenaView Interpretation Logic", () => {
  let view: ArenaView;

  beforeEach(() => {
    document.body.innerHTML = `<div id="arena"></div>`;
    view = new ArenaView();
    (view as any)._waitForAnimation = jest.fn().mockResolvedValue(undefined);
  });

  describe("determineRoundAnnouncement", () => {
    it("returns DOUBLE_KO event when both players take mutual damage", () => {
      const roundResult: RoundResult = {
        winner: "tie",
        isDoubleKO: true,
        damageCalculated: 25,
      };

      const event = (view as any).determineRoundAnnouncement(roundResult);

      expect(event.type).toBe("DOUBLE_KO");
    });

    it("returns PLAYER_WIN event when player wins the round", () => {
      const roundResult: RoundResult = {
        winner: "player",
        isDoubleKO: false,
        damageCalculated: 30,
      };

      const event = (view as any).determineRoundAnnouncement(roundResult);

      expect(event.type).toBe("PLAYER_WIN");
      expect((event as any).payload.winner).toBe("player");
    });

    it("returns PLAYER_WIN event when computer wins the round", () => {
      const roundResult: RoundResult = {
        winner: "computer",
        isDoubleKO: false,
        damageCalculated: 30,
      };

      const event = (view as any).determineRoundAnnouncement(roundResult);

      expect(event.type).toBe("PLAYER_WIN");
      expect((event as any).payload.winner).toBe("computer");
    });

    it("returns TIE event when round is a tie (non-double-KO)", () => {
      const roundResult: RoundResult = {
        winner: "tie",
        isDoubleKO: false,
        damageCalculated: 0,
      };

      const event = (view as any).determineRoundAnnouncement(roundResult);

      expect(event.type).toBe("TIE");
    });

    it("prioritizes DOUBLE_KO over TIE even if winner is tie", () => {
      // Edge case: both double KO'd AND it's a tie
      const roundResult: RoundResult = {
        winner: "tie",
        isDoubleKO: true,
        damageCalculated: 25,
      };

      const event = (view as any).determineRoundAnnouncement(roundResult);

      // Should emit DOUBLE_KO, not TIE
      expect(event.type).toBe("DOUBLE_KO");
    });
  });

  describe("determineMatchAnnouncement", () => {
    it("returns MATCH_DOUBLE_KO when isDoubleKO is true", () => {
      const event = (view as any).determineMatchAnnouncement("player", true);

      expect(event.type).toBe("MATCH_DOUBLE_KO");
    });

    it("returns MATCH_WINNER with winner=player when player wins", () => {
      const event = (view as any).determineMatchAnnouncement("player", false);

      expect(event.type).toBe("MATCH_WINNER");
      expect((event as any).payload.winner).toBe("player");
    });

    it("returns MATCH_WINNER with winner=computer when computer wins", () => {
      const event = (view as any).determineMatchAnnouncement("computer", false);

      expect(event.type).toBe("MATCH_WINNER");
      expect((event as any).payload.winner).toBe("computer");
    });

    it("ignores winner parameter when isDoubleKO is true", () => {
      // Even though player is passed, should emit MATCH_DOUBLE_KO
      const event = (view as any).determineMatchAnnouncement("player", true);

      expect(event.type).toBe("MATCH_DOUBLE_KO");
      expect((event as any).payload).toBeUndefined();
    });
  });

  /**
   * Integration test: Verifies that public methods use the helper methods correctly
   */
  describe("Integration: Public methods call helpers", () => {
    it("playRoundResult calls determineRoundAnnouncement and setAnnouncement", () => {
      const setAnnouncementSpy = jest.spyOn(view, "setAnnouncement");

      const roundResult: RoundResult = {
        winner: "player",
        isDoubleKO: false,
        damageCalculated: 30,
      };

      view.playRoundResult(roundResult);

      expect(setAnnouncementSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "PLAYER_WIN" }),
      );
    });

    it("playMatchResult calls determineMatchAnnouncement and setAnnouncement", () => {
      const setAnnouncementSpy = jest.spyOn(view, "setAnnouncement");

      view.playMatchResult("computer", false);

      expect(setAnnouncementSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "MATCH_WINNER",
          payload: { winner: "computer" },
        }),
      );
    });
  });
});
