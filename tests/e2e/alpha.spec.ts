import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("Octajang restores existing v4 data and transfers a backup to a new origin", async ({
  page,
  context,
}) => {
  const existing = {
    schemaVersion: 4,
    config: {
      eventName: "Entrenamiento del club",
      totalRounds: 3,
      roundDuration: 120,
      blueName: "Ana",
      blueCountry: "PER",
      redName: "Leo",
      redCountry: "ITA",
    },
    match: {
      blue: { score: 7, gamjeom: 0, hits: 1 },
      red: { score: 3, gamjeom: 1, hits: 0 },
      round: 2,
      remainingMs: 85000,
      running: false,
      status: "paused",
    },
    history: [],
    savedMatches: [],
  };
  await page.addInitScript(
    (value) =>
      localStorage.setItem("pss-taekwondo-match-v4", JSON.stringify(value)),
    existing,
  );
  await page.goto("/?view=scoring");
  await expect(page).toHaveTitle("Control · Octajang");
  await expect(
    page.locator('[data-view="scoring"] [data-bind="blueScore"]'),
  ).toHaveText("7");
  await expect(
    page.locator('[data-view="scoring"] [data-bind="clock"]'),
  ).toHaveText("01:25");
  await page
    .getByRole("button", { name: "Preparar combate", exact: true })
    .click();
  const downloading = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exportar JSON" }).click();
  const backup = await downloading;
  expect(backup.suggestedFilename()).toMatch(/^octajang-combates-.*\.json$/);
  const backupPath = await backup.path();
  if (!backupPath) throw new Error("Missing downloaded backup");
  const destination = await context.newPage();
  await destination.goto("http://localhost:4173/?view=setup");
  await expect(
    destination.getByRole("textbox", {
      name: "Nombre del competidor azul",
      exact: true,
    }),
  ).toHaveValue("Azul");
  destination.once("dialog", (dialog) => dialog.accept());
  await destination.locator("#importFile").setInputFiles(backupPath);
  await expect(destination.locator("#announcement")).toContainText(
    "Copia restaurada",
  );
  await expect(
    destination.getByRole("textbox", {
      name: "Nombre del competidor azul",
      exact: true,
    }),
  ).toHaveValue("Ana");
  await destination
    .getByRole("button", { name: "Control", exact: true })
    .click();
  await expect(
    destination.locator('[data-view="scoring"] [data-bind="blueScore"]'),
  ).toHaveText("7");
  await expect(
    destination.locator('[data-view="scoring"] [data-bind="redScore"]'),
  ).toHaveText("3");
  await expect(
    destination.locator('[data-view="scoring"] [data-bind="clock"]'),
  ).toHaveText("01:25");
  await destination.close();
});

test("Control and Marcador share fullscreen without navigation, including the external display", async ({
  page,
  context,
}) => {
  test.setTimeout(60000);
  await page.goto("/");
  await page.getByRole("button", { name: "Control", exact: true }).click();
  await page
    .getByRole("button", { name: "Marcador a pantalla completa", exact: true })
    .click();

  async function expectFullDisplay() {
    await expect(page.locator("body")).toHaveClass(/is-presenting/);
    await expect(page.locator(".app-header")).toBeHidden();
    expect(
      await page.evaluate(() => {
        const panel = document.fullscreenElement;
        const bounds = panel?.getBoundingClientRect();
        return (
          panel?.getAttribute("data-view") === "public" &&
          bounds?.width === innerWidth &&
          bounds?.height === innerHeight
        );
      }),
    ).toBe(true);
  }

  await expectFullDisplay();
  await page
    .getByRole("button", { name: "Salir de pantalla completa" })
    .click();
  await expect(page.locator("body")).toHaveAttribute(
    "data-current-view",
    "scoring",
  );
  await expect(page.locator(".app-header")).toBeVisible();

  await page.getByRole("button", { name: "Marcador", exact: true }).click();
  await page
    .getByRole("button", { name: "Pantalla completa", exact: true })
    .click();
  await expectFullDisplay();
  await page
    .getByRole("button", { name: "Salir de pantalla completa" })
    .click();
  await expect(page.locator("body")).toHaveAttribute(
    "data-current-view",
    "public",
  );
  await expect(page.locator("body")).not.toHaveClass(/is-presenting/);

  const external = await context.newPage();
  await external.goto("/?view=public");
  await external
    .getByRole("button", { name: "Pantalla completa", exact: true })
    .click();
  await expect(external.locator("body")).toHaveClass(/is-presenting/);
  await expect(external.locator("[data-mutation]:visible")).toHaveCount(0);
  expect(
    await external
      .locator('[data-view="public"]')
      .evaluate((panel) => getComputedStyle(panel).padding),
  ).toBe("0px");
  await external
    .getByRole("button", { name: "Salir de pantalla completa" })
    .click();
  await expect(external.locator("body")).not.toHaveClass(/is-presenting/);
});

