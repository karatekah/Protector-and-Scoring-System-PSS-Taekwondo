export function initScoreboardDemo(): void {
  const screen = document.querySelector<HTMLElement>(".demo-screen");
  if (!screen) return;

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const fields = Object.fromEntries(
    [...screen.querySelectorAll<HTMLElement>("[data-demo]")].map((el) => [
      el.dataset.demo!,
      el,
    ]),
  );
  let elapsed = 0;
  let lastTick = 0;
  let nextPoint = 1400;
  const scores = { blue: 0, red: 0 };
  const actions = { blue: "\u00a0", red: "\u00a0" };
  let actionIndex = 0;
  let lastAction = "En juego";
  let visible = false;
  let interval: number | undefined;
  const impacts: Animation[] = [];

  function clearImpact(): void {
    impacts.splice(0).forEach((animation) => animation.cancel());
  }

  function showImpact(side: "blue" | "red"): void {
    if (reducedMotion.matches) return;
    const burst = screen!.querySelector<SVGElement>(
      `.demo-${side} .demo-impact`,
    )!;
    impacts.push(
      fields[`${side}Score`].animate(
        [{ scale: "1" }, { scale: "1.08", offset: 0.25 }, { scale: "1" }],
        { duration: 420, easing: "cubic-bezier(0.2, 0, 0, 1)" },
      ),
      burst.animate(
        [
          { opacity: 0, scale: "0.65" },
          { opacity: 1, scale: "0.85", offset: 0.2 },
          { opacity: 0, scale: "1.15" },
        ],
        { duration: 420, easing: "ease-out" },
      ),
    );
  }

  function render(): void {
    const seconds = Math.ceil((60000 - elapsed) / 1000);
    const values = {
      blueScore: String(scores.blue),
      redScore: String(scores.red),
      blueAction: actions.blue,
      redAction: actions.red,
      clock: `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`,
      status:
        interval !== undefined && !reducedMotion.matches ? lastAction : "Demo",
    };
    for (const [key, value] of Object.entries(values)) {
      if (fields[key].textContent !== value) fields[key].textContent = value;
    }
  }

  function showSampleAction(): void {
    clearImpact();
    let side: "blue" | "red" = Math.random() < 0.5 ? "blue" : "red";
    let rival: "blue" | "red" = side === "blue" ? "red" : "blue";
    const kind = actionIndex++ % 6;
    actions.blue = actions.red = "\u00a0";

    // Include both requested correction examples during every sample cycle.
    if (kind === 2 || kind === 5) {
      if (scores[side] === 0 || (kind === 5 && scores[rival] === 16))
        [side, rival] = [rival, side];
      if (scores[side] > 0 && (kind !== 5 || scores[rival] < 16)) {
        scores[side]--;
        actions[side] = "−1 punto";
        lastAction = "Corrección";
        if (kind === 5) {
          scores[rival]++;
          actions[rival] = "+1 punto";
          lastAction = "Ajuste";
        }
        return;
      }
    }

    if (scores[side] === 16) [side, rival] = [rival, side];
    const points = Math.min(
      1 + Math.floor(Math.random() * 3),
      16 - scores[side],
    );
    if (points > 0) {
      scores[side] += points;
      actions[side] = `+${points} ${points === 1 ? "punto" : "puntos"}`;
      lastAction = "En juego";
      showImpact(side);
    } else {
      scores[side]--;
      actions[side] = "−1 punto";
      lastAction = "Corrección";
    }
  }

  function tick(): void {
    const now = performance.now();
    elapsed += Math.max(0, now - lastTick);
    lastTick = now;
    if (elapsed >= 60000) {
      clearImpact();
      elapsed %= 60000;
      scores.blue = scores.red = 0;
      actions.blue = actions.red = "\u00a0";
      actionIndex = 0;
      lastAction = "En juego";
      nextPoint = 1400;
    }
    if (elapsed >= nextPoint) {
      showSampleAction();
      nextPoint = elapsed + 2000 + Math.random() * 1600;
    }
    render();
  }

  function updatePlayback(): void {
    const canPlay =
      visible &&
      !document.hidden &&
      !reducedMotion.matches &&
      document.body.dataset.currentView === "home";
    if (canPlay && interval === undefined) {
      lastTick = performance.now();
      interval = window.setInterval(tick, 250);
    } else if (!canPlay && interval !== undefined) {
      tick();
      clearInterval(interval);
      interval = undefined;
    }
    if (!canPlay) clearImpact();
    render();
  }

  reducedMotion.addEventListener("change", updatePlayback);
  document.addEventListener("visibilitychange", updatePlayback);
  new MutationObserver(updatePlayback).observe(document.body, {
    attributes: true,
    attributeFilter: ["data-current-view"],
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        updatePlayback();
      },
      { threshold: 0 },
    ).observe(screen.closest(".display-demo") || screen);
  } else visible = true;
  updatePlayback();
}
