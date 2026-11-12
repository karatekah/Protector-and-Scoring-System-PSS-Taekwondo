import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
import { createState, snapshot } from "../../src/match";

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
    .getByRole("link", { name: "Preparar combate", exact: true })
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
  await destination.getByRole("link", { name: "Control", exact: true }).click();
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
  await page.getByRole("link", { name: "Control", exact: true }).click();
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

  await page.getByRole("link", { name: "Marcador", exact: true }).click();
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
  await duplicate.getByRole("link", { name: "Control", exact: true }).click();
  await expect(
    duplicate.getByRole("button", { name: "+2 puntos · azul", exact: true }),
  ).toBeDisabled();
  await page.reload();
  await page.getByRole("link", { name: "Control", exact: true }).click();
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
  await page.getByRole("link", { name: "Control", exact: true }).click();
  await page
    .getByRole("button", { name: "+3 puntos · rojo", exact: true })
    .click();
  await page.getByText("Gestión del combate", { exact: true }).click();
  await page
    .getByRole("button", { name: "Guardar resumen", exact: true })
    .click();
  await page
    .getByRole("link", { name: "Preparar combate", exact: true })
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
  await page.getByRole("link", { name: "Control", exact: true }).click();
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
  await page.goto("/guia");
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

test("Free presets, saved configuration and read-only session", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Preparar un combate", exact: true })
    .click();
  const preset = page.getByRole("button", {
    name: "3:00 por ronda",
    exact: true,
  });
  await preset.click();
  await expect(page.locator("[data-duration]")).toHaveCount(3);
  await expect(page.locator("#setupRoundDuration")).toHaveValue("180");
  await expect(
    page.locator('[name="roundMinutes"], [name="roundSeconds"]'),
  ).toHaveCount(0);
  expect(
    await page
      .locator('[name="totalRounds"] option')
      .evaluateAll((options) =>
        options.map((option) => (option as HTMLOptionElement).value),
      ),
  ).toEqual(["1", "3"]);
  await page
    .getByRole("combobox", { name: "Rondas", exact: true })
    .selectOption("1");
  await page
    .getByRole("button", { name: "Guardar y abrir control", exact: true })
    .click();
  await expect(
    page.locator('[data-view="scoring"] [data-bind="clock"]'),
  ).toHaveText("03:00");
  await expect(page.getByRole("button", { name: /Impacto/ })).toHaveCount(0);
  await page
    .getByRole("link", { name: "Preparar combate", exact: true })
    .click();
  await expect(preset).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("combobox", { name: "Rondas", exact: true }),
  ).toHaveValue("1");
  const observer = await context.newPage();
  await observer.goto("/");
  await observer
    .getByRole("link", { name: "Preparar combate", exact: true })
    .click();
  await expect(
    observer.getByRole("button", { name: "3:00 por ronda", exact: true }),
  ).toBeDisabled();
  await expect(
    observer.getByRole("combobox", { name: "Rondas", exact: true }),
  ).toBeDisabled();
});

