import { expect, test } from "@playwright/test";

type MotionWindow = Window & {
  recordedMotion: Animation[];
  heroFontStates: boolean[];
  heroHidden: boolean;
};

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    (window as MotionWindow).recordedMotion = [];
    (window as MotionWindow).heroFontStates = [];
    const original = Element.prototype.animate;
    Element.prototype.animate = function (frames, options) {
      if (this.matches(".hero-letter"))
        (window as MotionWindow).heroFontStates.push(
          document.fonts.check("1em Anton"),
        );
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
    .toBe(7);
  await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(
    "OCTAJANG · Marcador de taekwondo",
  );
  const letters = await page.evaluate(() =>
    (window as MotionWindow).recordedMotion
      .filter((a) => a.id === "hero-letter-arrive")
      .map((animation) => ({
        frames: (animation.effect as KeyframeEffect).getKeyframes(),
        ...animation.effect!.getTiming(),
      })),
  );
  expect(letters).toHaveLength(8);
  expect(letters.every((letter) => letter.duration === 2100)).toBe(true);
  expect(letters.map((letter) => letter.delay)).toEqual(
    Array.from({ length: 8 }, (_, index) => index * 110),
  );
  expect(letters[0].frames[0].transform).toContain("115%");
  expect(letters[0].frames[0].clipPath).toContain("100%");
  expect(letters[7].delay + Number(letters[7].duration)).toBe(2870);
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as MotionWindow).recordedMotion.filter(
            (a) => a.id === "hero-title-pulse",
          ).length,
      ),
    )
    .toBe(1);
  const pulse = await page.evaluate(() => {
    const animation = (window as MotionWindow).recordedMotion.find(
      (a) => a.id === "hero-title-pulse",
    )!;
    return {
      frames: (animation.effect as KeyframeEffect).getKeyframes(),
      ...animation.effect!.getTiming(),
    };
  });
  expect(pulse.duration).toBe(2400);
  expect(pulse.delay).toBe(200);
  expect(pulse.frames.map((frame) => Number(frame.opacity))).toEqual([
    1, 0.68, 1,
  ]);
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

test("a hidden load preserves the entrance and pauses the closing pulse", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    (window as MotionWindow).heroHidden = true;
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => (window as MotionWindow).heroHidden,
    });
  });
  await page.goto("/");
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as MotionWindow).recordedMotion.filter(
            (a) => a.id === "hero-letter-arrive" && a.playState === "paused",
          ).length,
      ),
    )
    .toBe(8);
  await page.evaluate(() => {
    (window as MotionWindow).heroHidden = false;
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.waitForFunction(() =>
    (window as MotionWindow).recordedMotion.some(
      (a) => a.id === "hero-title-pulse",
    ),
  );
  const pausedTime = await page.evaluate(async () => {
    (window as MotionWindow).heroHidden = true;
    document.dispatchEvent(new Event("visibilitychange"));
    const pulse = (window as MotionWindow).recordedMotion.find(
      (a) => a.id === "hero-title-pulse",
    )!;
    await pulse.ready;
    return pulse.currentTime;
  });
  await page.waitForTimeout(200);
  expect(
    await page.evaluate(
      () =>
        (window as MotionWindow).recordedMotion.find(
          (a) => a.id === "hero-title-pulse",
        )!.currentTime,
    ),
  ).toBe(pausedTime);
  await page.evaluate(() => {
    (window as MotionWindow).heroHidden = false;
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".hero-word")).toHaveCSS("opacity", "1");
  await expect
    .poll(() =>
      page.evaluate(() =>
        (window as MotionWindow).recordedMotion.every(
          (a) => a.playState === "idle" || a.playState === "finished",
        ),
      ),
    )
    .toBe(true);
});

