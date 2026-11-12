import { describe, expect, it } from "vitest";
import { countries, countryForCode } from "../../src/countries";

describe("country catalog", () => {
  it("has unique codes and valid local flag identifiers for every country", () => {
    expect(countries.length).toBeGreaterThanOrEqual(249);
    expect(new Set(countries.map((country) => country.code)).size).toBe(
      countries.length,
    );
    for (const country of countries) {
      expect(country.code).toMatch(/^[A-Z]{3}$/);
      expect(country.alpha2).toMatch(/^[a-z]{2}$/);
    }
  });
  it("resolves stored codes and sports aliases without inventing unknown flags", () => {
    expect(countryForCode(" per ")?.name).toBe("Perú");
    expect(countryForCode("GRE")?.alpha2).toBe("gr");
    expect(countryForCode("GRC")?.alpha2).toBe("gr");
    expect(countryForCode("GBR")?.alpha2).toBe("gb");
    for (const code of ["XYZ", "../../us", "toString", "constructor"])
      expect(countryForCode(code)).toBeUndefined();
  });
});
