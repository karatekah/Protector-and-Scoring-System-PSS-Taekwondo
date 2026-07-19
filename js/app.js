const STORAGE_KEY = "pss-taekwondo-match-v3";
const LEGACY_STORAGE_KEYS = ["pss-taekwondo-match-v2"];
const SYNC_CHANNEL = "pss-taekwondo-match-sync";
const CLIENT_ID =
  window.crypto && window.crypto.randomUUID
    ? window.crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;
const syncChannel = "BroadcastChannel" in window ? new BroadcastChannel(SYNC_CHANNEL) : null;

const scoringActions = [
  {
    id: "punch",
    label: "Puno al tronco",
    detail: "Golpe de puno valido",
    points: 1,
    icon: "PU",
  },
  {
    id: "trunk",
    label: "Patada basica al tronco",
    detail: "Impacto al peto",
    points: 2,
    icon: "TR",
  },
  {
    id: "spin-trunk",
    label: "Patada con giro al tronco",
    detail: "Tecnica giratoria al peto",
    points: 4,
    icon: "+T",
  },
  {
    id: "head",
    label: "Patada directa a la cabeza",
    detail: "Impacto al casco",
    points: 3,
    icon: "HE",
  },
  {
    id: "spin-head",
    label: "Patada con giro a la cabeza",
    detail: "Tecnica giratoria al casco",
    points: 6,
    icon: "+H",
  },
  {
    id: "gamjeom",
    label: "Gam-jeom",
    detail: "Penaliza al atleta y suma al rival",
    points: 1,
    icon: "G",
    type: "gamjeom",
  },
  {
    id: "hit",
    label: "Hit",
    detail: "Marca impacto sin punto",
    points: 0,
    icon: "HIT",
    type: "hit",
  },
];

const defaultState = {
  config: {
    eventName: "Combate Taekwondo - M-58 kg",
    totalRounds: 3,
    roundDuration: 120,
    blueName: "Azul",
    blueCountry: "PER",
    redName: "Rojo",
    redCountry: "KOR",
  },
  match: {
    blue: { score: 0, gamjeom: 0, hits: 0 },
    red: { score: 0, gamjeom: 0, hits: 0 },
    round: 1,
    seconds: 120,
    running: false,
    status: "Ready",
    history: [],
  },
  savedMatches: [],
  updatedAt: Date.now(),
};

const state = loadState();

const els = {
  setupForm: document.querySelector("#matchSetupForm"),
  setupEventName: document.querySelector("#setupEventName"),
  setupTotalRounds: document.querySelector("#setupTotalRounds"),
  setupRoundMinutes: document.querySelector("#setupRoundMinutes"),
  setupRoundSeconds: document.querySelector("#setupRoundSeconds"),
  setupBlueName: document.querySelector("#setupBlueName"),
  setupBlueCountry: document.querySelector("#setupBlueCountry"),
  setupRedName: document.querySelector("#setupRedName"),
  setupRedCountry: document.querySelector("#setupRedCountry"),
  startPause: document.querySelector("#startPause"),
  timeout: document.querySelector("#timeout"),
  nextRound: document.querySelector("#nextRound"),
  swapSides: document.querySelector("#swapSides"),
  undo: document.querySelector("#undo"),
  saveMatch: document.querySelector("#saveMatch"),
  resetMatch: document.querySelector("#resetMatch"),
  clearLog: document.querySelector("#clearLog"),
  exportLog: document.querySelector("#exportLog"),
};

let timerId = null;
let applyingRemoteState = false;

function safeClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  try {
    const stored =
      window.localStorage.getItem(STORAGE_KEY) ||
      LEGACY_STORAGE_KEYS.map((key) => window.localStorage.getItem(key)).find(Boolean);
    if (!stored) return safeClone(defaultState);
    return normalizeState(JSON.parse(stored));
  } catch (error) {
    return safeClone(defaultState);
  }
}