test("the title waits for its font before entering", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/fonts/anton-latin.woff2", async (route) => {
    await gate;
    await route.continue();
  });
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-view="home"]')).toHaveAttribute(
      "data-hero-entry",
      "pending",
    );
    expect(
      await page.evaluate(() => (window as MotionWindow).heroFontStates),
    ).toEqual([]);
    await expect(page.locator(".hero-word")).toHaveCSS("opacity", "0");
    const action = page.getByRole("button", {
      name: "Preparar un combate",
      exact: true,
    });
    await action.focus();
    await expect(page.locator(".arena-actions")).toHaveCSS("opacity", "1");
  } finally {
    release();
  }
  await expect
    .poll(() => page.evaluate(() => (window as MotionWindow).heroFontStates))
    .toEqual(Array(8).fill(true));
  await expect(page.locator('[data-view="home"]')).not.toHaveAttribute(
    "data-hero-entry",
    "pending",
  );
  await expect(
    page.getByRole("button", { name: "Preparar un combate", exact: true }),
  ).toHaveCSS("opacity", "1");
});

test("a stalled font leaves the title visible without a late disappearance", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/fonts/anton-latin.woff2", async (route) => {
    await gate;
    await route.continue();
  });
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator('[data-view="home"]')).toHaveAttribute(
      "data-hero-entry",
      "pending",
    );
    await expect(page.locator('[data-view="home"]')).not.toHaveAttribute(
      "data-hero-entry",
      "pending",
    );
    await expect(page.locator(".hero-word")).toHaveCSS("opacity", "1");
  } finally {
    release();
  }
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(
      () =>
        (window as MotionWindow).recordedMotion.filter((a) =>
          ["hero-letter-arrive", "hero-title-pulse"].includes(a.id),
        ).length,
    ),
  ).toBe(0);
  await expect(page.locator(".hero-word")).toHaveCSS("opacity", "1");
});

test("startup avoids a flash and releases content if the main script stalls", async ({
  page,
  browser,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/assets/main-*.js", async (route) => {
    await gate;
    await route.continue();
  });
  try {
    await page.goto("/", { waitUntil: "commit" });
    await expect(page.locator("html")).toHaveAttribute(
      "data-motion-boot",
      "pending",
    );
    await expect(page.locator(".hero-word")).toHaveCSS("opacity", "0");
    await expect(page.locator("html")).not.toHaveAttribute(
      "data-motion-boot",
      "pending",
    );
    await expect(page.locator(".hero-word")).toHaveCSS("opacity", "1");
  } finally {
    release();
  }
  await page.waitForLoadState("load");
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const staticPage = await context.newPage();
    await staticPage.goto("/");
    await expect(staticPage.locator(".hero-word")).toHaveCSS("opacity", "1");
    await expect(
      staticPage.getByRole("heading", { level: 1 }),
    ).toHaveAccessibleName("OCTAJANG · Marcador de taekwondo");
  } finally {
    await context.close();
  }
});

test("opposing sections arrive from their side and focus reveals actions", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const copy = page.locator(".story-copy");
  const demo = page.locator(".display-demo");
  await expect(copy).toHaveClass(/reveal-pending/);
  const directions = await page
    .locator(".story-copy,.display-demo")
    .evaluateAll((elements) =>
      elements.map(
        (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41,
      ),
    );
  expect(directions[0]).toBeLessThan(0);
  expect(directions[1]).toBeGreaterThan(0);
  await copy.scrollIntoViewIfNeeded();
  await expect(copy).toHaveCSS("opacity", "1");
  await expect(demo).toHaveCSS("opacity", "1");
  await page.locator(".closing-invitation button").focus();
  await expect(page.locator(".closing-invitation")).toHaveCSS("opacity", "1");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("[data-reveal]:not(.is-revealed)")).toHaveCount(0);
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
  await page.evaluate(() => {
    const animation = (window as MotionWindow).recordedMotion.find((a) =>
      (a.effect as KeyframeEffect).target?.matches(
        '.view-tabs a[data-view-target="scoring"]',
      ),
    )!;
    animation.pause();
    animation.currentTime = Number(animation.effect!.getTiming().duration) / 2;
  });
  await page.getByRole("link", { name: "Control", exact: true }).click();
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
    .getByRole("link", { name: "Preparar combate", exact: true })
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
  await page.goto("/guia");
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
