import { expect, Locator, Page } from "@playwright/test";

export class LandingPage {
  readonly page: Page;

  readonly continueButton: Locator;
  readonly heading: Locator;
  readonly resetGameButton: Locator;
  readonly startButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.continueButton = page.getByRole("button", { name: /continue match/i });
    this.heading = page.getByRole("heading", {
      name: /rock paper scissors tara/i,
    });
    this.resetGameButton = page.getByRole("button", { name: /reset game/i });
    this.startButton = page.getByRole("button", {
      name: /start match/i,
    });
  }

  // ====================================================
  // ACTIONS
  // ====================================================

  async continueMatch(): Promise<void> {
    await this.continueButton.click();
  }

  async resetGame(): Promise<void> {
    await this.resetGameButton.click();
  }

  async startMatch(): Promise<void> {
    await this.startButton.click();
  }

  // ====================================================
  // VERIFICATION
  // ====================================================

  async verifyContinueButtonVisible(isVisible = true): Promise<void> {
    await expect(this.continueButton).toBeVisible({ visible: isVisible });
  }

  async verifyHeadingVisible(isVisible = true): Promise<void> {
    await expect(this.heading).toBeVisible({ visible: isVisible });
  }

  async verifyResetButtonVisible(isVisible = true): Promise<void> {
    await expect(this.resetGameButton).toBeVisible({ visible: isVisible });
  }

  async verifyStartButtonVisible(isVisible = true): Promise<void> {
    await expect(this.startButton).toBeVisible({ visible: isVisible });
  }
}
