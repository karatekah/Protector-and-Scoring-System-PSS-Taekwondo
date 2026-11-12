import { expect, test } from "@playwright/test";

test("sample awards animate the scoring side and clear when motion is reduced", async ({
  page,
}) => {
  const fixedTime = new Date("2026-11-04T12:00:00Z");
  await page.clock.install({ time: fixedTime });
  await page.clock.pauseAt(new Date(fixedTime.getTime() + 1000));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    Math.random = () => 0.99;
  });
  await page.goto("/");
  const demo = page.locator(".demo-screen");
  await demo.scrollIntoViewIfNeeded();
  await expect(demo.locator('[data-demo="status"]')).toHaveText("En juego");
  await demo.locator('[data-demo="redScore"]').evaluate((score) => {
    new MutationObserver((_records, observer) => {
      for (const element of [score, score.nextElementSibling!]) {
        for (const animation of element.getAnimations()) {
          animation.pause();
          animation.currentTime = 84;
        }
      }
      observer.disconnect();
    }).observe(score, { childList: true });
  });
  await page.clock.runFor(1500);
  await expect(demo.locator('[data-demo="redScore"]')).toHaveText("3");
  await expect
    .poll(() =>
      demo
        .locator(".demo-red .demo-impact")
        .evaluate((el) => el.getAnimations().length),
    )
    .toBe(1);
  expect(
    await demo
      .locator(".demo-blue .demo-impact")
      .evaluate((el) => el.getAnimations().length),
  ).toBe(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(demo.locator('[data-demo="status"]')).toHaveText("Demo");
  expect(
    await demo
      .locator(".demo-impact")
      .evaluateAll((els) => els.flatMap((el) => el.getAnimations()).length),
  ).toBe(0);
  await expect(demo.locator('[data-demo="redAction"]')).toHaveText("+3 puntos");
});

