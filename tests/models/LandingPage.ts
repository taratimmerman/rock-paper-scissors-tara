import { expect, Locator, Page } from "@playwright/test";
import { verifyIsVisible } from "../utils/verification";

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
    await verifyIsVisible(this.continueButton, isVisible);
  }

  async verifyHeadingVisible(isVisible = true): Promise<void> {
    await verifyIsVisible(this.heading, isVisible);
  }

  async verifyResetButtonVisible(isVisible = true): Promise<void> {
    await verifyIsVisible(this.resetGameButton, isVisible);
  }

  async verifyStartButtonVisible(isVisible = true): Promise<void> {
    await verifyIsVisible(this.startButton, isVisible);
  }
}
