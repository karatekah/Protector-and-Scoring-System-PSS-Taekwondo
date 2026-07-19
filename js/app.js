const STORAGE_KEY = "pss-taekwondo-match-v2";

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
    blueName: "Chung",
    blueCountry: "PER",
    redName: "Hong",
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
  resetMatch: document.querySelector("#resetMatch"),
  clearLog: document.querySelector("#clearLog"),
  exportLog: document.querySelector("#exportLog"),
};

let timerId = null;

function loadState() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return structuredClone(defaultState);
    const parsed = JSON.parse(stored);
    return {
      config: { ...defaultState.config, ...parsed.config },
      match: {
        ...defaultState.match,
        ...parsed.match,
        blue: { ...defaultState.match.blue, ...parsed.match?.blue },
        red: { ...defaultState.match.red, ...parsed.match?.red },
        running: false,
      },
    };
  } catch (error) {
    return structuredClone(defaultState);
  }
}

function saveState() {
  const toStore = structuredClone(state);
  toStore.match.running = false;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
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
    config: structuredClone(state.config),
    match: structuredClone(state.match),
  };
}

function restore(previous) {
  stopTimer();
  state.config = previous.config;
  state.match = previous.match;
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

function stopTimer() {
  if (timerId) {
    window.clearInterval(timerId);
    timerId = null;
  }
  state.match.running = false;
}

function startTimer() {
  if (timerId || state.match.seconds <= 0) return;
  state.match.running = true;
  state.match.status = "Fight";
  timerId = window.setInterval(() => {
    state.match.seconds = Math.max(0, state.match.seconds - 1);
    if (state.match.seconds === 0) {
      state.match.status = "End";
      stopTimer();
    }
    render();
  }, 1000);
}

function toggleTimer() {
  if (state.match.running) {
    stopTimer();
    state.match.status = "Kal-lyeo";
  } else {
    startTimer();
  }
  render();
}

function setTimeoutState() {
  stopTimer();
  state.match.status = "Time out";
  render();
}

function nextRound() {
  if (state.match.round >= state.config.totalRounds) {
    stopTimer();
    state.match.status = "End";
    render();
    return;
  }

  const before = snapshot();
  stopTimer();
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
    summary: "Se invirtieron Chung y Hong.",
    detail: "Switch",
    before,
  });
  render();
}

function resetMatch() {
  stopTimer();
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
  state.config.blueName = els.setupBlueName.value.trim() || "Chung";
  state.config.blueCountry = normalizeCountry(els.setupBlueCountry.value, "PER");
  state.config.redName = els.setupRedName.value.trim() || "Hong";
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
  const rows = state.match.history
    .slice()
    .reverse()
    .map((entry) => ({
      round: entry.round,
      time: entry.displayTime,
      action: entry.summary,
      detail: entry.detail,
      storedAt: entry.at,
    }));
  const blob = new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "taekwondo-match-log.json";
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
      li.innerHTML = `${item.summary}<span>${item.detail}</span>`;
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
      button.innerHTML = `
        <span class="action-icon ${action.type === "hit" ? "hit-icon" : ""}">${action.icon}</span>
        <span><strong>${action.label}</strong><small>${action.detail}</small></span>
        <span class="delta">${action.type === "gamjeom" ? "+1" : action.points ? `+${action.points}` : ""}</span>
      `;
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

function render() {
  updateSetupForm();
  renderBindings();
  renderHistory();
  renderControls();
  saveState();
}

function showView(viewName) {
  document.querySelectorAll("[data-view]").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.view === viewName);
  });
  document.querySelectorAll("[data-view-target]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.viewTarget === viewName);
  });
}

function bindEvents() {
  document.querySelectorAll("[data-view-target]").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.viewTarget));
  });

  els.setupForm.addEventListener("submit", saveSetup);
  els.startPause.addEventListener("click", toggleTimer);
  els.timeout.addEventListener("click", setTimeoutState);
  els.nextRound.addEventListener("click", nextRound);
  els.swapSides.addEventListener("click", swapSides);
  els.undo.addEventListener("click", undoLast);
  els.resetMatch.addEventListener("click", resetMatch);
  els.clearLog.addEventListener("click", clearLog);
  els.exportLog.addEventListener("click", exportLog);
}

if (state.match.seconds <= 0 || state.match.seconds > state.config.roundDuration) {
  state.match.seconds = state.config.roundDuration;
}

renderButtons();
bindEvents();
render();
