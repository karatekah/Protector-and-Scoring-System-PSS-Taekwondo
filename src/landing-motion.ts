export function initLandingMotion(): void {
  const hero = document.querySelector<HTMLElement>(".arena-hero");
  const session = document.querySelector<HTMLElement>(".session-summary");
  if (!hero) return;

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const targets = document.querySelectorAll<HTMLElement>(
    ".home-view [data-reveal]",
  );
  let heroVisible = true;
  let sessionVisible = false;
  let revealObserver: IntersectionObserver | undefined;

  const reveal = (target: HTMLElement) => {
    target.classList.add("is-revealed");
    revealObserver?.unobserve(target);
  };
  const revealAll = () => targets.forEach(reveal);
  const updateVisibility = () => {
    document.body.classList.toggle(
      "landing-motion-active",
      heroVisible && !document.hidden,
    );
    document.body.classList.toggle(
      "session-motion-active",
      sessionVisible && !document.hidden,
    );
  };
  const updatePreference = () => {
    if (reducedMotion.matches) revealAll();
  };

  if ("IntersectionObserver" in window) {
    const heroObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) heroVisible = entry.isIntersecting;
        else sessionVisible = entry.isIntersecting;
      }
      updateVisibility();
    });
    heroObserver.observe(hero);
    if (session) heroObserver.observe(session);

    revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) reveal(entry.target as HTMLElement);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -32px 0px" },
    );

    if (!reducedMotion.matches) {
      for (const target of targets) {
        // Keep the first viewport visible; only stage content further down.
        if (target.getBoundingClientRect().top < innerHeight) continue;
        target.classList.add("reveal-pending");
        revealObserver.observe(target);
      }
    }
  }

  document.querySelector(".home-view")?.addEventListener("focusin", (event) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>(
      ".reveal-pending",
    );
    if (target) reveal(target);
  });
  document.addEventListener("visibilitychange", updateVisibility);
  reducedMotion.addEventListener("change", updatePreference);
  updatePreference();
  updateVisibility();
}
