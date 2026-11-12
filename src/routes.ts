export const pageFiles = {
  home: "index.html",
  setup: "preparar.html",
  scoring: "control.html",
  public: "marcador.html",
  guide: "guia.html",
} as const;

export type View = keyof typeof pageFiles;

export const paths: Record<View, string> = {
  home: "/",
  setup: "/preparar",
  scoring: "/control",
  public: "/marcador",
  guide: "/guia",
};

export function viewFromUrl(url: URL): View {
  const name = url.pathname.replace(/\/+$/, "").split("/").pop() || "";
  const legacy = url.searchParams.get("view");
  if (
    (!name || name === "index.html" || name === "index") &&
    legacy &&
    Object.hasOwn(pageFiles, legacy)
  )
    return legacy as View;
  return (
    (Object.keys(pageFiles) as View[]).find(
      (view) => name === pageFiles[view] || name === paths[view].slice(1),
    ) ?? (name === "guide" || name === "guide.html" ? "guide" : "home")
  );
}
