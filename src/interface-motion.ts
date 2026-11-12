export function initInterfaceMotion(): void {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const running = new Set<Animation>();
  const visited = new Set<string>();
  const ease = "cubic-bezier(0.22, 0.68, 0.3, 1)";
  let guideObserver: IntersectionObserver | undefined;
  const guideSections = new Set<HTMLElement>();

  function enter(
    target: Element,
    frames: Keyframe[],
    duration = 420,
    delay = 0,
    id = "interface-enter",
  ): void {
    if (document.hidden || !target.getClientRects().length) return;
    const animation = target.animate(
      reduced.matches ? [{ opacity: 0.65 }, { opacity: 1 }] : frames,
      {
        duration: reduced.matches ? 100 : duration,
        delay: reduced.matches ? 0 : delay,
        easing: ease,
        fill: "backwards",
      },
    );
    animation.id = id;
    running.add(animation);
    void animation.finished.then(
      () => running.delete(animation),
      () => running.delete(animation),
    );
  }

  function enterGroup(root: ParentNode, selector: string, quiet = false): void {
    root.querySelectorAll(selector).forEach((target, index) => {
      enter(
        target,
        quiet
          ? [{ opacity: 0.65 }, { opacity: 1 }]
          : [
              { opacity: 0, transform: "translateY(8px)", filter: "blur(2px)" },
              { opacity: 1, transform: "none", filter: "blur(0px)" },
            ],
        quiet ? 140 : 420,
        quiet ? 0 : Math.min(index * 70, 210),
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
    visited.add(view);
    const panel = document.querySelector(`[data-view="${view}"]`);
    if (!panel) return;
    if (view === "home") {
      const title = panel.querySelector("#hero-title")!;
      enter(
        title,
        [
          {
            opacity: 0,
            clipPath: "inset(0 100% 0 0)",
            transform: "translateY(12px)",
          },
          { opacity: 1, clipPath: "inset(0 0 0 0)", transform: "none" },
        ],
        1100,
        0,
        "hero-unveil",
      );
      panel.querySelectorAll(".arena-sticker").forEach((target, index) => {
        enter(
          target,
          [
            { opacity: 0, scale: "0.76", translate: "0 16px" },
            { opacity: 1, scale: "1", translate: "0 0" },
          ],
          900,
          120 + index * 120,
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

  document.addEventListener("focusin", (event) => {
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
  });
}
