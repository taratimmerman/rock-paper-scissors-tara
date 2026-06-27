/**
 * @jest-environment jsdom
 *
 * Unit tests for StatusView's interpretation logic (event translation).
 *
 * This test file focuses on the private helper method that interprets semantic events
 * and translates them to localized messages. This demonstrates how Views handle
 * UI text translation and makes the logic testable.
 */
import StatusView from "./StatusView";
import { StatusViewEvent } from "./IStatusView";

describe("StatusView Interpretation Logic", () => {
  let view: StatusView;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="status-container"></div>
    `;
    view = new StatusView();
    view.render({ message: "" });
  });

  describe("translateEvent", () => {
    it("translates READY event to status_ready message", () => {
      const message = (view as any).translateEvent({ type: "READY" });

      expect(message).toBe("Get ready...");
    });

    it("translates LOCK_IN event to status_lockIn message", () => {
      const message = (view as any).translateEvent({ type: "LOCK_IN" });

      expect(message).toBe("Locking in move...");
    });

    it("translates PREPARE event to status_prepare message", () => {
      const message = (view as any).translateEvent({ type: "PREPARE" });

      expect(message).toBe("Prepare your next move...");
    });

    it("translates CHOOSE event to status_choose message", () => {
      const message = (view as any).translateEvent({ type: "CHOOSE" });

      expect(message).toBe("Choose your attack!");
    });

    it("returns raw message for CUSTOM event without translation", () => {
      const customMessage = "This is a custom message";
      const event: StatusViewEvent = {
        type: "CUSTOM",
        message: customMessage,
      };

      const message = (view as any).translateEvent(event);

      expect(message).toBe(customMessage);
    });

    it("throws error for unknown event type (exhaustiveness check)", () => {
      const unknownEvent = { type: "UNKNOWN" };

      expect(() => {
        (view as any).translateEvent(unknownEvent);
      }).toThrow("Unhandled event type");
    });
  });

  describe("Integration: handleEvent uses translateEvent", () => {
    it("handleEvent translates event and updates message", () => {
      const setMessageSpy = jest.spyOn(view, "setMessage");

      view.handleEvent({ type: "READY" });

      expect(setMessageSpy).toHaveBeenCalledWith("Get ready...");
    });

    it("handleEvent uses translator for all event types", () => {
      const events: StatusViewEvent[] = [
        { type: "READY" },
        { type: "LOCK_IN" },
        { type: "PREPARE" },
        { type: "CHOOSE" },
        { type: "CUSTOM", message: "Test" },
      ];

      for (const event of events) {
        expect(() => view.handleEvent(event)).not.toThrow();
      }
    });
  });

  describe("announceRound", () => {
    it("translates move names to localized round announcement", () => {
      const setMessageSpy = jest.spyOn(view, "setMessage");

      view.announceRound("Rock", "Paper");

      expect(setMessageSpy).toHaveBeenCalledWith(
        "You played Rock. Computer played Paper.",
      );
    });

    it("handles different move combinations correctly", () => {
      const setMessageSpy = jest.spyOn(view, "setMessage");

      view.announceRound("Scissors", "Scissors");

      expect(setMessageSpy).toHaveBeenCalledWith(
        "You played Scissors. Computer played Scissors.",
      );
    });

    it("works with capitalized move names", () => {
      const setMessageSpy = jest.spyOn(view, "setMessage");

      view.announceRound("ROCK", "PAPER");

      expect(setMessageSpy).toHaveBeenCalledWith(
        "You played ROCK. Computer played PAPER.",
      );
    });
  });

  /**
   * Behavior verification: Ensures the view properly handles all game flow states
   */
  describe("Game Flow State Transitions", () => {
    it("handles typical game flow: READY → PREPARE → CHOOSE → LOCK_IN → ROUND_RESULT", () => {
      const setMessageSpy = jest.spyOn(view, "setMessage");

      view.handleEvent({ type: "READY" });
      expect(setMessageSpy).toHaveBeenLastCalledWith("Get ready...");

      view.handleEvent({ type: "PREPARE" });
      expect(setMessageSpy).toHaveBeenLastCalledWith(
        "Prepare your next move...",
      );

      view.handleEvent({ type: "CHOOSE" });
      expect(setMessageSpy).toHaveBeenLastCalledWith("Choose your attack!");

      view.handleEvent({ type: "LOCK_IN" });
      expect(setMessageSpy).toHaveBeenLastCalledWith("Locking in move...");

      view.announceRound("Rock", "Paper");
      expect(setMessageSpy).toHaveBeenLastCalledWith(
        "You played Rock. Computer played Paper.",
      );

      expect(setMessageSpy).toHaveBeenCalledTimes(5);
    });
  });
});
