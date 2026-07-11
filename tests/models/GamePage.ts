import { expect, Locator, Page } from "@playwright/test";

export enum Move {
  PAPER = "paper",
  ROCK = "rock",
  SCISSORS = "scissors",
  TARA = "tara",
}

export class GamePage {
  readonly page: Page;

  readonly statusContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.statusContainer = this.page.locator("#status");
  }

  // ====================================================
  // DYNAMIC LOCATORS
  // ====================================================

  playerAction(action: Move): Locator {
    return this.page.getByRole("button", { name: new RegExp(action, "i") });
  }

  // ====================================================
  // ACTIONS
  // ====================================================

  async choosePlayerAction(action: Move): Promise<void> {
    await this.playerAction(action).click();
  }

  // ====================================================
  // VERIFICATION
  // ====================================================

  async verifyPlayerActionAnnouncement(playerAction: Move): Promise<void> {
    const regex = new RegExp(`you played ${playerAction}`, "i");
    await expect(this.statusContainer).toContainText(regex);
  }

  async verifyPlayerButtonsVisible(isVisible = true): Promise<void> {
    for (const action of Object.values(Move)) {
      await expect(this.playerAction(action)).toBeVisible({
        visible: isVisible,
      });
    }
  }

  async verifyStatusVisible(isVisible = true): Promise<void> {
    await expect(this.statusContainer).toBeVisible({ visible: isVisible });
  }

  async verifyTaraEnabled(isEnabled = true): Promise<void> {
    await expect(this.playerAction(Move.TARA)).toBeEnabled({
      enabled: isEnabled,
    });
  }
}