test("operator, public window, clock, scores, undo, persistence and ownership", async ({
  page,
  context,
}) => {
  const fixedTime = new Date("2026-11-02T12:00:00Z");
  await page.clock.install({ time: fixedTime });
  await page.clock.pauseAt(new Date(fixedTime.getTime() + 1000));
  await page.goto("/");
  await expect(page.locator("#operatorState")).toContainText("Operador activo");
  await page.getByRole("button", { name: "Preparar un combate" }).click();
  await page
    .getByLabel("Nombre del competidor azul", { exact: true })
    .fill("Atleta azul");
  await page.getByRole("button", { name: "Guardar y abrir control" }).click();
  const scoreButton = page.getByRole("button", {
    name: "+2 puntos · azul",
    exact: true,
  });
  const initialPosition = await scoreButton.boundingBox();
  await page
    .getByRole("button", { name: "+2 puntos · azul", exact: true })
    .click();
  await expect(
    page.locator('[data-view="scoring"] [data-bind="blueScore"]'),
  ).toHaveText("2");
  expect((await scoreButton.boundingBox())?.y).toBe(initialPosition?.y);
  const publicPage = await context.newPage();
  await publicPage.goto("/?view=public");
  await expect(
    publicPage.locator('[data-view="public"] [data-bind="blueScore"]'),
  ).toHaveText("2");
  await page
    .getByRole("button", { name: "Iniciar · Shijak", exact: true })
    .click();
  await page.clock.runFor(3100);
  await expect(
    page.locator('[data-view="scoring"] [data-bind="clock"]'),
  ).toHaveText("01:57");
  await expect(
    publicPage.locator('[data-view="public"] [data-bind="clock"]'),
  ).toHaveText("01:57");
  await publicPage.reload();
  await page.clock.runFor(1100);
  await expect(
    page.locator('[data-view="scoring"] [data-bind="clock"]'),
  ).toHaveText("01:56");
  await page
    .getByRole("button", { name: "Pausar · Kal-lyeo", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: "Gam-jeom +1 para el rival · rojo",
      exact: true,
    })
    .click();
  await expect(
    publicPage.locator('[data-view="public"] [data-bind="blueScore"]'),
  ).toHaveText("3");
  await page.getByRole("button", { name: "Deshacer", exact: true }).click();
  await expect(
    publicPage.locator('[data-view="public"] [data-bind="blueScore"]'),
  ).toHaveText("2");
  await expect(
    page.locator('[data-view="scoring"] [data-bind="clock"]'),
  ).toHaveText("01:56");
  await expect(
    publicPage.getByRole("button", { name: "Iniciar · Shijak", exact: true }),
  ).not.toBeVisible();
  const duplicate = await context.newPage();
  await duplicate.goto("/");
  await expect(duplicate.locator("#warning")).toContainText("Otra pestaña");
  await duplicate.getByRole("button", { name: "Control", exact: true }).click();
  await expect(
    duplicate.getByRole("button", { name: "+2 puntos · azul", exact: true }),
  ).toBeDisabled();
  await page.reload();
  await page.getByRole("button", { name: "Control", exact: true }).click();
  await expect(
    page.locator('[data-view="scoring"] [data-bind="blueScore"]'),
  ).toHaveText("2");
  await expect(
    page.getByRole("button", { name: "Iniciar · Shijak", exact: true }),
  ).toBeEnabled();
});

