import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import type { Plugin, PreviewServer, ViteDevServer } from "vite";

const pages = {
  preparar: "preparar.html",
  control: "control.html",
  marcador: "marcador.html",
  guia: "guia.html",
};

function pageModules(): Plugin {
  const routes = (server: ViteDevServer | PreviewServer) => {
    server.middlewares.use((request, _response, next) => {
      const url = new URL(request.url || "/", "http://localhost");
      const file = pages[url.pathname.slice(1) as keyof typeof pages];
      if (file) request.url = "/" + file + url.search;
      next();
    });
  };
  return {
    name: "page-modules",
    transformIndexHtml: {
      order: "pre",
      handler: (html) =>
        html.replace(
          /<!--\s*view:(home|setup|scoring|public|guide)\s*-->/g,
          (_match, view: string) =>
            readFileSync(
              new URL(`./src/views/${view}.html`, import.meta.url),
              "utf8",
            ),
        ),
    },
    configureServer: routes,
    configurePreviewServer: routes,
  };
}

export default defineConfig({
  base: "./",
  plugins: [pageModules()],
  build: {
    rollupOptions: {
      input: { app: "index.html", ...pages, legacyGuide: "guide.html" },
    },
  },
});
