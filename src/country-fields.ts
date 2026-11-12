import { countries, countryForCode } from "./countries";
import { all } from "./pages";
import type { Config } from "./match";

function showFlag(image: HTMLImageElement, code: string): void {
  const country = countryForCode(code);
  image.hidden = !country;
  if (!country) {
    image.removeAttribute("src");
    image.alt = "";
    return;
  }
  const url = new URL(`./flags/${country.alpha2}.svg`, location.href).href;
  if (image.src !== url) image.src = url;
  image.alt = `Bandera de ${country.name}`;
}

export function setupCountryFields(config: Config): void {
  for (const side of ["blue", "red"] as const) {
    const name = `${side}Country` as const;
    for (const select of all<HTMLSelectElement>(`select[name="${name}"]`)) {
      if (!select.dataset.countriesReady) {
        select.replaceChildren(
          ...countries.map((country) => new Option(country.name, country.code)),
        );
        select.dataset.countriesReady = "true";
      }
      const code = config[name];
      if (![...select.options].some((option) => option.value === code)) {
        const country = countryForCode(code);
        select.add(
          new Option(
            `${country?.name ?? code} · Código guardado ${code}`,
            code,
          ),
        );
      }
      select.value = code;
      const update = () => {
        for (const image of all<HTMLImageElement>(
          `[data-setup-country-flag="${side}"]`,
        ))
          showFlag(image, select.value);
      };
      if (!select.dataset.countryBound) {
        select.addEventListener("change", update);
        select.dataset.countryBound = "true";
      }
      update();
    }
  }
}

export function renderCountryFlags(config: Config): void {
  for (const side of ["blue", "red"] as const) {
    for (const image of all<HTMLImageElement>(
      `img[data-country-flag="${side}"]`,
    )) {
      showFlag(image, config[`${side}Country`]);
    }
  }
}
