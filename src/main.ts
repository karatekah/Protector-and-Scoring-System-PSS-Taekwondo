import "../css/styles.css";
import "../css/components.css";
import "../css/arena.css";
import "../css/workspace.css";
import { initLandingMotion } from "./landing-motion";
import { initScoreboardDemo } from "./scoreboard-demo";
import {
  applyAction,
  archive,
  createState,
  defaultConfig,
  formatClock,
  freshMatch,
  migrateLegacy,
  parseState,
  record,
  remainingTime,
  snapshot,
  undo,
} from "./match";
import type { Action, Side, Status } from "./match";

const STORAGE_KEY = "pss-taekwondo-match-v4";
const LEGACY_KEYS = ["pss-taekwondo-match-v3", "pss-taekwondo-match-v2"];
const publicOnly =
  new URLSearchParams(location.search).get("view") === "public";
const channel =
  "BroadcastChannel" in window
    ? new BroadcastChannel("pss-taekwondo-v4")
    : null;
const statusLabels: Record<Status, string> = {
  ready: "Preparado",
  running: "En combate",
  paused: "Pausa",
  timeout: "Tiempo técnico",
  ended: "Ronda terminada",
};
let state = createState();
let operator = false;
let timer: number | undefined;
let startMs = 0;
let startedAt = 0;
let lastSecond = -1;
let storageError = false;
let lastReceived = performance.now();
let staleDisplay = false;
let returnToControl = false;