function normalizeState(input) {
  const isLive = Date.now() - Number(input?.updatedAt || 0) < 3000;
  const config = { ...defaultState.config, ...input?.config };

  if (config.blueName === "Chung") config.blueName = "Azul";
  if (config.redName === "Hong") config.redName = "Rojo";

  return {
    config,
    match: {
      ...defaultState.match,
      ...input?.match,
      blue: { ...defaultState.match.blue, ...input?.match?.blue },
      red: { ...defaultState.match.red, ...input?.match?.red },
      history: Array.isArray(input?.match?.history) ? input.match.history : [],
      running: isLive ? Boolean(input?.match?.running) : false,
    },
    savedMatches: Array.isArray(input?.savedMatches) ? input.savedMatches : [],
    updatedAt: Number(input?.updatedAt || Date.now()),
  };
}

function serializeState() {
  return {
    config: safeClone(state.config),
    match: safeClone(state.match),
    savedMatches: safeClone(state.savedMatches),
    updatedAt: Date.now(),
  };
}

function replaceState(nextState) {
  state.config = nextState.config;
  state.match = nextState.match;
  state.savedMatches = nextState.savedMatches;
  state.updatedAt = nextState.updatedAt;
}

function saveState({ broadcast = true } = {}) {
  const payload = serializeState();
  state.updatedAt = payload.updatedAt;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

  if (broadcast && syncChannel && !applyingRemoteState) {
    syncChannel.postMessage({
      type: "state:update",
      clientId: CLIENT_ID,
      payload,
    });
  }
}

function applyRemoteState(payload) {
  applyingRemoteState = true;
  stopTimer({ sync: false });
  replaceState(normalizeState(payload));
  render({ persist: false });
  applyingRemoteState = false;
}

function formatClock(totalSeconds) {
  const safeTotal = Math.max(0, Number(totalSeconds) || 0);
  const minutes = Math.floor(safeTotal / 60).toString().padStart(2, "0");
  const seconds = (safeTotal % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function normalizeCountry(value, fallback) {
  const clean = String(value || fallback)
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 3);
  return clean || fallback;
}

function clampNumber(value, min, max, fallback) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return fallback;
  return Math.min(max, Math.max(min, Math.round(numeric)));
}

function sideLabel(side) {
  return side === "blue" ? state.config.blueName : state.config.redName;
}

function opponentOf(side) {
  return side === "blue" ? "red" : "blue";
}

function snapshot() {
  return {
    config: safeClone(state.config),
    match: safeClone(state.match),
    savedMatches: safeClone(state.savedMatches),
  };
}

function restore(previous) {
  stopTimer({ sync: false });
  state.config = previous.config;
  state.match = previous.match;
  state.savedMatches = previous.savedMatches || state.savedMatches;
  state.match.running = false;
  render();
}

function pushHistory(entry) {
  state.match.history.unshift({
    ...entry,
    at: new Date().toISOString(),
    displayTime: formatClock(state.match.seconds),
    round: state.match.round,
  });
  state.match.history = state.match.history.slice(0, 120);
}

function applyAction(side, action) {
  const before = snapshot();
  const rival = opponentOf(side);
  let summary = "";

  if (action.type === "gamjeom") {
    state.match[side].gamjeom += 1;
    state.match[rival].score += 1;
    summary = `${sideLabel(side)} recibe Gam-jeom. +1 para ${sideLabel(rival)}.`;
  } else if (action.type === "hit") {
    state.match[side].hits += 1;
    summary = `${sideLabel(side)} registra Hit.`;
  } else {
    state.match[side].score += action.points;
    summary = `${sideLabel(side)}: ${action.label} (+${action.points}).`;
  }

  pushHistory({
    summary,
    detail: `R${state.match.round} ${formatClock(state.match.seconds)}`,
    before,
  });
  render();
}

function undoLast() {
  const last = state.match.history[0];
  if (!last) return;
  restore(last.before);
}

function stopTimer({ sync = false } = {}) {
  if (timerId) {
    window.clearInterval(timerId);
    timerId = null;
  }
  state.match.running = false;
  if (sync) render();
}

