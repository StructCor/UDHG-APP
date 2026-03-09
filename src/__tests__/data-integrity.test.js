import { describe, it, expect } from "vitest";
import {
  WC_RATES, WC_SUPPLY, LDF, EMR, CC_LABELS, STATES,
  GL_RATE, UMB_RATE,
} from "../data.js";

describe("STATES list", () => {
  it("contains 42 states", () => {
    expect(STATES.length).toBe(42);
  });

  it("has no duplicates", () => {
    expect(new Set(STATES).size).toBe(STATES.length);
  });

  it("is sorted alphabetically", () => {
    const sorted = [...STATES].sort();
    expect(STATES).toEqual(sorted);
  });
});

describe("WC_RATES consistency", () => {
  it("every state in WC_RATES exists in STATES", () => {
    for (const state of Object.keys(WC_RATES)) {
      expect(STATES).toContain(state);
    }
  });

  it("every class code in WC_RATES has a label in CC_LABELS", () => {
    for (const [state, codes] of Object.entries(WC_RATES)) {
      for (const code of Object.keys(codes)) {
        expect(CC_LABELS).toHaveProperty(String(code));
      }
    }
  });

  it("all rates are positive numbers less than 20", () => {
    for (const [state, codes] of Object.entries(WC_RATES)) {
      for (const [code, rate] of Object.entries(codes)) {
        expect(rate).toBeGreaterThan(0);
        expect(rate).toBeLessThan(20);
      }
    }
  });
});

describe("WC_SUPPLY consistency", () => {
  it("every state in WC_SUPPLY exists in STATES", () => {
    for (const state of Object.keys(WC_SUPPLY)) {
      expect(STATES).toContain(state);
    }
  });

  it("every state in WC_SUPPLY also has install rates in WC_RATES", () => {
    for (const state of Object.keys(WC_SUPPLY)) {
      expect(WC_RATES).toHaveProperty(state);
    }
  });

  it("all supply rates are positive numbers less than 10", () => {
    for (const [state, rate] of Object.entries(WC_SUPPLY)) {
      expect(rate).toBeGreaterThan(0);
      expect(rate).toBeLessThan(10);
    }
  });
});

describe("LDF consistency", () => {
  it("every state in LDF exists in STATES", () => {
    for (const state of Object.keys(LDF)) {
      expect(STATES).toContain(state);
    }
  });

  it("LDF values are between 0 and 1 (0% to 100%)", () => {
    for (const [state, val] of Object.entries(LDF)) {
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(1);
    }
  });

  it("covers all states in STATES", () => {
    for (const state of STATES) {
      expect(LDF).toHaveProperty(state);
    }
  });
});

describe("EMR consistency", () => {
  it("every state in EMR exists in STATES", () => {
    for (const state of Object.keys(EMR)) {
      expect(STATES).toContain(state);
    }
  });

  it("EMR values are positive and within a reasonable range (0.5 to 3.0)", () => {
    for (const [state, val] of Object.entries(EMR)) {
      expect(val).toBeGreaterThanOrEqual(0.5);
      expect(val).toBeLessThanOrEqual(3.0);
    }
  });

  it("covers all states in STATES", () => {
    for (const state of STATES) {
      expect(EMR).toHaveProperty(state);
    }
  });

  // Snapshot notable outliers to catch accidental changes
  it("MA EMR is 1.01 (above-default)", () => {
    expect(EMR.MA).toBe(1.01);
  });

  it("MI EMR is 0.65 (lowest)", () => {
    expect(EMR.MI).toBe(0.65);
  });

  it("NY EMR is 1.87 (highest)", () => {
    expect(EMR.NY).toBe(1.87);
  });

  it("NJ EMR is 1.115", () => {
    expect(EMR.NJ).toBe(1.115);
  });

  it("PA EMR is 1.143", () => {
    expect(EMR.PA).toBe(1.143);
  });
});

describe("CC_LABELS", () => {
  it("has the 8235 supply-only label", () => {
    expect(CC_LABELS[8235]).toBe("Supply Only");
  });

  it("covers all unique class codes across WC_RATES", () => {
    const allCodes = new Set();
    for (const codes of Object.values(WC_RATES)) {
      for (const code of Object.keys(codes)) {
        allCodes.add(String(code));
      }
    }
    for (const code of allCodes) {
      expect(CC_LABELS).toHaveProperty(code);
    }
  });
});

describe("GL and Umbrella rates", () => {
  it("GL_RATE is a positive number", () => {
    expect(GL_RATE).toBeGreaterThan(0);
    expect(GL_RATE).toBe(0.1506);
  });

  it("UMB_RATE is a positive number", () => {
    expect(UMB_RATE).toBeGreaterThan(0);
    expect(UMB_RATE).toBe(0.36691);
  });
});
