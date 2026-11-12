export type Side = "blue" | "red";
export type Status = "ready" | "running" | "paused" | "timeout" | "ended";
export interface Config {
  eventName: string;
  totalRounds: number;
  roundDuration: number;
  blueName: string;
  blueCountry: string;
  redName: string;
  redCountry: string;
}
export interface Fighter {
  score: number;
  gamjeom: number;
  hits: number;
}
export interface Match {
  blue: Fighter;
  red: Fighter;
  round: number;
  remainingMs: number;
  running: boolean;
  status: Status;
  koWinner?: Side;
}
export interface Snapshot {
  config: Config;
  match: Match;
}
export interface Entry {
  id: string;
  at: string;
  summary: string;
  round: number;
  clock: string;
  before?: Snapshot;
}
export interface SavedMatch extends Snapshot {
  id: string;
  savedAt: string;
  history: Omit<Entry, "before">[];
}
export interface State extends Snapshot {
  schemaVersion: 5;
  history: Entry[];
  savedMatches: SavedMatch[];
}
export type Action =
  | { type: "points"; points: number }
  | { type: "gamjeom" }
  | { type: "deduct" }
  | { type: "ko" };
export const HISTORY_LIMIT = 120;
export const FREE_DURATIONS: readonly number[] = [60, 120, 180];
export const FREE_ROUNDS: readonly number[] = [1, 3];
export const FREE_ARCHIVE_LIMIT = 10;
// Older backups remain readable without truncating their saved matches.
export const ARCHIVE_LIMIT = 80;
export const defaultConfig: Config = {
  eventName: "Sesión de entrenamiento",
  totalRounds: 3,
  roundDuration: 120,
  blueName: "Azul",
  blueCountry: "USA",
  redName: "Rojo",
  redCountry: "USA",
};

