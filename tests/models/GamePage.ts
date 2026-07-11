import { expect, Locator, Page } from "@playwright/test";

export enum Move {
  PAPER = "paper",
  ROCK = "rock",
  SCISSORS = "scissors",
  TARA = "tara",
}

export class GamePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  playerAction(action: Move): Locator {
    return this.page.getByRole("button", { name: new RegExp(action, "i") });
  }

  playerActionAnnouncement(playerAction: Move): Locator {
    const regex = new RegExp(`you played ${playerAction}`, "i");
    return this.page.getByText(regex);
  }

  async verifyPlayerActionAnnouncement(playerAction: Move): Promise<void> {
    await expect(this.playerActionAnnouncement(playerAction)).toBeVisible();
  }

  async verifyPlayerButtonsVisible(isVisible = true): Promise<void> {
    for (const action of Object.values(Move)) {
      await expect(this.playerAction(action)).toBeVisible({
        visible: isVisible,
      });
    }
  }

  async choosePlayerAction(action: Move): Promise<void> {
    await this.playerAction(action).click();
  }

  async verifyTaraEnabled(isEnabled = true): Promise<void> {
    await expect(this.playerAction(Move.TARA)).toBeEnabled({
      enabled: isEnabled,
    });
  }
}
