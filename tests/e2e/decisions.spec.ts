import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

test("minus one and confirmed KO preserve ownership, time, undo and the external result", async ({
  page,
  context,
}) => {
  await page.clock.install();
  await page.goto("/?view=scoring");
  const blueScore = page.locator(
    '[data-view="scoring"] [data-bind="blueScore"]',
  );
  const result = page.locator('[data-view="scoring"] [data-result]');
  const deduct = page.getByRole("button", {
    name: "Restar 1 punto · azul",
    exact: true,
  });
  const ko = page.getByRole("button", {
    name: "KO Gana por KO · azul",
    exact: true,
  });
  await expect(deduct).toBeDisabled();
  await page
    .getByRole("button", { name: "+2 puntos · azul", exact: true })
    .click();
  await deduct.click();
  await expect(blueScore).toHaveText("1");
  await page.getByRole("button", { name: "Deshacer", exact: true }).click();
  await expect(blueScore).toHaveText("2");
  await page
    .getByRole("button", { name: "+6 puntos · rojo", exact: true })
    .click();
  const external = await context.newPage();
  await external.goto("/?view=public");
  const observer = await context.newPage();
  await observer.goto("/?view=scoring");
  await expect(
    observer.getByRole("button", {
      name: "KO Gana por KO · azul",
      exact: true,
    }),
  ).toBeDisabled();
  await observer.close();
  page.once("dialog", (dialog) => dialog.dismiss());
  await ko.click();
  await expect(result).toBeHidden();
  await page
    .getByRole("button", { name: "Iniciar · Shijak", exact: true })
    .click();
  await page.clock.runFor(5100);
  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain("ganador por KO a Azul (azul)");
    await dialog.accept();
  });
  await ko.click();
  await expect(result).toContainText("Ganador por KO: Azul");
  await expect(external.locator("[data-result]:visible")).toContainText(
    "Ganador por KO: Azul",
  );
  const clock = page.locator('[data-view="scoring"] [data-bind="clock"]');
  const stopped = await clock.textContent();
  await page.clock.runFor(5000);
  await expect(clock).toHaveText(stopped!);
  await expect(ko).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Siguiente ronda", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Tiempo técnico", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Deshacer", exact: true }).click();
  await expect(result).toBeHidden();
  await expect(clock).toHaveText(stopped!);
  await expect(
    page.getByRole("button", { name: "Iniciar · Shijak", exact: true }),
  ).toBeEnabled();
  await page
    .getByRole("button", { name: "+1 punto · azul", exact: true })
    .click();
  page.once("dialog", (dialog) => dialog.accept());
  await ko.click();
  await page.getByText("Gestión del combate", { exact: true }).click();
  await page.locator("#swapSides").click();
  await expect(result).toContainText("Ganador por KO: Azul");
  await expect(result).toHaveAttribute("data-winner", "red");
  await page.getByRole("button", { name: "Deshacer", exact: true }).click();
  await expect(result).toHaveAttribute("data-winner", "blue");
  await page
    .getByRole("button", { name: "Guardar resumen", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Preparar combate", exact: true })
    .click();
  await expect(page.locator("[data-saved-match-list]")).toContainText(
    "Ganador por KO: Azul",
  );
  const downloading = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exportar JSON" }).click();
  const path = await (await downloading).path();
  if (!path) throw new Error("Missing backup");
  const backup = JSON.parse(await readFile(path, "utf8"));
  expect(backup.schemaVersion).toBe(5);
  expect(backup.match.koWinner).toBe("blue");
  expect(backup.savedMatches[0].match.koWinner).toBe("blue");
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("#importFile").setInputFiles(path);
  await page.getByRole("button", { name: "Control", exact: true }).click();
  await page.reload();
  await expect(result).toContainText("Ganador por KO: Azul");
  await page.getByText("Gestión del combate", { exact: true }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page
    .getByRole("button", { name: "Nuevo combate", exact: true })
    .click();
  await expect(result).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Iniciar · Shijak", exact: true }),
  ).toBeEnabled();
});