function startTimer() {
  if (timerId || state.match.seconds <= 0) return;
  state.match.running = true;
  state.match.status = "Fight";
  render();

  timerId = window.setInterval(() => {
    state.match.seconds = Math.max(0, state.match.seconds - 1);
    if (state.match.seconds === 0) {
      state.match.status = "End";
      stopTimer({ sync: false });
    }
    render();
  }, 1000);
}

function toggleTimer() {
  if (state.match.running) {
    stopTimer({ sync: false });
    state.match.status = "Kal-lyeo";
    render();
  } else {
    startTimer();
  }
}

function setTimeoutState() {
  stopTimer({ sync: false });
  state.match.status = "Time out";
  render();
}

function nextRound() {
  if (state.match.round >= state.config.totalRounds) {
    stopTimer({ sync: false });
    state.match.status = "End";
    render();
    return;
  }

  const before = snapshot();
  stopTimer({ sync: false });
  state.match.round += 1;
  state.match.seconds = state.config.roundDuration;
  state.match.status = "Ready";
  pushHistory({
    summary: `Inicia round ${state.match.round}.`,
    detail: "Cambio de ronda",
    before,
  });
  render();
}

function swapSides() {
  const before = snapshot();
  const blueMatch = { ...state.match.blue };
  state.match.blue = { ...state.match.red };
  state.match.red = blueMatch;

  const blueName = state.config.blueName;
  const blueCountry = state.config.blueCountry;
  state.config.blueName = state.config.redName;
  state.config.blueCountry = state.config.redCountry;
  state.config.redName = blueName;
  state.config.redCountry = blueCountry;

  pushHistory({
    summary: "Se invirtieron los competidores azul y rojo.",
    detail: "Switch",
    before,
  });
  render();
}

function hasMatchActivity() {
  return (
    state.match.history.length > 0 ||
    state.match.blue.score > 0 ||
    state.match.red.score > 0 ||
    state.match.blue.gamjeom > 0 ||
    state.match.red.gamjeom > 0 ||
    state.match.round > 1 ||
    state.match.seconds !== state.config.roundDuration
  );
}

function winnerText() {
  if (state.match.blue.score === state.match.red.score) return "Empate";
  return state.match.blue.score > state.match.red.score
    ? state.config.blueName
    : state.config.redName;
}

function archiveCurrentMatch(reason = "Guardado manual") {
  if (!hasMatchActivity()) return false;

  state.savedMatches.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    savedAt: new Date().toISOString(),
    reason,
    eventName: state.config.eventName,
    totalRounds: state.config.totalRounds,
    roundDuration: state.config.roundDuration,
    currentRound: state.match.round,
    clock: formatClock(state.match.seconds),
    status: state.match.status,
    blue: {
      name: state.config.blueName,
      country: state.config.blueCountry,
      ...state.match.blue,
    },
    red: {
      name: state.config.redName,
      country: state.config.redCountry,
      ...state.match.red,
    },
    winner: winnerText(),
    history: state.match.history.slice().reverse(),
  });
  state.savedMatches = state.savedMatches.slice(0, 80);
  return true;
}

function saveCurrentMatch() {
  const saved = archiveCurrentMatch("Guardado manual");
  if (saved) {
    pushHistory({
      summary: "Combate guardado en el historial del sistema.",
      detail: "Archivo local",
      before: snapshot(),
    });
  }
  render();
}

function resetMatch() {
  archiveCurrentMatch("Nuevo combate");
  stopTimer({ sync: false });
  state.match.blue = { score: 0, gamjeom: 0, hits: 0 };
  state.match.red = { score: 0, gamjeom: 0, hits: 0 };
  state.match.round = 1;
  state.match.seconds = state.config.roundDuration;
  state.match.status = "Ready";
  state.match.history = [];
  render();
}

