import home from "./views/home.html?raw";
import setup from "./views/setup.html?raw";
import scoring from "./views/scoring.html?raw";
import display from "./views/public.html?raw";
import guide from "./views/guide.html?raw";
import { pageFiles, paths } from "./routes";
import type { View } from "./routes";

const markup: Record<View, string> = {
  home,
  setup,
  scoring,
  public: display,
  guide,
};
const panels = new Map<View, HTMLElement>();
const base = new URL(".", location.href);
for (const view of Object.keys(markup) as View[]) {
  let panel = document.querySelector<HTMLElement>(
    `#view-outlet > [data-view="${view}"]`,
  );
  if (!panel) {
    const template = document.createElement("template");
    template.innerHTML = markup[view];
    panel = document.adoptNode(
      template.content.firstElementChild!,
    ) as HTMLElement;
  }
  panels.set(view, panel);
}

export function pageUrl(view: View, hash = ""): URL {
  const route =
    document.body.dataset.urlStyle === "files"
      ? pageFiles[view]
      : paths[view].slice(1) || "./";
  const url = new URL(route, base);
  url.hash = hash;
  return url;
}

export function find<T extends Element = HTMLElement>(
  selector: string,
): T | null {
  const current = document.querySelector<T>(selector);
  if (current) return current;
  for (const panel of panels.values()) {
    if (panel.isConnected) continue;
    if (panel.matches(selector)) return panel as unknown as T;
    const match = panel.querySelector<T>(selector);
    if (match) return match;
  }
  return null;
}

export function all<T extends Element = HTMLElement>(selector: string): T[] {
  const results = [...document.querySelectorAll<T>(selector)];
  for (const panel of panels.values()) {
    if (panel.isConnected) continue;
    if (panel.matches(selector)) results.push(panel as unknown as T);
    results.push(...panel.querySelectorAll<T>(selector));
  }
  return results;
}

export function mountView(view: View): void {
  const outlet = document.querySelector("#view-outlet")!;
  const next = panels.get(view)!;
  for (const [name, panel] of panels) {
    panel.hidden = name !== view;
    panel.classList.toggle("is-active", name === view);
  }
  if (outlet.firstElementChild !== next) outlet.replaceChildren(next);
  for (const link of all<HTMLAnchorElement>("a[data-view-target]")) {
    link.href = pageUrl(
      link.dataset.viewTarget as View,
      new URL(link.href).hash,
    ).href;
  }
}
