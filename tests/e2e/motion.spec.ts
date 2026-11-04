import { expect, test } from "@playwright/test";

test("landing motion loops automatically, reveals once and respects reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const track = page.locator(".ribbon-track");
  await expect(page.locator(".arena-ribbon button")).toHaveCount(0);
  await expect
    .poll(() => track.evaluate((el) => el.getAnimations()[0]?.playState))
    .toBe("running");
  const start = await track.evaluate((el) =>
    Number(el.getAnimations()[0].currentTime),
  );
  await expect
    .poll(() =>
      track.evaluate((el) => Number(el.getAnimations()[0].currentTime)),
    )
    .toBeGreaterThan(start);

  // The second identical group replaces the first at the exact loop boundary.
  const seam = await track.evaluate((el) => {
    const animation = el.getAnimations()[0];
    animation.currentTime = 0;
    const groups = el.querySelectorAll<HTMLElement>(".ribbon-group");
    const first = groups[0].getBoundingClientRect().left;
    const duration = Number(animation.effect!.getTiming().duration);
    animation.currentTime = duration - 1;
    const difference = Math.abs(groups[1].getBoundingClientRect().left - first);
    animation.currentTime = 0;
    return difference;
  });
  expect(seam).toBeLessThan(1);

  const pending = page.locator(".story-copy");
  await expect(pending).toHaveClass(/reveal-pending/);
  expect(await pending.evaluate((el) => getComputedStyle(el).opacity)).toBe(
    "0",
  );
  await pending.scrollIntoViewIfNeeded();
  await expect(pending).toHaveClass(/is-revealed/);
  await expect(pending).toHaveCSS("opacity", "1");
  await expect
    .poll(() => track.evaluate((el) => el.getAnimations()[0]?.playState))
    .toBe("paused");
  await page.evaluate(() => scrollTo(0, 0));
  await expect
    .poll(() => track.evaluate((el) => el.getAnimations()[0]?.playState))
    .toBe("running");
  await expect(pending).toHaveClass(/is-revealed/);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("[data-reveal]:not(.is-revealed)")).toHaveCount(0);
  await expect(track).toHaveCSS("animation-name", "none");
  await expect(page.locator(".sticker-dobok")).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(pending).toHaveCSS("opacity", "1");
  await page.reload();
  await expect(page.locator(".reveal-pending")).toHaveCount(0);
  await expect(pending).toHaveCSS("opacity", "1");

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect
    .poll(() => track.evaluate((el) => el.getAnimations()[0]?.playState))
    .toBe("running");
  await page.locator(".closing-invitation button").focus();
  await expect(page.locator(".closing-invitation")).toHaveCSS("opacity", "1");

  const display = await page.context().newPage();
  await display.goto("/?view=public");
  await expect(display.locator(".arena-ribbon")).toBeHidden();
  await expect(display.locator("body")).not.toHaveClass(
    /landing-motion-active/,
  );
  await expect(display.locator(".reveal-pending")).toHaveCount(0);
});