test("JSON export, import validation, archive and recovery", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Control", exact: true }).click();
  await page
    .getByRole("button", { name: "+3 puntos · rojo", exact: true })
    .click();
  await page.getByText("Gestión del combate", { exact: true }).click();
  await page
    .getByRole("button", { name: "Guardar resumen", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Preparar combate", exact: true })
    .click();
  await expect(page.locator("[data-saved-match-list]")).toContainText("Rojo");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exportar JSON" }).click();
  const file = await download;
  expect(file.suggestedFilename()).toMatch(/octajang-combates.*\.json/);
  await page.locator("#importFile").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"schemaVersion":99}'),
  });
  await expect(page.locator("#warning")).toContainText("No se pudo importar");
  const path = await file.path();
  if (!path) throw new Error("Missing downloaded backup");
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("#importFile").setInputFiles(path);
  await expect(page.locator("#announcement")).toContainText("Copia restaurada");
  await page.getByRole("button", { name: "Control", exact: true }).click();
  await expect(
    page.locator('[data-view="scoring"] [data-bind="redScore"]'),
  ).toHaveText("3");
});

test("keyboard flow, reduced motion, reflow and automated accessibility", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Saltar al contenido" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#content")).toBeFocused();
  for (const view of ["home", "setup", "scoring", "public"]) {
    if (view !== "home")
      await page.locator(`.tab-button[data-view-target="${view}"]`).click();
    if (view === "scoring") {
      const management = page.locator(".match-management");
      await management.locator("summary").focus();
      await page.keyboard.press("Enter");
      await expect(management).toHaveAttribute("open", "");
      await expect(
        page.getByRole("button", { name: "Guardar resumen", exact: true }),
      ).toBeVisible();
      await page.keyboard.press("Enter");
      await expect(management).not.toHaveAttribute("open");
    }
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
    await page.setViewportSize({ width: 320, height: 800 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.setViewportSize({ width: 1440, height: 900 });
  }
  await page.goto("/guide.html");
  expect(
    (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze())
      .violations,
  ).toEqual([]);
  await page.getByRole("link", { name: "Control", exact: true }).click();
  await expect(page.locator("body")).toHaveAttribute(
    "data-current-view",
    "scoring",
  );
  await page
    .getByRole("link", { name: "Guía del proyecto", exact: true })
    .click();
  await page
    .getByRole("link", { name: "Preparar combate", exact: true })
    .click();
  await expect(page.locator("body")).toHaveAttribute(
    "data-current-view",
    "setup",
  );
});

test("duration presets, manual entry, saved configuration and read-only session", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Preparar un combate", exact: true })
    .click();
  const preset = page.getByRole("button", {
    name: "1:30 por ronda",
    exact: true,
  });
  await preset.click();
  await expect(page.locator("#setupRoundMinutes")).toHaveValue("1");
  await expect(page.locator("#setupRoundSeconds")).toHaveValue("30");
  await page.locator("#setupRoundSeconds").fill("45");
  await expect(preset).toHaveAttribute("aria-pressed", "false");
  await preset.click();
  await page
    .getByRole("button", { name: "Guardar y abrir control", exact: true })
    .click();
  await expect(
    page.locator('[data-view="scoring"] [data-bind="clock"]'),
  ).toHaveText("01:30");
  await page
    .getByRole("button", { name: "Preparar combate", exact: true })
    .click();
  await expect(preset).toHaveAttribute("aria-pressed", "true");
  const observer = await context.newPage();
  await observer.goto("/");
  await observer
    .getByRole("button", { name: "Preparar combate", exact: true })
    .click();
  await expect(
    observer.getByRole("button", { name: "1:30 por ronda", exact: true }),
  ).toBeDisabled();
});