function saveSetup(event) {
  event.preventDefault();
  const minutes = clampNumber(els.setupRoundMinutes.value, 0, 9, 2);
  const seconds = clampNumber(els.setupRoundSeconds.value, 0, 59, 0);
  const duration = Math.max(10, minutes * 60 + seconds);
  const before = snapshot();

  state.config.eventName = els.setupEventName.value.trim() || defaultState.config.eventName;
  state.config.totalRounds = clampNumber(els.setupTotalRounds.value, 1, 5, 3);
  state.config.roundDuration = duration;
  state.config.blueName = els.setupBlueName.value.trim() || "Azul";
  state.config.blueCountry = normalizeCountry(els.setupBlueCountry.value, "PER");
  state.config.redName = els.setupRedName.value.trim() || "Rojo";
  state.config.redCountry = normalizeCountry(els.setupRedCountry.value, "KOR");

  if (state.match.round > state.config.totalRounds) {
    state.match.round = state.config.totalRounds;
  }

  if (!state.match.running && state.match.status === "Ready") {
    state.match.seconds = state.config.roundDuration;
  }

  pushHistory({
    summary: "Configuracion del combate actualizada.",
    detail: `${state.config.totalRounds} rondas / ${formatClock(state.config.roundDuration)}`,
    before,
  });
  render();
  showView("scoring");
}

function clearLog() {
  state.match.history = [];
  render();
}

function exportLog() {
  const payload = {
    exportedAt: new Date().toISOString(),
    currentMatch: {
      config: state.config,
      match: state.match,
    },
    savedMatches: state.savedMatches,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "taekwondo-match-records.json";
  link.click();
  URL.revokeObjectURL(url);
}

function leaderText() {
  const blue = state.match.blue.score;
  const red = state.match.red.score;
  if (blue === red) return "Empate";
  return blue > red ? `Ventaja ${state.config.blueName}` : `Ventaja ${state.config.redName}`;
}

function updateSetupForm() {
  els.setupEventName.value = state.config.eventName;
  els.setupTotalRounds.value = state.config.totalRounds;
  els.setupRoundMinutes.value = Math.floor(state.config.roundDuration / 60);
  els.setupRoundSeconds.value = state.config.roundDuration % 60;
  els.setupBlueName.value = state.config.blueName;
  els.setupBlueCountry.value = state.config.blueCountry;
  els.setupRedName.value = state.config.redName;
  els.setupRedCountry.value = state.config.redCountry;
}

function renderBindings() {
  const values = {
    eventName: state.config.eventName,
    totalRounds: state.config.totalRounds,
    roundDuration: formatClock(state.config.roundDuration),
    blueName: state.config.blueName,
    blueCountry: state.config.blueCountry,
    redName: state.config.redName,
    redCountry: state.config.redCountry,
    blueScore: state.match.blue.score,
    redScore: state.match.red.score,
    blueGamjeom: state.match.blue.gamjeom,
    redGamjeom: state.match.red.gamjeom,
    round: state.match.round,
    clock: formatClock(state.match.seconds),
    status: state.match.status,
    leader: leaderText(),
    logCount: state.match.history.length,
    savedMatchCount: state.savedMatches.length,
  };

  Object.entries(values).forEach(([key, value]) => {
    document.querySelectorAll(`[data-bind="${key}"]`).forEach((el) => {
      el.textContent = value;
    });
  });
}

function renderHistory() {
  document.querySelectorAll("[data-log-list]").forEach((list) => {
    list.innerHTML = "";
    state.match.history.forEach((item) => {
      const li = document.createElement("li");
      li.append(document.createTextNode(item.summary));
      const span = document.createElement("span");
      span.textContent = item.detail;
      li.append(span);
      list.appendChild(li);
    });
  });
}

function renderSavedMatches() {
  document.querySelectorAll("[data-saved-match-list]").forEach((list) => {
    list.innerHTML = "";

    if (state.savedMatches.length === 0) {
      const empty = document.createElement("li");
      empty.textContent = "Aun no hay combates guardados.";
      list.appendChild(empty);
      return;
    }

    state.savedMatches.forEach((match) => {
      const li = document.createElement("li");
      const title = document.createElement("strong");
      title.textContent = `${match.blue.name} ${match.blue.score} - ${match.red.score} ${match.red.name}`;
      const meta = document.createElement("span");
      meta.textContent = `${match.eventName} | ${new Date(match.savedAt).toLocaleString()} | ${match.reason}`;
      const detail = document.createElement("span");
      detail.textContent = `Ganador: ${match.winner}. Acciones: ${match.history.length}. Ronda ${match.currentRound}/${match.totalRounds}.`;
      li.append(title, meta, detail);
      list.appendChild(li);
    });
  });
}

function renderButtons() {
  document.querySelectorAll(".score-buttons").forEach((container) => {
    const side = container.dataset.side;
    container.innerHTML = "";
    scoringActions.forEach((action) => {
      const button = document.createElement("button");
      button.className = "score-action";
      button.type = "button";

      const icon = document.createElement("span");
      icon.className = `action-icon ${action.type === "hit" ? "hit-icon" : ""}`;
      icon.textContent = action.icon;

      const text = document.createElement("span");
      const strong = document.createElement("strong");
      strong.textContent = action.label;
      const small = document.createElement("small");
      small.textContent = action.detail;
      text.append(strong, small);

      const delta = document.createElement("span");
      delta.className = "delta";
      delta.textContent = action.type === "gamjeom" ? "+1" : action.points ? `+${action.points}` : "";

      button.append(icon, text, delta);
      button.addEventListener("click", () => applyAction(side, action));
      container.appendChild(button);
    });
  });
}

function renderControls() {
  els.startPause.textContent = state.match.running ? "Kal-lyeo" : "Shijak";
  els.undo.disabled = state.match.history.length === 0;
  els.nextRound.disabled = state.match.round >= state.config.totalRounds && state.match.status === "End";
}

function render({ persist = true } = {}) {
  updateSetupForm();
  renderBindings();
  renderHistory();
  renderSavedMatches();
  renderControls();
  if (persist) saveState();
}

function showView(viewName) {
  document.querySelectorAll("[data-view]").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.view === viewName);
  });
  document.querySelectorAll("[data-view-target]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.viewTarget === viewName);
  });
}

