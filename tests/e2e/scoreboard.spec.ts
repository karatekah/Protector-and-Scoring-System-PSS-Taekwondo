import { expect, test } from "@playwright/test";

test("approved scoreboard keeps real sides, marks the leader and clears the highlight on a tie", async ({
  page,
  context,
}) => {
  await page.goto("/control");
  await expect(
    page.locator(".score-grid > .fighter-panel").first(),
  ).toHaveClass(/red-panel/);
  await expect(page.locator(".judge-side").first()).toHaveClass(/red-judge/);
  await expect(page.locator('[data-bind="clock"]')).toHaveText("2:00");
  await expect(page.locator(".bout-number strong")).toHaveText("—");
  await expect(page.locator(".board-maker")).toHaveText("Made by Karatekah");
  await page
    .getByRole("button", { name: "+4 puntos · rojo", exact: true })
    .click();
  await expect(page.locator('.red-panel [data-bind="redScore"]')).toHaveCSS(
    "color",
    "rgb(234, 255, 0)",
  );
  const display = await context.newPage();
  await display.goto("/marcador");
  await expect(display.locator('[data-bind="redScore"]')).toHaveText("4");
  await expect(display.locator('.red-panel [data-bind="redScore"]')).toHaveCSS(
    "color",
    "rgb(234, 255, 0)",
  );
  await page
    .getByRole("button", { name: "+4 puntos · azul", exact: true })
    .click();
  for (const side of ["red", "blue"]) {
    await expect(display.locator(`.${side}-panel .score-value`)).toHaveCSS(
      "color",
      "rgb(244, 244, 255)",
    );
  }
  await expect(page.locator('[data-action="hit"]')).toHaveCount(0);
});
