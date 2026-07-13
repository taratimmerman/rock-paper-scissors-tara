import { expect, Locator, Page } from "@playwright/test";
import {
  MAX_TARA_MOVES,
  Move,
  Participant,
  Progress,
  Stats,
} from "../utils/data";
import { verifyIsVisible } from "../utils/verification";

export class GamePage {
  readonly page: Page;

  readonly announcementContainer: Locator;
  readonly progressContainer: Locator;
  readonly progressMatchHeading: Locator;
  readonly progressRoundHeading: Locator;
  readonly statusContainer: Locator;

  constructor(page: Page) {
    this.page = page;

    this.announcementContainer = page.locator("#announcement-container");
    this.progressContainer = page.locator("#game-progress-container");
    this.progressMatchHeading = this.progressContainer.locator("h2");
    this.progressRoundHeading = this.progressContainer.locator("h3");
    this.statusContainer = page.locator("#status");
  }

  // ====================================================
  // DYNAMIC LOCATORS
  // ====================================================

  playerAction(action: Move): Locator {
    return this.page.getByRole("button", { name: new RegExp(action, "i") });
  }

  statsContainer(participant: Participant): Locator {
    return this.page.locator(`#${participant}-stats`);
  }

  statsCommonMoveContainer(participant: Participant): Locator {
    return this.statsContainer(participant).locator(".common-move-slot");
  }

  statsCommonMoveIcon(participant: Participant, move: Move): Locator {
    return this.statsContainer(participant).locator(
      `.common-icon-slot[data-move="${move}"]`,
    );
  }

  statsHealthBar(participant: Participant): Locator {
    return this.page.locator(`#${participant}-health`);
  }

  statsTaraIcons(participant: Participant, isActive: boolean): Locator {
    const stateSelector = isActive ? ":not(.tara-inactive)" : ".tara-inactive";
    return this.page.locator(
      `.${participant}-tara-container .tara-icon-wrapper${stateSelector}`,
    );
  }

  statsVisibleCommonMoveIcons(participant: Participant): Locator {
    return this.statsCommonMoveContainer(participant).locator(
      ".common-icon-slot:not(.hidden)",
    );
  }

  statsWins(participant: Participant): Locator {
    return this.statsContainer(participant).locator(".score-row");
  }

  // ====================================================
  // ACTIONS
  // ====================================================

  async choosePlayerAction(action: Move): Promise<void> {
    await this.playerAction(action).click();
  }

  async setComputerMove(move: Move): Promise<void> {
    await this.page.evaluate((m) => {
      sessionStorage.setItem("__E2E_NEXT_COMPUTER_MOVE__", m);
    }, move);
  }

  // ====================================================
  // VERIFICATION MISCELLANEOUS
  // ====================================================

  async verifyAnnouncement(
    expectedAnnouncement: RegExp | string,
  ): Promise<void> {
    await expect(this.announcementContainer).toContainText(
      expectedAnnouncement,
    );
  }

  async verifyPlayerButtonsVisible(isVisible = true): Promise<void> {
    await Promise.all(
      Object.values(Move).map((action) =>
        verifyIsVisible(this.playerAction(action), isVisible),
      ),
    );
  }

  async verifyProgress(progress: Progress): Promise<void> {
    await Promise.all([
      expect(this.progressMatchHeading).toContainText(
        new RegExp(`match ${progress.match}`, "i"),
      ),
      expect(this.progressRoundHeading).toContainText(
        new RegExp(`round ${progress.round}`, "i"),
      ),
    ]);
  }

  async verifyStatus(expectedStatus: RegExp | string): Promise<void> {
    await expect(this.statusContainer).toContainText(expectedStatus);
  }

  async verifyStatusVisible(isVisible = true): Promise<void> {
    await verifyIsVisible(this.statusContainer, isVisible);
  }

  async verifyTaraEnabled(isEnabled = true): Promise<void> {
    await expect(this.playerAction(Move.TARA)).toBeEnabled({
      enabled: isEnabled,
    });
  }

  // ====================================================
  // VERIFICATION STATS
  // ====================================================

  async verifyStats(
    participant: Participant,
    expectedStats: Stats,
  ): Promise<void> {
    await Promise.all([
      this.verifyStatsWins(participant, expectedStats.wins),
      this.verifyStatsHealth(participant, expectedStats.health),
      this.verifyStatsTaraIcons(participant, expectedStats.availableTaraMoves),
      this.verifyCommonMove(participant, expectedStats.commonMove),
    ]);
  }

  private async verifyCommonMove(
    participant: Participant,
    expectedMove: Move | null,
  ): Promise<void> {
    if (expectedMove === null) {
      await this.verifyStatsVisibleCommonMoveIcons(participant, 0);
      return;
    }

    const moveIcon = this.statsCommonMoveIcon(participant, expectedMove);

    await Promise.all([
      this.verifyStatsVisibleCommonMoveIcons(participant, 1),
      expect(moveIcon).not.toHaveClass(/hidden/),
      expect(moveIcon).toBeVisible(),
    ]);
  }

  private async verifyStatsVisibleCommonMoveIcons(
    participant: Participant,
    expectedCount: number,
  ): Promise<void> {
    await expect(this.statsVisibleCommonMoveIcons(participant)).toHaveCount(
      expectedCount,
    );
  }

  private async verifyStatsHealth(
    participant: Participant,
    expectedPercentage: number,
  ): Promise<void> {
    const styleRegex = new RegExp(`width:\\s*${expectedPercentage}%`, "i");
    await expect(this.statsHealthBar(participant)).toHaveAttribute(
      "style",
      styleRegex,
    );
  }

  private async verifyStatsTaraIcons(
    participant: Participant,
    expectedActiveIcons: number,
  ): Promise<void> {
    await Promise.all([
      expect(this.statsTaraIcons(participant, true)).toHaveCount(
        expectedActiveIcons,
      ),
      expect(this.statsTaraIcons(participant, false)).toHaveCount(
        MAX_TARA_MOVES - expectedActiveIcons,
      ),
    ]);
  }

  private async verifyStatsWins(
    participant: Participant,
    expectedWins: number,
  ): Promise<void> {
    const statsWins = this.statsWins(participant);

    // Formats 1 -> "01", 0 -> "00", but leaves 10 -> "10"
    const formattedWins = expectedWins.toString().padStart(2, "0");

    await Promise.all([
      expect(statsWins).toContainText("WINS"),
      expect(statsWins).toContainText(formattedWins),
    ]);
  }
}
