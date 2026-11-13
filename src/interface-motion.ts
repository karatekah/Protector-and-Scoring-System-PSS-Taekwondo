export function initInterfaceMotion(): void {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const running = new Set<Animation>();
  const visited = new Set<string>();
  const ease = "cubic-bezier(0.16, 1, 0.3, 1)";
  let pointerDown = false;
  let homeFont: "idle" | "pending" | "ready" | "failed" = document.fonts.check(
    "1em Anton",
  )
    ? "ready"
    : "idle";
  let guideObserver: IntersectionObserver | undefined;
  const guideSections = new Set<HTMLElement>();

  function enter(
    target: Element,
    frames: Keyframe[],
    duration = 420,
    delay = 0,
    id = "interface-enter",
  ): Animation | undefined {
    if (
      !target.getClientRects().length ||
      target.contains(document.activeElement)
    )
      return;
    const animation = target.animate(
      reduced.matches ? [{ opacity: 0.65 }, { opacity: 1 }] : frames,
      {
        duration: reduced.matches ? 100 : duration,
        delay: reduced.matches ? 0 : delay,
        easing:
          id === "hero-letter-arrive"
            ? "cubic-bezier(0.22, 0.61, 0.36, 1)"
            : id === "hero-title-pulse"
              ? "ease-in-out"
              : ease,
        fill: "backwards",
      },
    );
    animation.id = id;
    if (document.hidden) animation.pause();
    running.add(animation);
    void animation.finished.then(
      () => running.delete(animation),
      () => running.delete(animation),
    );
    return animation;
  }

  function enterGroup(root: ParentNode, selector: string, quiet = false): void {
    root.querySelectorAll(selector).forEach((target, index) => {
      const bounds = target.getBoundingClientRect();
      const center = bounds.left + bounds.width / 2;
      const direction =
        Math.abs(center - innerWidth / 2) < 32
          ? index % 2 === 0
            ? -1
            : 1
          : center < innerWidth / 2
            ? -1
            : 1;
      const distance = innerWidth <= 760 ? 28 : 56;
      enter(
        target,
        quiet
          ? [{ opacity: 0.65 }, { opacity: 1 }]
          : [
              {
                opacity: 0,
                transform: `translateX(${direction * distance}px)`,
                filter: "blur(3px)",
              },
              { opacity: 1, transform: "none", filter: "blur(0px)" },
            ],
        quiet ? 140 : 800,
        quiet ? 0 : Math.min(index * 90, 270),
      );
    });
  }

  function revealGuide(target: HTMLElement): void {
    target.classList.remove("motion-pending");
    guideObserver?.unobserve(target);
    enterGroup(target, ":scope > *");
  }

  function enterGuide(root: ParentNode): void {
    enterGroup(root, ".guide-hero > *, .guide-nav > a");
    if (reduced.matches || !("IntersectionObserver" in window)) return;
    guideObserver ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) revealGuide(entry.target as HTMLElement);
        }
      },
      { rootMargin: "0px 0px -24px 0px" },
    );
    for (const section of root.querySelectorAll<HTMLElement>(
      ".guide-section, .guide-callout",
    )) {
      guideSections.add(section);
      if (section.getBoundingClientRect().top < innerHeight) continue;
      section.classList.add("motion-pending");
      guideObserver.observe(section);
    }
  }

  function enterView(): void {
    for (const animation of running) {
      const target = (animation.effect as KeyframeEffect).target;
      if (target?.closest("[hidden]")) animation.cancel();
    }
    const view = document.body.dataset.currentView;
    if (!view || visited.has(view)) return;
    const panel = document.querySelector(`[data-view="${view}"]`);
    if (!panel) return;
    if (view === "home" && !reduced.matches) {
      if (homeFont === "idle") {
        homeFont = "pending";
        panel.setAttribute("data-hero-entry", "pending");
        let timeout: number;
        void Promise.race([
          document.fonts.load("1em Anton", "OCTAJANG").then(
            () => "ready" as const,
            () => "failed" as const,
          ),
          new Promise<"failed">((resolve) => {
            timeout = window.setTimeout(() => resolve("failed"), 2000);
          }),
        ]).then((status) => {
          clearTimeout(timeout);
          homeFont = status;
          panel.removeAttribute("data-hero-entry");
          enterView();
        });
      }
      if (homeFont === "pending") return;
    }
    visited.add(view);
    if (view === "home") {
      const letters: Animation[] = [];
      panel.querySelectorAll(".hero-letter").forEach((letter, index) => {
        if (homeFont === "failed" && !reduced.matches) return;
        const animation = enter(
          letter,
          [
            {
              opacity: 0,
              transform: "translateY(115%) scaleY(1.28)",
              clipPath: "inset(0 0 100% 0)",
            },
            {
              opacity: 1,
              transform: "translateY(-3%) scaleY(0.98)",
              clipPath: "inset(0 0 0 0)",
              offset: 0.78,
            },
            { opacity: 1, transform: "none", clipPath: "inset(0 0 0 0)" },
          ],
          2100,
          index * 110,
          "hero-letter-arrive",
        );
        if (animation) letters.push(animation);
      });
      void Promise.all(letters.map((animation) => animation.finished)).then(
        () => {
          const word = panel.querySelector(".hero-word");
          if (!word || !letters.length || reduced.matches) return;
          enter(
            word,
            [{ opacity: 1 }, { opacity: 0.68 }, { opacity: 1 }],
            2400,
            200,
            "hero-title-pulse",
          );
        },
        () => {},
      );
      panel.querySelectorAll(".arena-sticker").forEach((target, index) => {
        const bounds = target.getBoundingClientRect();
        const direction =
          bounds.left + bounds.width / 2 < innerWidth / 2 ? -1 : 1;
        const distance = innerWidth <= 760 ? 44 : 88;
        const angle = parseFloat(getComputedStyle(target).rotate) || 0;
        enter(
          target,
          [
            {
              opacity: 0,
              scale: "0.68",
              translate: `${direction * distance}px 24px`,
              rotate: `${angle + direction * 12}deg`,
            },
            { opacity: 1, scale: "1", translate: "0 0", rotate: `${angle}deg` },
          ],
          1600,
          260 + index * 110,
          "sticker-arrive",
        );
      });
      enterGroup(
        panel,
        ".arena-tagline, .arena-actions > button, .arena-scope",
      );
    } else if (view === "setup") {
      enterGroup(
        panel,
        ".view-heading h1, .view-heading p, .workspace-stamp, .form-card, .form-actions, .saved-matches-panel",
      );
    } else if (view === "guide") {
      enterGuide(panel);
    } else {
      enterGroup(
        panel,
        ".control-heading > div, .scoreboard, .control-strip, .judge-side, .log-panel, .match-management, .public-toolbar",
        true,
      );
    }
  }

  enterGroup(
    document,
    ".app-header .brand-lockup, .view-tabs > button, .view-tabs > a",
  );
  enterView();
  new MutationObserver(enterView).observe(document.body, {
    attributes: true,
    attributeFilter: ["data-current-view"],
  });
  document.addEventListener("visibilitychange", () => {
    for (const animation of running) {
      if (document.hidden) animation.pause();
      else animation.play();
    }
  });

  document.addEventListener("pointerdown", () => (pointerDown = true), true);
  for (const event of ["pointerup", "pointercancel", "keydown"]) {
    document.addEventListener(event, () => (pointerDown = false), true);
  }
  document.addEventListener("focusin", (event) => {
    if (pointerDown) return;
    const focused = event.target as Element;
    const pending = focused.closest<HTMLElement>(".motion-pending");
    if (pending) revealGuide(pending);
    for (const animation of running) {
      if ((animation.effect as KeyframeEffect).target?.contains(focused))
        animation.cancel();
    }
  });
  document.addEventListener(
    "toggle",
    (event) => {
      const details = event.target;
      if (!(details instanceof HTMLDetailsElement)) return;
      if (details.open) enterGroup(details, ":scope > :not(summary)", true);
      else
        for (const animation of running) {
          if (details.contains((animation.effect as KeyframeEffect).target))
            animation.cancel();
        }
    },
    true,
  );
  reduced.addEventListener("change", () => {
    for (const animation of running) animation.cancel();
    if (reduced.matches)
      guideSections.forEach((section) => {
        section.classList.remove("motion-pending");
        guideObserver?.unobserve(section);
      });
    enterView();
  });
  delete document.documentElement.dataset.motionBoot;
}
