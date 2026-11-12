import { expect, test } from "@playwright/test";
import { createState } from "../../src/match";

test("country selection previews flags, commits on save and follows the external display and undo", async ({
  page,
  context,
}) => {
  await page.goto("/preparar");
  const blue = page.getByRole("combobox", { name: "País del competidor azul" });
  const red = page.getByRole("combobox", { name: "País del competidor rojo" });
  await expect(blue.locator("option")).toHaveCount(250);
  await blue.selectOption("JPN");
  await red.selectOption("PER");
  await expect(
    page.locator('[data-setup-country-flag="blue"]'),
  ).toHaveAttribute("src", /\/flags\/jp\.svg$/);
  await expect(page.locator('[data-setup-country-flag="red"]')).toHaveAttribute(
    "src",
    /\/flags\/pe\.svg$/,
  );
  const display = await context.newPage();
  await display.goto("/marcador");
  await expect(display.locator('[data-country-flag="blue"]')).toHaveAttribute(
    "src",
    /\/flags\/us\.svg$/,
  );
  await page
    .getByRole("button", { name: "Guardar y abrir control", exact: true })
    .click();
  await expect(display.locator('[data-country-flag="blue"]')).toHaveAttribute(
    "src",
    /\/flags\/jp\.svg$/,
  );
  await expect(display.locator('[data-country-flag="red"]')).toHaveAttribute(
    "src",
    /\/flags\/pe\.svg$/,
  );
  await page.getByText("Gestión del combate", { exact: true }).click();
  await page
    .getByRole("button", { name: "Intercambiar lados", exact: true })
    .click();
  await expect(display.locator('[data-country-flag="blue"]')).toHaveAttribute(
    "src",
    /\/flags\/pe\.svg$/,
  );
  await page.getByRole("button", { name: "Deshacer", exact: true }).click();
  await expect(display.locator('[data-country-flag="blue"]')).toHaveAttribute(
    "src",
    /\/flags\/jp\.svg$/,
  );
  await page.reload();
  await page
    .getByRole("link", { name: "Preparar combate", exact: true })
    .click();
  await expect(blue).toHaveValue("JPN");
  await expect(red).toHaveValue("PER");
});

test("stored unknown country codes survive setup and sports aliases load the matching flag", async ({
  page,
}) => {
  const stored = createState();
  stored.config.blueCountry = "XYZ";
  stored.config.redCountry = "GRE";
  await page.addInitScript(
    (state) =>
      localStorage.setItem("pss-taekwondo-match-v4", JSON.stringify(state)),
    stored,
  );
  await page.goto("/preparar");
  await expect(
    page.getByRole("combobox", { name: "País del competidor azul" }),
  ).toHaveValue("XYZ");
  await expect(page.locator('[data-setup-country-flag="blue"]')).toBeHidden();
  await expect(
    page.getByRole("combobox", { name: "País del competidor rojo" }),
  ).toHaveValue("GRE");
  await expect(page.locator('[data-setup-country-flag="red"]')).toHaveAttribute(
    "src",
    /\/flags\/gr\.svg$/,
  );
  await page
    .getByRole("button", { name: "Guardar y abrir control", exact: true })
    .click();
  const persisted = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("pss-taekwondo-match-v4")!),
  );
  expect(persisted.config.blueCountry).toBe("XYZ");
  expect(persisted.config.redCountry).toBe("GRE");
  await expect(page.locator('[data-country-flag="blue"]')).toBeHidden();
});