export function createState(): State {
  return {
    schemaVersion: 5,
    config: { ...defaultConfig },
    match: freshMatch(120),
    history: [],
    savedMatches: [],
  };
}
export function freshMatch(seconds: number): Match {
  return {
    blue: { score: 0, gamjeom: 0, hits: 0 },
    red: { score: 0, gamjeom: 0, hits: 0 },
    round: 1,
    remainingMs: seconds * 1000,
    running: false,
    status: "ready",
  };
}
export function snapshot(state: Snapshot): Snapshot {
  return structuredClone({ config: state.config, match: state.match });
}
export function formatClock(ms: number): string {
  const seconds = Math.ceil(Math.max(0, ms) / 1000);
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}
export function record(state: State, summary: string, before?: Snapshot): void {
  state.history.unshift({
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    summary,
    round: state.match.round,
    clock: formatClock(state.match.remainingMs),
    ...(before ? { before } : {}),
  });
  state.history.length = Math.min(state.history.length, HISTORY_LIMIT);
}
export function applyAction(state: State, side: Side, action: Action): void {
  if (state.match.koWinner)
    throw new Error("Deshaz el KO antes de modificar la puntuación.");
  if (
    action.type === "points" &&
    (!Number.isInteger(action.points) || action.points < 1 || action.points > 6)
  ) {
    throw new Error("Puntuación fuera del rango de entrenamiento.");
  }
  if (action.type === "deduct" && state.match[side].score === 0) return;
  const before = snapshot(state);
  const name = state.config[side === "blue" ? "blueName" : "redName"];
  if (action.type === "ko") {
    state.match.koWinner = side;
    state.match.running = false;
    state.match.status = "ended";
    record(state, `${name}: ganador por KO. Combate finalizado.`, before);
  } else if (action.type === "deduct") {
    state.match[side].score -= 1;
    record(state, `${name}: −1 punto. Corrección manual.`, before);
  } else if (action.type === "gamjeom") {
    const opponent = side === "blue" ? "red" : "blue";
    state.match[side].gamjeom += 1;
    state.match[opponent].score += 1;
    record(
      state,
      `${name}: Gam-jeom. +1 para ${opponent === "blue" ? "azul" : "rojo"}.`,
      before,
    );
  } else {
    state.match[side].score += action.points;
    record(
      state,
      `${name}: +${action.points} ${action.points === 1 ? "punto" : "puntos"}.`,
      before,
    );
  }
}
export function undo(state: State): boolean {
  const entry = state.history[0];
  if (!entry?.before) return false;
  const currentTime = state.match.remainingMs;
  const previous = structuredClone(entry.before);
  state.config = previous.config;
  state.match = previous.match;
  // Undoing a score must not restore time elapsed since that score.
  state.match.remainingMs = Math.min(currentTime, state.match.remainingMs);
  state.match.running = false;
  state.match.status =
    state.match.koWinner || state.match.remainingMs === 0 ? "ended" : "paused";
  state.history.shift();
  return true;
}
export function remainingTime(
  startMs: number,
  startedAt: number,
  now: number,
): number {
  return Math.max(0, startMs - Math.max(0, now - startedAt));
}
export function matchResult(state: Snapshot): Side | "draw" | null {
  const { match, config } = state;
  if (match.koWinner) return match.koWinner;
  if (
    match.round !== config.totalRounds ||
    match.remainingMs !== 0 ||
    match.running ||
    match.status !== "ended"
  )
    return null;
  return match.blue.score === match.red.score
    ? "draw"
    : match.blue.score > match.red.score
      ? "blue"
      : "red";
}
export function resultLabel(state: Snapshot): string {
  const result = matchResult(state);
  return result === null
    ? "Combate sin finalizar"
    : result === "draw"
      ? "Empate en puntos"
      : `Ganador${state.match.koWinner ? " por KO" : ""}: ${state.config[result === "blue" ? "blueName" : "redName"]}`;
}
export function freeConfig(config: Config): Config {
  return {
    ...config,
    roundDuration: FREE_DURATIONS.includes(config.roundDuration)
      ? config.roundDuration
      : defaultConfig.roundDuration,
    totalRounds: FREE_ROUNDS.includes(config.totalRounds)
      ? config.totalRounds
      : defaultConfig.totalRounds,
  };
}
export function parseFreeConfig(input: unknown): Config {
  const config = parseConfig(input);
  if (
    !FREE_DURATIONS.includes(config.roundDuration) ||
    !FREE_ROUNDS.includes(config.totalRounds)
  )
    throw new Error("Free permite 1 o 3 rondas de 1, 2 o 3 minutos.");
  return config;
}
export function archive(state: State): boolean {
  if (state.savedMatches.length >= FREE_ARCHIVE_LIMIT) return false;
  state.savedMatches.unshift({
    ...snapshot(state),
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
    history: state.history.map(({ before: _before, ...entry }) => entry),
  });
  return true;
}

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Archivo inválido.");
  return value as Record<string, unknown>;
}
function integer(value: unknown, min: number, max: number): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    !Number.isInteger(value) ||
    value < min ||
    value > max
  ) {
    throw new Error("Valor numérico inválido.");
  }
  return value;
}
function text(value: unknown, max: number): string {
  if (typeof value !== "string" || value.length > max)
    throw new Error("Texto inválido.");
  return value;
}
function parseConfig(input: unknown): Config {
  const c = object(input);
  return {
    eventName: text(c.eventName, 120),
    totalRounds: integer(c.totalRounds, 1, 5),
    roundDuration: integer(c.roundDuration, 10, 599),
    blueName: text(c.blueName, 80),
    blueCountry: text(c.blueCountry, 3),
    redName: text(c.redName, 80),
    redCountry: text(c.redCountry, 3),
  };
}
function parseFighter(value: unknown): Fighter {
  const f = object(value);
  return {
    score: integer(f.score, 0, 1_000_000),
    gamjeom: integer(f.gamjeom, 0, 1_000_000),
    hits: integer(f.hits, 0, 1_000_000),
  };
}
function parseSnapshot(input: unknown, legacy = false): Snapshot {
  const s = object(input),
    config = parseConfig(s.config),
    m = object(s.match);
  const statuses: Status[] = ["ready", "running", "paused", "timeout", "ended"];
  if (
    !legacy &&
    (!statuses.includes(m.status as Status) || typeof m.running !== "boolean")
  )
    throw new Error("Estado inválido.");
  if (
    !legacy &&
    m.koWinner !== undefined &&
    ((m.koWinner !== "blue" && m.koWinner !== "red") ||
      m.running !== false ||
      m.status !== "ended")
  )
    throw new Error("Resultado por KO inválido.");
  return {
    config,
    match: {
      blue: parseFighter(m.blue),
      red: parseFighter(m.red),
      round: integer(m.round, 1, config.totalRounds),
      remainingMs: legacy
        ? integer(m.seconds, 0, 599) * 1000
        : integer(m.remainingMs, 0, 599_000),
      running: !legacy && m.running === true,
      status: legacy ? "paused" : (m.status as Status),
      ...(!legacy && m.koWinner !== undefined
        ? { koWinner: m.koWinner as Side }
        : {}),
    },
  };
}
function parseEntry(value: unknown, withUndo: boolean): Entry {
  const e = object(value);
  return {
    id: text(e.id, 100),
    at: text(e.at, 40),
    summary: text(e.summary, 300),
    round: integer(e.round, 1, 5),
    clock: text(e.clock, 10),
    ...(withUndo && e.before ? { before: parseSnapshot(e.before) } : {}),
  };
}
export function parseState(input: unknown): State {
  const s = object(input);
  if (s.schemaVersion !== 4 && s.schemaVersion !== 5)
    throw new Error("Versión de archivo no compatible.");
  if (
    !Array.isArray(s.history) ||
    !Array.isArray(s.savedMatches) ||
    s.history.length > HISTORY_LIMIT ||
    s.savedMatches.length > ARCHIVE_LIMIT
  ) {
    throw new Error("Historial inválido.");
  }
  return {
    schemaVersion: 5,
    ...parseSnapshot(s),
    history: s.history.map((e) => parseEntry(e, true)),
    savedMatches: s.savedMatches.map((value) => {
      const m = object(value);
      if (!Array.isArray(m.history) || m.history.length > HISTORY_LIMIT)
        throw new Error("Archivo inválido.");
      return {
        ...parseSnapshot(m),
        id: text(m.id, 100),
        savedAt: text(m.savedAt, 40),
        history: m.history.map((e) => parseEntry(e, false)),
      };
    }),
  };
}
export function migrateLegacy(input: unknown): State {
  const source = object(input),
    current = parseSnapshot(source, true);
  const savedMatches: SavedMatch[] = [];
  if (Array.isArray(source.savedMatches)) {
    for (const value of source.savedMatches.slice(0, ARCHIVE_LIMIT)) {
      try {
        const m = object(value),
          b = object(m.blue),
          r = object(m.red);
        const config = {
          eventName: m.eventName,
          totalRounds: m.totalRounds,
          roundDuration: m.roundDuration,
          blueName: b.name,
          blueCountry: b.country,
          redName: r.name,
          redCountry: r.country,
        };
        const result = parseSnapshot(
          {
            config,
            match: { blue: b, red: r, round: m.currentRound, seconds: 0 },
          },
          true,
        );
        savedMatches.push({
          ...result,
          id: text(m.id, 100),
          savedAt: text(m.savedAt, 40),
          history: [],
        });
      } catch {
        /* A damaged legacy archive must not discard the active match. */
      }
    }
  }
  return { schemaVersion: 5, ...current, history: [], savedMatches };
}
