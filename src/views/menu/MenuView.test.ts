/**
 * @jest-environment jsdom
 */
import menuView from "./MenuView";

describe("MenuView", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section id="initial-controls">
        <button id="start">Start Match</button>
        <button id="reset-game-state">Reset Game State</button>
      </section>
    `;
  });
});
