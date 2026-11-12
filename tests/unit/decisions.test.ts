import { describe, expect, it } from "vitest";
import {
  applyAction,
  archive,
  createState,
  matchResult,
  parseState,
  resultLabel,
  undo,
} from "../../src/match";

describe("manual corrections and KO", () => {
  it("deducts only the selected score, preserves a zero floor and can undo without restoring time", () => {
    const state = createState();
    applyAction(state, "blue", { type: "deduct" });
    expect(state.history).toHaveLength(0);
    applyAction(state, "blue", { type: "points", points: 2 });
    applyAction(state, "red", { type: "points", points: 5 });
    applyAction(state, "blue", { type: "deduct" });
    expect(state.match.blue.score).toBe(1);
    expect(state.match.red.score).toBe(5);
    expect(state.match.blue.gamjeom).toBe(0);
    state.match.remainingMs = 85_000;
    expect(undo(state)).toBe(true);
    expect(state.match.blue.score).toBe(2);
    expect(state.match.remainingMs).toBe(85_000);
    for (let i = 0; i < 4; i++) applyAction(state, "blue", { type: "deduct" });
    expect(state.match.blue.score).toBe(0);
    expect(state.history.filter((e) => e.summary.includes("−1"))).toHaveLength(
      2,
    );
  });

  it("closes on KO regardless of points and round, freezes time, preserves JSON and reopens on undo", () => {
    for (const side of ["blue", "red"] as const) {
      const state = createState();
      const rival = side === "blue" ? "red" : "blue";
      state.match[rival].score = 12;
      state.match.running = true;
      state.match.status = "running";
      state.match.remainingMs = 85_000;
      applyAction(state, side, { type: "ko" });
      expect(state.match).toMatchObject({
        koWinner: side,
        running: false,
        status: "ended",
        round: 1,
        remainingMs: 85_000,
      });
      expect(matchResult(state)).toBe(side);
      expect(resultLabel(state)).toBe(
        `Ganador por KO: ${side === "blue" ? "Azul" : "Rojo"}`,
      );
      for (const action of [
        { type: "points", points: 1 },
        { type: "deduct" },
        { type: "gamjeom" },
        { type: "ko" },
      ] as const)
        expect(() => applyAction(state, rival, action)).toThrow();
      archive(state);
      const restored = parseState(JSON.parse(JSON.stringify(state)));
      expect(restored).toEqual(state);
      expect(matchResult(restored.savedMatches[0])).toBe(side);
      expect(undo(restored)).toBe(true);
      expect(restored.match.koWinner).toBeUndefined();
      expect(restored.match.running).toBe(false);
      expect(restored.match.status).toBe("paused");
      expect(restored.match.remainingMs).toBe(85_000);
      expect(matchResult(restored)).toBeNull();
    }
  });

  it("upgrades v4 backups and rejects invalid KO decisions at every snapshot boundary", () => {
    const state = createState();
    expect(parseState({ ...state, schemaVersion: 4 })).toEqual(state);
    expect(state.schemaVersion).toBe(5);
    applyAction(state, "blue", { type: "ko" });
    for (const koWinner of [null, "green", 0, {}, true])
      expect(() =>
        parseState({ ...state, match: { ...state.match, koWinner } }),
      ).toThrow();
    for (const change of [{ running: true }, { status: "paused" }])
      expect(() =>
        parseState({ ...state, match: { ...state.match, ...change } }),
      ).toThrow();
    archive(state);
    const invalid = structuredClone(state);
    (
      invalid.savedMatches[0].match as unknown as Record<string, unknown>
    ).koWinner = "green";
    expect(() => parseState(invalid)).toThrow();
    const invalidUndo = structuredClone(state);
    Object.assign(invalidUndo.history[0].before!.match, { koWinner: "green" });
    expect(() => parseState(invalidUndo)).toThrow();
  });
});
