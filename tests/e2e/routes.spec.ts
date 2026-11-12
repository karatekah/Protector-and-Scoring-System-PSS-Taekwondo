import { expect, test } from "@playwright/test";

test("each clean route serves its own module and survives refresh", async ({
  page,
  request,
}) => {
  for (const [path, view] of [
    ["/", "home"],
    ["/preparar", "setup"],
    ["/control", "scoring"],
    ["/marcador", "public"],
    ["/guia", "guide"],
  ]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html.match(/data-view="/g)).toHaveLength(1);
    expect(html).toContain(`data-view="${view}"`);
    await page.goto(path);
    await expect(page.locator("body")).toHaveAttribute(
      "data-current-view",
      view,
    );
    await expect(page.locator("#view-outlet > [data-view]")).toHaveCount(1);
    await page.reload();
    await expect(page.locator("body")).toHaveAttribute(
      "data-current-view",
      view,
    );
    expect(new URL(page.url()).pathname).toBe(path);
  }
});

test("guide navigation and browser history preserve the running match", async ({
  page,
  context,
}) => {
  const fixedTime = new Date("2026-11-12T12:00:00Z");
  await page.clock.install({ time: fixedTime });
  await page.clock.pauseAt(new Date(fixedTime.getTime() + 1000));
  await page.goto("/control");
  await page
    .getByRole("button", { name: "+3 puntos · azul", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Iniciar · Shijak", exact: true })
    .click();
  const display = await context.newPage();
  await display.goto("/marcador");
  await page.clock.runFor(2100);
  await page
    .getByRole("link", { name: "Guía del proyecto", exact: true })
    .click();
  await expect(page).toHaveURL(/\/guia$/);
  await page.clock.runFor(2000);
  await expect(display.locator('[data-bind="clock"]')).toHaveText("01:56");
  await page.goBack();
  await expect(page).toHaveURL(/\/control$/);
  await expect(
    page.getByRole("button", { name: "Pausar · Kal-lyeo", exact: true }),
  ).toBeEnabled();
  await expect(
    page.locator('[data-view="scoring"] [data-bind="blueScore"]'),
  ).toHaveText("3");
  await page.clock.runFor(1000);
  await expect(
    page.locator('[data-view="scoring"] [data-bind="clock"]'),
  ).toHaveText("01:55");
  await page.goForward();
  await expect(page).toHaveURL(/\/guia$/);
  await page.getByRole("link", { name: "Control", exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Iniciar · Shijak", exact: true }),
  ).toBeEnabled();
  await expect(
    page.locator('[data-view="scoring"] [data-bind="blueScore"]'),
  ).toHaveText("3");
});

test("standalone guide and scoreboard never reserve the operator lock", async ({
  page,
  context,
}) => {
  await page.goto("/guia");
  expect(
    await page.evaluate(() => localStorage.getItem("pss-taekwondo-match-v4")),
  ).toBeNull();
  const control = await context.newPage();
  await control.goto("/control");
  await expect(control.locator("#operatorState")).toContainText(
    "Operador activo",
  );
  await control
    .getByRole("button", { name: "+2 puntos · azul", exact: true })
    .click();
  const stored = await control.evaluate(() =>
    localStorage.getItem("pss-taekwondo-match-v4"),
  );
  const display = await context.newPage();
  await display.goto("/marcador");
  await expect(
    display.locator('[data-view="public"] [data-bind="blueScore"]'),
  ).toHaveText("2");
  expect(
    await display.evaluate(() =>
      localStorage.getItem("pss-taekwondo-match-v4"),
    ),
  ).toBe(stored);
  const held = await display.evaluate(
    async () =>
      (await navigator.locks.query()).held?.filter(
        (lock) => lock.name === "pss-taekwondo-operator-v4",
      ).length,
  );
  expect(held).toBe(1);
});

test("legacy query links and guide bookmarks reach canonical routes", async ({
  page,
}) => {
  await page.goto("/?view=setup");
  await expect(page).toHaveURL(/\/preparar$/);
  await page.goto("/index.html?view=public");
  await expect(page).toHaveURL(/\/marcador$/);
  await expect(page.locator("#operatorState")).toContainText("solo lectura");
  await page.goto("/guide.html#target-stack", { waitUntil: "commit" });
  await expect(page).toHaveURL(/\/guia#target-stack$/);
  await expect(page.locator("body")).toHaveAttribute(
    "data-current-view",
    "guide",
  );
});