test("demo loops every minute without controls and leaves the real match unchanged", async ({
  page,
}) => {
  const fixedTime = new Date("2026-11-04T12:00:00Z");
  await page.clock.install({ time: fixedTime });
  await page.clock.pauseAt(new Date(fixedTime.getTime() + 1000));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  // Exercise the cap with maximum awards consistently aimed at one side.
  await page.addInitScript(() => {
    Math.random = () => 0.99;
  });
  await page.goto("/");
  await expect(page.locator("#operatorState")).toContainText("Operador activo");
  const stored = await page.evaluate(() =>
    localStorage.getItem("pss-taekwondo-match-v4"),
  );
  const demo = page.locator(".demo-screen");
  const clock = demo.locator('[data-demo="clock"]');
  const status = demo.locator('[data-demo="status"]');
  await demo.evaluate((screen) => {
    const samples: {
      blue: number;
      red: number;
      blueAction: string;
      redAction: string;
    }[] = [];
    (window as unknown as { demoSamples: typeof samples }).demoSamples =
      samples;
    new MutationObserver(() =>
      samples.push({
        blue: Number(
          screen.querySelector('[data-demo="blueScore"]')!.textContent,
        ),
        red: Number(
          screen.querySelector('[data-demo="redScore"]')!.textContent,
        ),
        blueAction: screen
          .querySelector('[data-demo="blueAction"]')!
          .textContent!.trim(),
        redAction: screen
          .querySelector('[data-demo="redAction"]')!
          .textContent!.trim(),
      }),
    ).observe(screen, { childList: true, subtree: true, characterData: true });
  });
  const total = () =>
    demo
      .locator('[data-demo="blueScore"], [data-demo="redScore"]')
      .evaluateAll((els) =>
        els.reduce((sum, el) => sum + Number(el.textContent), 0),
      );
  await expect(
    page.locator(".display-demo button, .arena-ribbon button"),
  ).toHaveCount(0);
  await expect(page.locator(".session-match button")).toHaveCount(0);
  await expect(
    page.locator(".session-summary > .session-resume"),
  ).toBeAttached();
  await demo.scrollIntoViewIfNeeded();
  await expect(status).toHaveText("En juego");
  await page.clock.runFor(5000);
  await expect(clock).toHaveText("00:55");
  expect(await total()).toBeGreaterThan(0);
  await expect(page.locator('.session-summary [data-bind="clock"]')).toHaveText(
    "02:00",
  );
  await expect(
    page.locator('.session-summary [data-bind="blueScore"]'),
  ).toHaveText("0");
  await expect(
    page.locator('.session-summary [data-bind="redScore"]'),
  ).toHaveText("0");
  expect(
    await page.evaluate(() => localStorage.getItem("pss-taekwondo-match-v4")),
  ).toBe(stored);

  await page.getByRole("link", { name: "Control", exact: true }).click();
  await expect(demo).toHaveCount(0);
  await page.clock.runFor(4000);
  await expect(
    page.locator('[data-view="scoring"] [data-bind="blueScore"]'),
  ).toHaveText("0");
  await expect(
    page.locator('[data-view="scoring"] [data-bind="clock"]'),
  ).toHaveText("02:00");
  await page.getByRole("link", { name: "Inicio", exact: true }).click();
  await demo.scrollIntoViewIfNeeded();
  await expect(status).toHaveText("En juego");
  await expect(clock).toHaveText("00:55");
  await page.clock.runFor(54000);
  await expect(clock).toHaveText("00:01");
  const samples = await page.evaluate(
    () =>
      (
        window as unknown as {
          demoSamples: {
            blue: number;
            red: number;
            blueAction: string;
            redAction: string;
          }[];
        }
      ).demoSamples,
  );
  let previous = { blue: 0, red: 0 };
  let correction = false;
  let transfer = false;
  let peak = 0;
  for (const sample of samples) {
    expect(sample.blue).toBeGreaterThanOrEqual(0);
    expect(sample.red).toBeGreaterThanOrEqual(0);
    expect(sample.blue).toBeLessThanOrEqual(16);
    expect(sample.red).toBeLessThanOrEqual(16);
    peak = Math.max(peak, sample.blue, sample.red);
    const blueDelta = sample.blue - previous.blue;
    const redDelta = sample.red - previous.red;
    if (
      (blueDelta === -1 && redDelta === 0) ||
      (blueDelta === 0 && redDelta === -1)
    ) {
      correction = true;
      expect(blueDelta === -1 ? sample.blueAction : sample.redAction).toBe(
        "−1 punto",
      );
    }
    if (
      (blueDelta === -1 && redDelta === 1) ||
      (blueDelta === 1 && redDelta === -1)
    ) {
      transfer = true;
      expect(blueDelta === -1 ? sample.blueAction : sample.redAction).toBe(
        "−1 punto",
      );
      expect(blueDelta === 1 ? sample.blueAction : sample.redAction).toBe(
        "+1 punto",
      );
    }
    previous = sample;
  }
  expect(peak).toBe(16);
  expect(correction).toBe(true);
  expect(transfer).toBe(true);
  await page.clock.runFor(1000);
  await expect(clock).toHaveText("01:00");
  expect(await total()).toBe(0);
  await expect(status).toHaveText("En juego");
  await page.clock.runFor(2000);
  expect(await total()).toBeGreaterThan(0);
  await page.clock.fastForward(118000);
  await expect(clock).toHaveText("01:00");
  expect(await total()).toBe(0);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(status).toHaveText("Demo");
  await page.clock.runFor(5000);
  await expect(clock).toHaveText("01:00");
  expect(await total()).toBe(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(status).toHaveText("En juego");
  await page.clock.runFor(2000);
  await expect(clock).toHaveText("00:58");
  expect(await total()).toBeGreaterThan(0);
  expect(
    await page.evaluate(() => localStorage.getItem("pss-taekwondo-match-v4")),
  ).toBe(stored);
});
