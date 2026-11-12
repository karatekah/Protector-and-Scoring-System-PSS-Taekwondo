import { countryData } from "./country-data";

const countriesByCode = new Map(
  countryData.map((country) => [country.code, country]),
);
const aliases: Record<string, string> = {
  GRE: "GRC",
  GER: "DEU",
  NED: "NLD",
  SUI: "CHE",
  POR: "PRT",
  RSA: "ZAF",
  TPE: "TWN",
};

export const countries = countryData;

export function countryForCode(value: string) {
  const code = value.trim().toUpperCase();
  return countriesByCode.get(
    Object.hasOwn(aliases, code) ? aliases[code] : code,
  );
}
