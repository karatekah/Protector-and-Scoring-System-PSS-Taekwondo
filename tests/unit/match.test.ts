import { describe, expect, it } from "vitest";
import {
  applyAction,
  archive,
  createState,
  formatClock,
  freeConfig,
  matchResult,
  migrateLegacy,
  parseFreeConfig,
  parseState,
  remainingTime,
  resultLabel,
  undo,
} from "../../src/match";

describe("manual training match", () => {
  it("adds points, awards a penalty to the rival and undoes without rewinding time", () => {
    const state = createState();
    applyAction(state, "blue", { type: "points", points: 4 });
    applyAction(state, "red", { type: "gamjeom" });
    expect(state.match.blue.score).toBe(5);
    expect(state.match.red.gamjeom).toBe(1);
    state.match.remainingMs = 100_000;
    expect(undo(state)).toBe(true);
    expect(state.match.blue.score).toBe(4);
    expect(state.match.red.gamjeom).toBe(0);
    expect(state.match.remainingMs).toBe(100_000);
    expect(state.match.running).toBe(false);
    expect(state.match.red.score).toBe(0);
  });
  it("keeps history flat and bounded after many actions and archives", () => {
    const state = createState();
    for (let i = 0; i < 200; i++)
      applyAction(state, "blue", { type: "points", points: 1 });
    expect(state.history).toHaveLength(120);
    expect(JSON.stringify(state).length).toBeLessThan(100_000);
    for (let i = 0; i < 10; i++) expect(archive(state)).toBe(true);
    const saved = structuredClone(state.savedMatches);
    expect(archive(state)).toBe(false);
    expect(state.savedMatches).toEqual(saved);
    expect(state.savedMatches).toHaveLength(10);
    expect(state.savedMatches[0].history[0]).not.toHaveProperty("before");
    expect(parseState(JSON.parse(JSON.stringify(state)))).toEqual(state);
  });
  it("keeps older custom formats, impacts and 80 summaries readable without trimming them", () => {
    const state = createState();
    state.config.roundDuration = 90;
    state.config.totalRounds = 5;
    state.match.blue.hits = 4;
    archive(state);
    const saved = state.savedMatches[0];
    state.savedMatches = Array.from({ length: 80 }, (_, i) => ({
      ...saved,
      id: String(i),
    }));
    const imported = parseState(JSON.parse(JSON.stringify(state)));
    expect(imported).toEqual(state);
    expect(archive(imported)).toBe(false);
    expect(imported.savedMatches).toHaveLength(80);
    expect(freeConfig(imported.config)).toMatchObject({
      roundDuration: 120,
      totalRounds: 3,
    });
    expect(imported.config.roundDuration).toBe(90);
  });
  it("only accepts Free presets for new matches", () => {
    const { config } = createState();
    for (const totalRounds of [1, 3]) {
      for (const roundDuration of [60, 120, 180])
        expect(
          parseFreeConfig({ ...config, totalRounds, roundDuration }),
        ).toMatchObject({ totalRounds, roundDuration });
    }
    for (const roundDuration of [0, 10, 90, 599, NaN])
      expect(() => parseFreeConfig({ ...config, roundDuration })).toThrow();
    for (const totalRounds of [0, 2, 4, 5])
      expect(() => parseFreeConfig({ ...config, totalRounds })).toThrow();
  });
  it("reports the accumulated winner or a draw only after the last round, including corrections", () => {
    const state = createState();
    state.match.blue.score = 8;
    state.match.red.score = 5;
    expect(matchResult(state)).toBeNull();
    state.match.remainingMs = 0;
    state.match.status = "ended";
    expect(matchResult(state)).toBeNull();
    state.match.round = 3;
    expect(matchResult(state)).toBe("blue");
    expect(resultLabel(state)).toBe("Ganador: Azul");
    applyAction(state, "red", { type: "points", points: 3 });
    expect(matchResult(state)).toBe("draw");
    expect(undo(state)).toBe(true);
    expect(matchResult(state)).toBe("blue");
    applyAction(state, "red", { type: "points", points: 4 });
    expect(matchResult(state)).toBe("red");
    expect(resultLabel(state)).toBe("Ganador: Rojo");
    state.match.remainingMs = 1;
    expect(matchResult(state)).toBeNull();
    state.match.remainingMs = 0;
    state.match.round = 1;
    state.config.totalRounds = 1;
    expect(matchResult(state)).toBe("red");
    archive(state);
    expect(resultLabel(parseState(state).savedMatches[0])).toBe(
      "Ganador: Rojo",
    );
  });
  it("uses elapsed monotonic time after delayed callbacks", () => {
    expect(remainingTime(120_000, 500, 10_500)).toBe(110_000);
    expect(remainingTime(120_000, 500, 200_500)).toBe(0);
    expect(formatClock(119_001)).toBe("02:00");
    expect(formatClock(0)).toBe("00:00");
  });
  it("rejects invalid backups and preserves supported legacy scores", () => {
    const state = createState();
    expect(() => parseState({ ...state, schemaVersion: 9 })).toThrow();
    expect(() =>
      parseState({ ...state, match: { ...state.match, remainingMs: -1 } }),
    ).toThrow();
    expect(() =>
      applyAction(state, "blue", { type: "points", points: NaN }),
    ).toThrow();
    const migrated = migrateLegacy({
      config: state.config,
      match: {
        ...state.match,
        blue: { score: 9, gamjeom: 1, hits: 2 },
        seconds: 37,
      },
    });
    expect(migrated.match.blue.score).toBe(9);
    expect(migrated.match.remainingMs).toBe(37_000);
    expect(migrated.match.running).toBe(false);
    expect(migrated.history).toEqual([]);
  });
});
