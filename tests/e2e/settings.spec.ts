import { expect, test } from "../baseTest";

test("uses system appearance by default and allows an explicit theme", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.evaluate(() => localStorage.removeItem("themePreference"));
  await page.reload();

  const root = page.locator("html");
  await expect(root).toHaveAttribute("data-theme", "dark");

  await page.getByRole("button", { name: "Settings" }).click();
  const dialog = page.getByRole("dialog", { name: "Settings" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("radio", { name: "System" })).toBeChecked();

  await dialog.getByRole("radio", { name: "Dark" }).check();
  await expect(root).toHaveAttribute("data-theme", "dark");
  await expect
    .poll(() =>
      root.evaluate((element) =>
        getComputedStyle(element).getPropertyValue("--color-bg").trim(),
      ),
    )
    .toBe("#17211f");

  await page.emulateMedia({ colorScheme: "light" });
  await page.reload();
  await expect(root).toHaveAttribute("data-theme", "dark");
  expect(await page.evaluate(() => localStorage.getItem("themePreference"))).toBe(
    "dark",
  );
});

test("system selection follows the current system color scheme", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.evaluate(() => localStorage.removeItem("themePreference"));
  await page.reload();
  await page.getByRole("button", { name: "Settings" }).click();

  const dialog = page.getByRole("dialog", { name: "Settings" });
  await dialog.getByRole("radio", { name: "System" }).check();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});