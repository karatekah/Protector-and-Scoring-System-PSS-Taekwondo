const scoringActions = [
  {
    id: "punch",
    label: "Puño al tronco",
    detail: "Golpe de puño valido",
    points: 1,
    icon: "PU",
  },
  {
    id: "trunk",
    label: "Patada básica al tronco",
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

const state = {
  blue: { score: 0, gamjeom: 0, hits: 0 },
  red: { score: 0, gamjeom: 0, hits: 0 },
  round: 1,
  seconds: 120,
  running: false,
  status: "Ready",
  history: [],
};

const els = {
  blueScore: document.querySelector("#blueScore"),
  redScore: document.querySelector("#redScore"),
  blueGamjeom: document.querySelector("#blueGamjeom"),
  redGamjeom: document.querySelector("#redGamjeom"),
  roundNumber: document.querySelector("#roundNumber"),
  clock: document.querySelector("#clock"),
  timeState: document.querySelector("#timeState"),
  startPause: document.querySelector("#startPause"),
  timeout: document.querySelector("#timeout"),
  nextRound: document.querySelector("#nextRound"),
  swapSides: document.querySelector("#swapSides"),
  undo: document.querySelector("#undo"),
  resetMatch: document.querySelector("#resetMatch"),
  historyList: document.querySelector("#historyList"),
  leaderLabel: document.querySelector("#leaderLabel"),
  blueName: document.querySelector("#blueName"),
  redName: document.querySelector("#redName"),
  blueFlag: document.querySelector("#blueFlag"),
  redFlag: document.querySelector("#redFlag"),
};

let timerId = null;

function opponentOf(side) {
  return side === "blue" ? "red" : "blue";
}

function sideLabel(side) {
  return side === "blue" ? "Chung" : "Hong";
}

function formatClock(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function snapshot() {
  return JSON.parse(JSON.stringify(state));
}

function restore(previous) {
  state.blue = previous.blue;
  state.red = previous.red;
  state.round = previous.round;
  state.seconds = previous.seconds;
  state.running = false;
  state.status = previous.status;
  state.history = previous.history;
  stopTimer();
  render();
}

function pushHistory(entry) {
  state.history.unshift({
    ...entry,
    time: formatClock(state.seconds),
    round: state.round,
  });
  state.history = state.history.slice(0, 40);
}

function applyAction(side, action) {
  const before = snapshot();
  const rival = opponentOf(side);
  let summary = "";

  if (action.type === "gamjeom") {
    state[side].gamjeom += 1;
    state[rival].score += 1;
    summary = `${sideLabel(side)} recibe Gam-jeom. +1 para ${sideLabel(rival)}.`;
  } else if (action.type === "hit") {
    state[side].hits += 1;
    summary = `${sideLabel(side)} registra Hit.`;
  } else {
    state[side].score += action.points;
    summary = `${sideLabel(side)}: ${action.label} (+${action.points}).`;
  }

  pushHistory({
    summary,
    detail: `R${state.round} ${formatClock(state.seconds)}`,
    before,
  });
  render();
}

function undoLast() {
  const last = state.history[0];
  if (!last) return;
  restore(last.before);
}

function stopTimer() {
  if (timerId) {
    window.clearInterval(timerId);
    timerId = null;
  }
  state.running = false;
}

function startTimer() {
  if (timerId) return;
  state.running = true;
  state.status = "Fight";
  timerId = window.setInterval(() => {
    state.seconds = Math.max(0, state.seconds - 1);
    if (state.seconds === 0) {
      state.status = "End";
      stopTimer();
    }
    render();
  }, 1000);
}

function toggleTimer() {
  if (state.running) {
    stopTimer();
    state.status = "Kal-lyeo";
  } else if (state.seconds > 0) {
    startTimer();
  }
  render();
}

function setTimeoutState() {
  stopTimer();
  state.status = "Time out";
  render();
}

function nextRound() {
  const before = snapshot();
  state.round += 1;
  state.seconds = 120;
  state.status = "Ready";
  stopTimer();
  pushHistory({
    summary: `Inicia round ${state.round}.`,
    detail: "Cambio de ronda",
    before,
  });
  render();
}

function swapSides() {
  const before = snapshot();
  const blueCopy = { ...state.blue };
  state.blue = { ...state.red };
  state.red = blueCopy;
  [els.blueName.value, els.redName.value] = [els.redName.value, els.blueName.value];
  [els.blueFlag.value, els.redFlag.value] = [els.redFlag.value, els.blueFlag.value];
  pushHistory({
    summary: "Se invirtieron Chung y Hong.",
    detail: "Switch",
    before,
  });
  render();
}

function resetMatch() {
  stopTimer();
  state.blue = { score: 0, gamjeom: 0, hits: 0 };
  state.red = { score: 0, gamjeom: 0, hits: 0 };
  state.round = 1;
  state.seconds = 120;
  state.status = "Ready";
  state.history = [];
  render();
}

function renderButtons() {
  document.querySelectorAll(".score-buttons").forEach((container) => {
    const side = container.dataset.side;
    container.innerHTML = "";
    scoringActions.forEach((action) => {
      const button = document.createElement("button");
      button.className = "score-action";
      button.type = "button";
      button.dataset.action = action.id;
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

function renderHistory() {
  els.historyList.innerHTML = "";
  state.history.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.summary}<span>${item.detail}</span>`;
    els.historyList.appendChild(li);
  });
}

function renderLeader() {
  const blue = state.blue.score;
  const red = state.red.score;
  if (blue === red) {
    els.leaderLabel.textContent = "Empate";
  } else {
    els.leaderLabel.textContent = blue > red ? "Ventaja Chung" : "Ventaja Hong";
  }
}

function render() {
  els.blueScore.value = state.blue.score;
  els.redScore.value = state.red.score;
  els.blueGamjeom.value = state.blue.gamjeom;
  els.redGamjeom.value = state.red.gamjeom;
  els.roundNumber.value = state.round;
  els.clock.value = formatClock(state.seconds);
  els.timeState.textContent = state.status;
  els.startPause.textContent = state.running ? "Kal-lyeo" : "Shijak";
  els.undo.disabled = state.history.length === 0;
  renderLeader();
  renderHistory();
}

els.startPause.addEventListener("click", toggleTimer);
els.timeout.addEventListener("click", setTimeoutState);
els.nextRound.addEventListener("click", nextRound);
els.swapSides.addEventListener("click", swapSides);
els.undo.addEventListener("click", undoLast);
els.resetMatch.addEventListener("click", resetMatch);

renderButtons();
render();
