import { expect, Locator, Page } from "@playwright/test";

export class LandingPage {
  readonly page: Page;

  readonly heading: Locator;
  readonly startButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole("heading", {
      name: /rock paper scissors tara/i,
    });
    this.startButton = page.getByRole("button", { name: /start match/i });
  }

  // ====================================================
  // ACTIONS
  // ====================================================

  async startMatch(): Promise<void> {
    await this.startButton.click();
  }

  // ====================================================
  // VERIFICATION
  // ====================================================

  async verifyHeadingVisible(isVisible = true): Promise<void> {
    await expect(this.heading).toBeVisible({ visible: isVisible });
  }
}