test("final result follows all rounds and corrections in control, display and JSON summaries", async ({
  page,
  context,
}) => {
  await page.clock.install();
  await page.goto("/?view=setup");
  await page
    .getByRole("button", { name: "1:00 por ronda", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Guardar y abrir control", exact: true })
    .click();
  const result = page.locator('[data-view="scoring"] [data-result]');
  const external = await context.newPage();
  await external.goto("/?view=public");
  await page
    .getByRole("button", { name: "+3 puntos · azul", exact: true })
    .click();
  for (let round = 1; round <= 3; round++) {
    await page
      .getByRole("button", { name: "Iniciar · Shijak", exact: true })
      .click();
    await page.clock.fastForward(60_100);
    await expect(
      page.locator('[data-view="scoring"] [data-bind="clock"]'),
    ).toHaveText("00:00");
    if (round < 3) {
      await expect(result).toBeHidden();
      await page
        .getByRole("button", { name: "Siguiente ronda", exact: true })
        .click();
    }
  }
  await expect(result).toContainText("Ganador: Azul");
  await expect(external.locator("[data-result]:visible")).toContainText(
    "Ganador: Azul",
  );
  await page
    .getByRole("button", { name: "+3 puntos · rojo", exact: true })
    .click();
  await expect(result).toContainText("Empate en puntos");
  await page.getByRole("button", { name: "Deshacer", exact: true }).click();
  await expect(result).toContainText("Ganador: Azul");
  await page
    .getByRole("button", { name: "+4 puntos · rojo", exact: true })
    .click();
  await expect(external.locator("[data-result]:visible")).toContainText(
    "Ganador: Rojo",
  );
  await page.getByText("Gestión del combate", { exact: true }).click();
  await page
    .getByRole("button", { name: "Guardar resumen", exact: true })
    .click();
  await page
    .getByRole("link", { name: "Preparar combate", exact: true })
    .click();
  await expect(page.locator("[data-saved-match-list]")).toContainText(
    "Ganador: Rojo",
  );
  const downloading = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exportar JSON" }).click();
  const backup = await downloading;
  const file = await backup.path();
  if (!file) throw new Error("Missing backup");
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("#importFile").setInputFiles(file);
  await page.getByRole("link", { name: "Control", exact: true }).click();
  await expect(result).toContainText("Ganador: Rojo");
  await page.reload();
  await expect(result).toContainText("Ganador: Rojo");
  await external.setViewportSize({ width: 1920, height: 1080 });
  await external
    .getByRole("button", { name: "Pantalla completa", exact: true })
    .click();
  await expect(external.locator("body")).toHaveClass(/is-presenting/);
  expect(
    await external
      .locator(".public-board")
      .evaluate((board) => board.getBoundingClientRect().bottom <= innerHeight),
  ).toBe(true);
  await expect(external.locator("[data-result]:visible")).toContainText(
    "Ganador: Rojo",
  );
});

test("Free preserves oversized legacy backups and requires an explicit deletion to free archive space", async ({
  page,
  context,
}) => {
  const existing = createState();
  existing.config.roundDuration = 90;
  existing.config.totalRounds = 5;
  existing.match.blue.score = 7;
  existing.match.blue.hits = 2;
  existing.match.status = "paused";
  existing.match.remainingMs = 45_000;
  existing.savedMatches = Array.from({ length: 12 }, (_, i) => ({
    ...snapshot(existing),
    id: String(i),
    savedAt: new Date().toISOString(),
    history: [],
  }));
  await page.goto("/?view=setup");
  await expect(page.locator("#operatorState")).toContainText("Operador activo");
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("#importFile").setInputFiles({
    name: "legacy.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(existing)),
  });
  await expect(page.locator("#legacyConfigNote")).toBeVisible();
  await expect(page.locator("[data-saved-match-list] > li")).toHaveCount(12);
  await expect(page.locator("#setupRoundDuration")).toHaveValue("120");
  await page
    .getByRole("button", { name: "Guardar y abrir control", exact: true })
    .click();
  await expect(page.locator("#warning")).toContainText(
    "historial de Free está lleno",
  );
  await expect(page.locator("body")).toHaveAttribute(
    "data-current-view",
    "setup",
  );
  const downloading = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exportar JSON" }).click();
  const path = await (await downloading).path();
  if (!path) throw new Error("Missing backup");
  const data = JSON.parse(await readFile(path, "utf8"));
  expect(data.config.roundDuration).toBe(90);
  expect(data.config.totalRounds).toBe(5);
  expect(data.match.blue.hits).toBe(2);
  expect(data.savedMatches).toHaveLength(12);
  const observer = await context.newPage();
  await observer.goto("/?view=setup");
  await expect(
    observer.getByRole("button", { name: /^Eliminar resumen:/ }).first(),
  ).toBeDisabled();
  await observer.close();
  for (let i = 0; i < 3; i++) {
    page.once("dialog", (dialog) => dialog.accept());
    await page
      .getByRole("button", { name: /^Eliminar resumen:/ })
      .first()
      .click();
  }
  page.once("dialog", (dialog) => dialog.accept());
  await page
    .getByRole("button", { name: "Guardar y abrir control", exact: true })
    .click();
  await expect(
    page.locator('[data-view="scoring"] [data-bind="clock"]'),
  ).toHaveText("02:00");
  await page.getByText("Gestión del combate", { exact: true }).click();
  await page
    .getByRole("button", { name: "Guardar resumen", exact: true })
    .click();
  await expect(page.locator("#warning")).toContainText(
    "historial de Free está lleno",
  );
  await page
    .getByRole("button", { name: "Nuevo combate", exact: true })
    .click();
  await expect(page.locator("#warning")).toContainText(
    "historial de Free está lleno",
  );
  await page
    .getByRole("link", { name: "Preparar combate", exact: true })
    .click();
  await expect(page.locator("[data-saved-match-list] > li")).toHaveCount(10);
});
