/**
 * @jest-environment jsdom
 */
import scoreView from "./ScoreView";

describe("ScoreView", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <!-- Scoreboard Table -->
      <table id="scoreboard">
        <caption>
          Scoreboard (Match Wins)
        </caption>
        <thead>
          <tr>
            <th>Player</th>
            <th>Computer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td id="player-score">0</td>
            <td id="computer-score">0</td>
          </tr>
        </tbody>
      </table>
      `;
  });

  // ===== General Tests =====
});
