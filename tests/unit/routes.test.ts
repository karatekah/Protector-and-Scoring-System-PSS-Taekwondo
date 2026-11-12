import { describe, expect, it } from "vitest";
import { viewFromUrl } from "../../src/routes";

describe("page routes", () => {
  it("resolves clean paths and static page files", () => {
    for (const [path, view] of [
      ["/", "home"],
      ["/preparar", "setup"],
      ["/control", "scoring"],
      ["/marcador", "public"],
      ["/guia", "guide"],
      ["/guide.html", "guide"],
      ["/review/control.html", "scoring"],
    ]) {
      expect(viewFromUrl(new URL(path, "https://example.test"))).toBe(view);
    }
  });
  it("keeps old query links and rejects inherited property names", () => {
    expect(viewFromUrl(new URL("https://example.test/?view=public"))).toBe(
      "public",
    );
    expect(
      viewFromUrl(new URL("https://example.test/index.html?view=setup")),
    ).toBe("setup");
    expect(
      viewFromUrl(new URL("https://example.test/index?view=scoring")),
    ).toBe("scoring");
    for (const view of ["constructor", "__proto__", "toString", "unknown"]) {
      expect(viewFromUrl(new URL("https://example.test/?view=" + view))).toBe(
        "home",
      );
    }
    expect(
      viewFromUrl(new URL("https://example.test/marcador?view=scoring")),
    ).toBe("public");
  });
});
