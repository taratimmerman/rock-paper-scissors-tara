import { expect, Locator } from "@playwright/test";

export async function verifyIsVisible(
  element: Locator,
  isVisible = true,
): Promise<void> {
  await expect(element).toBeVisible({ visible: isVisible });
}
