import { expect, test } from "@playwright/test";

type MotionWindow = Window & { recordedMotion: Animation[] };

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    (window as MotionWindow).recordedMotion = [];
    const original = Element.prototype.animate;
    Element.prototype.animate = function (frames, options) {
      const animation = original.call(this, frames, options);
      (window as MotionWindow).recordedMotion.push(animation);
      return animation;
    };
  });
});

test("hero arrives as a sequence and buttons respond to hover and press", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as MotionWindow).recordedMotion.filter(
            (a) => a.id === "sticker-arrive",
          ).length,
      ),
    )
    .toBe(3);
  const title = await page.evaluate(() => {
    const animation = (window as MotionWindow).recordedMotion.find(
      (a) => a.id === "hero-unveil",
    )!;
    return {
      frames: (animation.effect as KeyframeEffect).getKeyframes(),
      duration: animation.effect!.getTiming().duration,
    };
  });
  expect(Number(title.duration)).toBeLessThanOrEqual(800);
  expect(title.frames[0].clipPath).toContain("100%");
  await page.waitForFunction(() =>
    (window as MotionWindow).recordedMotion.every(
      (a) => a.playState === "finished" || a.playState === "idle",
    ),
  );
  const button = page.getByRole("button", {
    name: "Preparar un combate",
    exact: true,
  });
  await button.hover();
  await expect(button).toHaveCSS("translate", "0px -2px");
  await page.mouse.down();
  await expect(button).toHaveCSS("scale", "0.96");
  await page.mouse.up();
  await expect(page.locator("body")).toHaveAttribute(
    "data-current-view",
    "setup",
  );
});

test("each module enters once and scoring targets stay still", async ({
  page,
  context,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/?view=setup");
  const countCards = () =>
    page.evaluate(
      () =>
        (window as MotionWindow).recordedMotion.filter((a) =>
          (a.effect as KeyframeEffect).target?.matches(".form-card"),
        ).length,
    );
  await expect.poll(countCards).toBe(3);
  await page.getByRole("button", { name: "Control", exact: true }).click();
  const score = page.getByRole("button", {
    name: "+2 puntos · azul",
    exact: true,
  });
  const before = await score.boundingBox();
  await score.hover();
  await expect(score).toHaveCSS("translate", "none");
  await score.click();
  await expect(
    page.locator('[data-view="scoring"] [data-bind="blueScore"]'),
  ).toHaveText("2");
  expect((await score.boundingBox())!.y).toBe(before!.y);
  await page
    .getByRole("button", { name: "Preparar combate", exact: true })
    .click();
  expect(await countCards()).toBe(3);
  const external = await context.newPage();
  await external.goto("/?view=public");
  await expect(
    external.locator('[data-view="public"] [data-bind="blueScore"]'),
  ).toHaveText("2");
  const frames = await external.evaluate(() => {
    const animation = (window as MotionWindow).recordedMotion.find((a) =>
      (a.effect as KeyframeEffect).target?.matches(".public-board"),
    )!;
    return (animation.effect as KeyframeEffect).getKeyframes();
  });
  expect(
    frames.every((frame) => !("transform" in frame) && !("scale" in frame)),
  ).toBe(true);
});

test("guide sections reveal on navigation and reduced motion removes spatial effects", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/guide.html");
  const roadmap = page.locator("#roadmap");
  await expect(roadmap).toHaveClass(/motion-pending/);
  await page.getByRole("link", { name: "Plan", exact: true }).click();
  await expect(roadmap).not.toHaveClass(/motion-pending/);
  await expect(roadmap.locator("h2")).toHaveCSS("opacity", "1");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".motion-pending")).toHaveCount(0);
  await page.reload();
  expect(
    await page.evaluate(() =>
      (window as MotionWindow).recordedMotion.every((animation) =>
        (animation.effect as KeyframeEffect)
          .getKeyframes()
          .every(
            (frame) =>
              !["transform", "scale", "translate", "clipPath", "filter"].some(
                (key) => key in frame,
              ),
          ),
      ),
    ),
  ).toBe(true);
  await expect(page.locator(".motion-pending")).toHaveCount(0);
});