function element<T extends HTMLElement = HTMLElement>(selector: string): T {
  const result = document.querySelector<T>(selector);
  if (!result) throw new Error(`Falta el elemento ${selector}`);
  return result;
}
function notify(message: string): void {
  element("#announcement").textContent = message;
}
function warning(message: string): void {
  element("#warning").textContent = message;
  element("#warning").hidden = !message;
}
function pauseLoadedState(): void {
  if (state.match.running) state.match.status = "paused";
  state.match.running = false;
}
function load(): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) state = parseState(JSON.parse(stored));
    else {
      const old = LEGACY_KEYS.map((key) => localStorage.getItem(key)).find(
        Boolean,
      );
      if (old) {
        state = migrateLegacy(JSON.parse(old));
        warning(
          "Datos anteriores recuperados: se conservaron los puntajes y los resúmenes de combates válidos. El deshacer y los registros detallados anteriores no se migran. Las claves originales siguen intactas.",
        );
      }
    }
    if (!publicOnly) pauseLoadedState();
  } catch {
    warning(
      "No se pudieron leer los datos guardados. El almacenamiento anterior sigue intacto. Puedes importar una copia JSON; una nueva acción guardará un combate nuevo.",
    );
  }
}
function publish(): void {
  if (!operator) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (storageError) {
      warning("");
      storageError = false;
    }
  } catch {
    storageError = true;
    warning(
      "No se pudo guardar en este navegador. Exporta una copia JSON antes de cerrar para conservar el combate.",
    );
  }
  channel?.postMessage(state);
}
function updateClock(): void {
  state.match.remainingMs = Math.ceil(
    remainingTime(startMs, startedAt, performance.now()),
  );
  if (state.match.remainingMs === 0) {
    stopClock();
    state.match.status = "ended";
    notify(
      "Ronda terminada. Revisa el marcador y continúa cuando corresponda.",
    );
  }
}
function stopClock(): void {
  if (timer !== undefined) window.clearInterval(timer);
  timer = undefined;
  state.match.running = false;
}
function settleClock(): void {
  if (state.match.running && operator) updateClock();
}
function change(action: () => void, message?: string): void {
  if (!operator) return;
  settleClock();
  action();
  render();
  publish();
  if (message) notify(message);
}
function toggleClock(): void {
  change(() => {
    if (state.match.running) {
      stopClock();
      state.match.status = "paused";
    } else if (state.match.remainingMs > 0) {
      startMs = state.match.remainingMs;
      startedAt = performance.now();
      state.match.running = true;
      state.match.status = "running";
      timer = window.setInterval(() => {
        updateClock();
        renderBindings();
        const second = Math.ceil(state.match.remainingMs / 1000);
        if (second !== lastSecond) {
          lastSecond = second;
          publish();
        }
        if (!state.match.running) renderControls();
      }, 100);
    }
  });
}
function renderBindings(): void {
  const m = state.match,
    c = state.config;
  document.body.dataset.matchStatus = m.status;
  const values: Record<string, string | number> = {
    ...c,
    roundDuration: formatClock(c.roundDuration * 1000),
    blueScore: m.blue.score,
    redScore: m.red.score,
    blueGamjeom: m.blue.gamjeom,
    redGamjeom: m.red.gamjeom,
    blueHits: m.blue.hits,
    redHits: m.red.hits,
    round: m.round,
    clock: formatClock(m.remainingMs),
    status: statusLabels[m.status],
    logCount: state.history.length,
    savedMatchCount: state.savedMatches.length,
    leader:
      m.blue.score === m.red.score
        ? "Empate en puntos"
        : `Lidera ${m.blue.score > m.red.score ? c.blueName : c.redName}`,
  };
  for (const [key, value] of Object.entries(values)) {
    document.querySelectorAll(`[data-bind="${key}"]`).forEach((el) => {
      el.textContent = String(value);
    });
  }
}
function renderControls(): void {
  document
    .querySelectorAll<HTMLButtonElement>("[data-mutation]")
    .forEach((button) => {
      button.disabled = !operator;
    });
  element<HTMLButtonElement>("#startPause").disabled =
    !operator || state.match.remainingMs <= 0;
  element("#startPause").textContent = state.match.running
    ? "Pausar · Kal-lyeo"
    : "Iniciar · Shijak";
  element<HTMLButtonElement>("#undo").disabled =
    !operator || !state.history[0]?.before;
  element<HTMLButtonElement>("#nextRound").disabled =
    !operator || state.match.round >= state.config.totalRounds;
  element<HTMLButtonElement>("#clearLog").disabled =
    !operator || state.history.length === 0;
  element("#operatorState").textContent = publicOnly
    ? "Pantalla de solo lectura"
    : operator
      ? "Operador activo · este navegador"
      : "Modo de solo lectura";
  element<HTMLFieldSetElement>("#setupFields").disabled = !operator;
}
function render(): void {
  renderBindings();
  renderControls();
  const log = element("[data-log-list]");
  log.replaceChildren();
  if (!state.history.length) {
    const li = document.createElement("li");
    li.textContent = "Las acciones del combate aparecerán aquí.";
    log.append(li);
  }
  for (const entry of state.history) {
    const li = document.createElement("li"),
      detail = document.createElement("span");
    li.textContent = entry.summary;
    detail.textContent = `Ronda ${entry.round} · ${entry.clock}`;
    li.append(detail);
    log.append(li);
  }
  const saved = element("[data-saved-match-list]");
  saved.replaceChildren();
  if (!state.savedMatches.length) {
    const li = document.createElement("li");
    li.className = "empty-archive";
    li.textContent =
      "Aún no hay resúmenes. Guarda uno desde Gestión del combate, en el panel de control.";
    saved.append(li);
  }
  for (const match of state.savedMatches) {
    const li = document.createElement("li"),
      title = document.createElement("strong"),
      detail = document.createElement("span");
    title.textContent = `${match.config.blueName} ${match.match.blue.score} — ${match.match.red.score} ${match.config.redName}`;
    detail.textContent = `${match.config.eventName} · ${new Date(match.savedAt).toLocaleString("es-PE")} · Resumen de entrenamiento`;
    li.append(title, detail);
    saved.append(li);
  }
}
function updateDurationPresets(): void {
  const seconds =
    Number(element<HTMLInputElement>("#setupRoundMinutes").value) * 60 +
    Number(element<HTMLInputElement>("#setupRoundSeconds").value);
  document
    .querySelectorAll<HTMLButtonElement>("[data-duration]")
    .forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(seconds === Number(button.dataset.duration)),
      );
    });
}
function setupForm(): void {
  const form = element<HTMLFormElement>("#matchSetupForm");
  for (const [key, value] of Object.entries(state.config)) {
    const field = form.elements.namedItem(key);
    if (field instanceof HTMLInputElement) field.value = String(value);
  }
  element<HTMLInputElement>("#setupRoundMinutes").value = String(
    Math.floor(state.config.roundDuration / 60),
  );
  element<HTMLInputElement>("#setupRoundSeconds").value = String(
    state.config.roundDuration % 60,
  );
  updateDurationPresets();
}
function showView(requested: string, focus = true): void {
  const view = publicOnly
    ? "public"
    : ["home", "setup", "scoring", "public"].includes(requested)
      ? requested
      : "home";
  document.body.dataset.currentView = view;
  document.querySelectorAll<HTMLElement>("[data-view]").forEach((panel) => {
    panel.hidden = panel.dataset.view !== view;
    panel.classList.toggle("is-active", !panel.hidden);
  });
  document
    .querySelectorAll<HTMLButtonElement>(".tab-button[data-view-target]")
    .forEach((button) => {
      button.classList.toggle("is-active", button.dataset.viewTarget === view);
      if (button.dataset.viewTarget === view)
        button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
  document.title = `${{ home: "Inicio", setup: "Preparar combate", scoring: "Control", public: "Marcador" }[view]} · PSS Taekwondo`;
  if (view === "setup") setupForm();
  if (focus) {
    element<HTMLElement>(`[data-view="${view}"]`).focus({
      preventScroll: true,
    });
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }
}
async function togglePublicFullscreen(): Promise<void> {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    returnToControl = document.body.dataset.currentView === "scoring";
    showView("public");
    await element('[data-view="public"]').requestFullscreen();
  } catch {
    if (!document.fullscreenElement) {
      if (returnToControl) showView("scoring");
      returnToControl = false;
    }
    warning(
      "No se pudo abrir la pantalla completa. Usa Marcador y vuelve a intentarlo, o pulsa F11.",
    );
  }
}
function exportData(): void {
  settleClock();
  const blob = new Blob(
    [
      JSON.stringify(
        { ...state, exportedAt: new Date().toISOString() },
        null,
        2,
      ),
    ],
    { type: "application/json" },
  );
  const url = URL.createObjectURL(blob),
    link = document.createElement("a");
  link.href = url;
  link.download = `pss-combates-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  notify(
    "Copia JSON exportada. Guárdala antes de borrar los datos del navegador.",
  );
}
function bind(): void {
  document
    .querySelectorAll<HTMLButtonElement>("[data-duration]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        if (!operator) return;
        const seconds = Number(button.dataset.duration);
        element<HTMLInputElement>("#setupRoundMinutes").value = String(
          Math.floor(seconds / 60),
        );
        element<HTMLInputElement>("#setupRoundSeconds").value = String(
          seconds % 60,
        );
        element<HTMLInputElement>("#setupRoundSeconds").setCustomValidity("");
        updateDurationPresets();
      });
    });
  document
    .querySelectorAll<HTMLElement>("[data-view-target]")
    .forEach((button) => {
      button.addEventListener("click", () =>
        showView(button.dataset.viewTarget || "home"),
      );
    });
  document.querySelectorAll("[data-open-public]").forEach((button) =>
    button.addEventListener("click", () => {
      const url = new URL(location.href);
      url.searchParams.set("view", "public");
      if (!window.open(url, "pss-public-scoreboard"))
        warning(
          "El navegador bloqueó la ventana. Permite las ventanas emergentes de este sitio e inténtalo otra vez.",
        );
    }),
  );
  document
    .querySelectorAll("[data-fullscreen]")
    .forEach((button) =>
      button.addEventListener("click", () => void togglePublicFullscreen()),
    );
  document.addEventListener("fullscreenchange", () => {
    const presenting =
      document.fullscreenElement === element('[data-view="public"]');
    document.body.classList.toggle("is-presenting", presenting);
    document
      .querySelectorAll<HTMLElement>("[data-fullscreen-label]")
      .forEach((label) => {
        label.textContent = presenting
          ? "Salir de pantalla completa"
          : "Pantalla completa";
      });
    if (!document.fullscreenElement && returnToControl) {
      returnToControl = false;
      showView("scoring");
    }
  });
  element("#startPause").addEventListener("click", toggleClock);
  element("#timeout").addEventListener("click", () =>
    change(() => {
      stopClock();
      state.match.status = "timeout";
    }, "Tiempo técnico. El reloj está detenido."),
  );
  element("#undo").addEventListener("click", () =>
    change(() => {
      stopClock();
      undo(state);
    }, "Última acción deshecha. El reloj queda pausado."),
  );
  element("#nextRound").addEventListener("click", () =>
    change(() => {
      if (state.match.round >= state.config.totalRounds) return;
      const before = snapshot(state);
      stopClock();
      state.match.round += 1;
      state.match.remainingMs = state.config.roundDuration * 1000;
      state.match.status = "ready";
      record(
        state,
        `Ronda ${state.match.round} preparada. Se conservan los puntos acumulados.`,
        before,
      );
    }),
  );
  element("#swapSides").addEventListener("click", () =>
    change(() => {
      const before = snapshot(state);
      [state.match.blue, state.match.red] = [state.match.red, state.match.blue];
      [state.config.blueName, state.config.redName] = [
        state.config.redName,
        state.config.blueName,
      ];
      [state.config.blueCountry, state.config.redCountry] = [
        state.config.redCountry,
        state.config.blueCountry,
      ];
      record(state, "Competidores intercambiados entre azul y rojo.", before);
    }),
  );
  element("#saveMatch").addEventListener("click", () =>
    change(() => {
      archive(state);
    }, "Resumen guardado en este navegador. Exporta JSON para conservar una copia externa."),
  );
  element("#resetMatch").addEventListener("click", () => {
    if (
      !operator ||
      !window.confirm(
        "¿Preparar un combate nuevo? Se guardará un resumen del actual y se reiniciarán el reloj y los puntos.",
      )
    )
      return;
    change(() => {
      stopClock();
      archive(state);
      state.match = freshMatch(state.config.roundDuration);
      state.history = [];
    }, "Combate anterior guardado. Nuevo combate preparado.");
  });
  element("#clearLog").addEventListener("click", () => {
    if (
      !operator ||
      !window.confirm(
        "¿Borrar el registro de acciones? Los puntos se conservarán y ya no podrás deshacer estas acciones.",
      )
    )
      return;
    change(() => {
      state.history = [];
    }, "Registro borrado. Los puntos se conservaron.");
  });
  element("#exportLog").addEventListener("click", exportData);
  element("#importTrigger").addEventListener("click", () =>
    element<HTMLInputElement>("#importFile").click(),
  );
  element<HTMLInputElement>("#importFile").addEventListener(
    "change",
    async (event) => {
      const input = event.currentTarget as HTMLInputElement,
        file = input.files?.[0];
      if (!file || !operator) return;
      try {
        if (file.size > 5 * 1024 * 1024) throw new Error("size");
        const imported = parseState(JSON.parse(await file.text()));
        if (
          !window.confirm(
            "¿Restaurar esta copia? Reemplazará el combate y los resúmenes de este navegador. Exporta primero si necesitas conservarlos.",
          )
        )
          return;
        change(() => {
          stopClock();
          state = imported;
          pauseLoadedState();
        }, "Copia restaurada. El reloj está pausado.");
        warning("");
      } catch {
        warning(
          "No se pudo importar el archivo. Usa una copia JSON de PSS alpha 0.1 de hasta 5 MB. Los datos actuales se conservaron.",
        );
      } finally {
        input.value = "";
      }
    },
  );
  element<HTMLFormElement>("#matchSetupForm").addEventListener(
    "submit",
    (event) => {
      event.preventDefault();
      if (!operator) return;
      const form = event.currentTarget as HTMLFormElement,
        data = new FormData(form);
      const minutes = Number(data.get("roundMinutes")),
        seconds = Number(data.get("roundSeconds"));
      if (minutes * 60 + seconds < 10) {
        element<HTMLInputElement>("#setupRoundSeconds").setCustomValidity(
          "La ronda debe durar al menos 10 segundos.",
        );
        form.reportValidity();
        return;
      }
      if (
        (state.history.length ||
          state.match.blue.score ||
          state.match.red.score) &&
        !window.confirm(
          "La configuración preparará un combate nuevo y guardará un resumen del actual. ¿Continuar?",
        )
      )
        return;
      change(() => {
        stopClock();
        if (
          state.history.length ||
          state.match.blue.score ||
          state.match.red.score
        )
          archive(state);
        const value = (name: string, fallback: string) =>
          String(data.get(name) || "").trim() || fallback;
        state.config = {
          eventName: value("eventName", defaultConfig.eventName),
          totalRounds: Number(data.get("totalRounds")),
          roundDuration: minutes * 60 + seconds,
          blueName: value("blueName", "Azul"),
          redName: value("redName", "Rojo"),
          blueCountry: value("blueCountry", "PER").toUpperCase(),
          redCountry: value("redCountry", "PER").toUpperCase(),
        };
        state.match = freshMatch(state.config.roundDuration);
        state.history = [];
      }, "Combate preparado. Inicia el reloj desde el panel de control.");
      showView("scoring");
    },
  );
  element("#setupRoundSeconds").addEventListener("input", () => {
    element<HTMLInputElement>("#setupRoundSeconds").setCustomValidity("");
    updateDurationPresets();
  });
  element("#setupRoundMinutes").addEventListener("input", () => {
    element<HTMLInputElement>("#setupRoundSeconds").setCustomValidity("");
    updateDurationPresets();
  });
  const receive = (input: unknown) => {
    if (operator) return;
    try {
      state = parseState(input);
      lastReceived = performance.now();
      if (staleDisplay) {
        warning("");
        staleDisplay = false;
      }
      render();
    } catch {
      warning(
        "Se recibió una actualización inválida. Se mantiene el último marcador válido.",
      );
    }
  };
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        receive(JSON.parse(event.newValue));
      } catch {
        /* Keep the last valid display. */
      }
    }
  });
  channel?.addEventListener("message", (event) => receive(event.data));
  window.addEventListener("pagehide", () => {
    if (operator) {
      settleClock();
      stopClock();
      if (state.match.status === "running") state.match.status = "paused";
      publish();
      operator = false;
    }
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) location.reload();
  });
}
function createButtons(): void {
  document
    .querySelectorAll<HTMLElement>(".score-buttons")
    .forEach((container) => {
      const side = container.dataset.side as Side;
      const actions: { label: string; detail: string; action: Action }[] = [
        ...[1, 2, 3, 4, 5, 6].map((points) => ({
          label: `+${points}`,
          detail: points === 1 ? "punto" : "puntos",
          action: { type: "points" as const, points },
        })),
        {
          label: "Gam-jeom",
          detail: "+1 para el rival",
          action: { type: "gamjeom" },
        },
        { label: "Impacto", detail: "Sin punto", action: { type: "hit" } },
      ];
      for (const { label, detail, action } of actions) {
        const button = document.createElement("button"),
          title = document.createElement("strong"),
          small = document.createElement("small");
        button.type = "button";
        button.className = "score-action static-press";
        button.dataset.mutation = "";
        button.setAttribute(
          "aria-label",
          `${label} ${detail} · ${side === "blue" ? "azul" : "rojo"}`,
        );
        title.textContent = label;
        small.textContent = detail;
        button.append(title, small);
        button.addEventListener("click", () =>
          change(
            () => applyAction(state, side, action),
            `${side === "blue" ? "Azul" : "Rojo"}: ${label}. ${detail}.`,
          ),
        );
        container.append(button);
      }
    });
}

document.body.classList.toggle("public-window", publicOnly);
load();
createButtons();
bind();
render();
showView(new URLSearchParams(location.search).get("view") || "home", false);
if (!publicOnly) {
  initLandingMotion();
  initScoreboardDemo();
}
if (!publicOnly) {
  if (!navigator.locks)
    warning(
      "Este navegador no permite reservar un único operador. Abre la demo por HTTPS en Chrome, Edge o Firefox actualizado.",
    );
  else
    void navigator.locks.request(
      "pss-taekwondo-operator-v4",
      { ifAvailable: true },
      async (lock) => {
        if (!lock) {
          warning(
            "Otra pestaña controla el combate. Ciérrala y recarga esta página para tomar el control. Puedes abrir el marcador en una ventana de solo lectura.",
          );
          return;
        }
        operator = true;
        renderControls();
        await new Promise<void>((resolve) =>
          window.addEventListener("pagehide", () => resolve(), { once: true }),
        );
      },
    );
}
if (publicOnly)
  window.setInterval(() => {
    if (
      state.match.running &&
      performance.now() - lastReceived > 3500 &&
      !staleDisplay
    ) {
      staleDisplay = true;
      warning(
        "El marcador no está recibiendo actualizaciones. Revisa la pestaña de control y evita suspender el equipo. Se muestra el último dato recibido.",
      );
    }
  }, 1000);
