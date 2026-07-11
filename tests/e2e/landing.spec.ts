import { test } from "../baseTest";

test("should load the initial game UI successfully", async ({
  gamePage,
  landingPage,
}) => {
  await landingPage.verifyHeadingVisible();
  await landingPage.startMatch();
  await landingPage.verifyHeadingVisible(false);

  await gamePage.verifyPlayerButtonsVisible();
  await gamePage.verifyTaraEnabled(false);
});