function openPublicWindow() {
  const url = new URL(window.location.href);
  url.searchParams.set("view", "public");
  window.open(url.toString(), "pss-public-scoreboard");
}

async function requestPublicFullscreen() {
  showView("public");
  const target = document.querySelector('[data-view="public"]') || document.documentElement;
  if (!document.fullscreenElement && target.requestFullscreen) {
    await target.requestFullscreen();
  }
}

function bindEvents() {
  document.querySelectorAll("[data-view-target]").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.viewTarget));
  });

  document.querySelectorAll("[data-open-public]").forEach((button) => {
    button.addEventListener("click", openPublicWindow);
  });

  document.querySelectorAll("[data-fullscreen]").forEach((button) => {
    button.addEventListener("click", requestPublicFullscreen);
  });

  els.setupForm.addEventListener("submit", saveSetup);
  els.startPause.addEventListener("click", toggleTimer);
  els.timeout.addEventListener("click", setTimeoutState);
  els.nextRound.addEventListener("click", nextRound);
  els.swapSides.addEventListener("click", swapSides);
  els.undo.addEventListener("click", undoLast);
  els.saveMatch.addEventListener("click", saveCurrentMatch);
  els.resetMatch.addEventListener("click", resetMatch);
  els.clearLog.addEventListener("click", clearLog);
  els.exportLog.addEventListener("click", exportLog);

  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    applyRemoteState(JSON.parse(event.newValue));
  });

  if (syncChannel) {
    syncChannel.addEventListener("message", (event) => {
      if (event.data?.type !== "state:update" || event.data.clientId === CLIENT_ID) return;
      applyRemoteState(event.data.payload);
    });
  }
}

if (state.match.seconds <= 0 || state.match.seconds > state.config.roundDuration) {
  state.match.seconds = state.config.roundDuration;
}

renderButtons();
bindEvents();
render();
showView(new URLSearchParams(window.location.search).get("view") || "home");
