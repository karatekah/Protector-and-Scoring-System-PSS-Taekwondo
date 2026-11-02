import { describe, expect, it } from "vitest";
import {
  applyAction,
  archive,
  createState,
  formatClock,
  migrateLegacy,
  parseState,
  remainingTime,
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
    applyAction(state, "red", { type: "hit" });
    expect(state.match.red.hits).toBe(1);
    expect(state.match.red.score).toBe(0);
  });
  it("keeps history flat and bounded after many actions and archives", () => {
    const state = createState();
    for (let i = 0; i < 200; i++)
      applyAction(state, "blue", { type: "points", points: 1 });
    expect(state.history).toHaveLength(120);
    expect(JSON.stringify(state).length).toBeLessThan(100_000);
    for (let i = 0; i < 85; i++) archive(state);
    expect(state.savedMatches).toHaveLength(80);
    expect(state.savedMatches[0].history[0]).not.toHaveProperty("before");
    expect(parseState(JSON.parse(JSON.stringify(state)))).toEqual(state);
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
