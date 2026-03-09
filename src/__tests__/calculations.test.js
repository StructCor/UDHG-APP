import { describe, it, expect } from "vitest";
import { calcGL, calcUmbrella, calcWC, getAvailableCodes } from "../utils.js";
import { GL_RATE, UMB_RATE, WC_RATES, WC_SUPPLY } from "../data.js";

// ── GL Calculation ───────────────────────────────────────────────────

describe("calcGL", () => {
  it("calculates GL for a typical contract value", () => {
    // 500,000 / 1000 * 0.1506 = 75.3 → rounded to 75
    expect(calcGL(500_000)).toBe(75);
  });

  it("calculates GL for a large contract", () => {
    // 2,850,000 / 1000 * 0.1506 = 429.21 → 429
    expect(calcGL(2_850_000)).toBe(429);
  });

  it("returns 0 for zero contract value", () => {
    expect(calcGL(0)).toBe(0);
  });

  it("returns 0 for very small contract values", () => {
    // 100 / 1000 * 0.1506 = 0.01506 → 0
    expect(calcGL(100)).toBe(0);
  });

  it("uses the correct GL rate constant", () => {
    expect(GL_RATE).toBe(0.1506);
  });
});

// ── Umbrella Calculation ─────────────────────────────────────────────

describe("calcUmbrella", () => {
  it("calculates umbrella for a typical contract value", () => {
    // 500,000 / 1000 * 0.36691 = 183.455 → 183
    expect(calcUmbrella(500_000)).toBe(183);
  });

  it("calculates umbrella for a large contract", () => {
    // 2,850,000 / 1000 * 0.36691 = 1045.6935 → 1046
    expect(calcUmbrella(2_850_000)).toBe(1046);
  });

  it("returns 0 for zero contract value", () => {
    expect(calcUmbrella(0)).toBe(0);
  });

  it("uses the correct umbrella rate constant", () => {
    expect(UMB_RATE).toBe(0.36691);
  });
});

// ── WC Calculation ───────────────────────────────────────────────────

describe("calcWC", () => {
  it("returns hasRates=false when state is empty", () => {
    const result = calcWC("", "5102", 100_000);
    expect(result.hasRates).toBe(false);
    expect(result.wc).toBe(0);
  });

  it("returns hasRates=false for a state with no WC_RATES entry", () => {
    const result = calcWC("CA", "5102", 100_000);
    // CA is in STATES/LDF/EMR but NOT in WC_RATES
    expect(result.hasRates).toBe(false);
    expect(result.wc).toBe(0);
  });

  it("returns hasRates=false for an invalid class code", () => {
    const result = calcWC("NY", "9999", 100_000);
    expect(result.hasRates).toBe(false);
  });

  it("calculates WC for NY (high EMR = 1.87)", () => {
    // NY: baseRate=11.17, EMR=1.87, LDF=0.0832
    // effRate = 11.17 * 1.87 * (1 - 0.0832) = 11.17 * 1.87 * 0.9168
    // = 20.8879 * 0.9168 ≈ 19.1500...
    // wc = (100000 / 100) * effRate = 1000 * 19.15... ≈ 19150
    const result = calcWC("NY", "5102", 100_000);
    expect(result.hasRates).toBe(true);
    expect(result.baseRate).toBe(11.17);
    expect(result.emrVal).toBe(1.87);
    expect(result.ldfVal).toBe(0.0832);
    expect(result.effRate).toBeCloseTo(11.17 * 1.87 * (1 - 0.0832), 4);
    expect(result.wc).toBe(Math.round((100_000 / 100) * result.effRate));
  });

  it("calculates WC for MI (low EMR = 0.65)", () => {
    // MI: baseRate(5102)=2.13, EMR=0.65, LDF=0.0833
    const result = calcWC("MI", "5102", 100_000);
    expect(result.hasRates).toBe(true);
    expect(result.emrVal).toBe(0.65);
    expect(result.effRate).toBeCloseTo(2.13 * 0.65 * (1 - 0.0833), 4);
  });

  it("calculates WC for MI class code 5146 (Furniture Install)", () => {
    const result = calcWC("MI", "5146", 100_000);
    expect(result.hasRates).toBe(true);
    expect(result.baseRate).toBe(2.14);
  });

  it("calculates WC for MA (EMR = 1.01, LDF = 0)", () => {
    // MA: baseRate=4.56, EMR=1.01, LDF=0
    // effRate = 4.56 * 1.01 * 1.0 = 4.6056
    const result = calcWC("MA", "5102", 200_000);
    expect(result.hasRates).toBe(true);
    expect(result.ldfVal).toBe(0);
    expect(result.effRate).toBeCloseTo(4.56 * 1.01, 4);
    expect(result.wc).toBe(Math.round((200_000 / 100) * 4.56 * 1.01));
  });

  it("calculates WC for NJ (class code 5103, EMR = 1.115)", () => {
    const result = calcWC("NJ", "5103", 150_000);
    expect(result.hasRates).toBe(true);
    expect(result.baseRate).toBe(6.28);
    expect(result.emrVal).toBe(1.115);
  });

  it("calculates WC for PA (class code 658, EMR = 1.143)", () => {
    const result = calcWC("PA", "658", 150_000);
    expect(result.hasRates).toBe(true);
    expect(result.baseRate).toBe(6.43);
    expect(result.emrVal).toBe(1.143);
    expect(result.ldfVal).toBe(0.1931);
  });

  it("uses WC_SUPPLY rate for class code 8235", () => {
    // CT supply rate = 3.48
    const result = calcWC("CT", "8235", 50_000);
    expect(result.hasRates).toBe(true);
    expect(result.baseRate).toBe(3.48);
  });

  it("returns hasRates=false for 8235 in a state without supply rates", () => {
    // TX is in WC_RATES but not in WC_SUPPLY
    const result = calcWC("TX", "8235", 50_000);
    expect(result.hasRates).toBe(false);
  });

  it("returns wc=0 when payroll is 0", () => {
    const result = calcWC("FL", "5102", 0);
    expect(result.hasRates).toBe(true);
    expect(result.wc).toBe(0);
  });

  // Exhaustive: test every state/code in WC_RATES produces a valid result
  for (const [state, codes] of Object.entries(WC_RATES)) {
    for (const code of Object.keys(codes)) {
      it(`produces valid WC for ${state}/${code}`, () => {
        const result = calcWC(state, code, 100_000);
        expect(result.hasRates).toBe(true);
        expect(result.wc).toBeGreaterThan(0);
        expect(result.effRate).toBeGreaterThan(0);
        expect(result.baseRate).toBeGreaterThan(0);
      });
    }
  }

  // Test all supply states with 8235
  for (const [state, rate] of Object.entries(WC_SUPPLY)) {
    it(`uses supply rate ${rate} for ${state}/8235`, () => {
      const result = calcWC(state, "8235", 100_000);
      expect(result.hasRates).toBe(true);
      expect(result.baseRate).toBe(rate);
    });
  }
});

// ── getAvailableCodes ────────────────────────────────────────────────

describe("getAvailableCodes", () => {
  it("returns installation codes for a state in WC_RATES", () => {
    const codes = getAvailableCodes("FL");
    expect(codes).toEqual([{ code: "5102", label: "Installation" }]);
  });

  it("returns multiple codes for MI", () => {
    const codes = getAvailableCodes("MI");
    expect(codes.length).toBe(2);
    expect(codes.map((c) => c.code)).toContain("5102");
    expect(codes.map((c) => c.code)).toContain("5146");
  });

  it("includes supply code 8235 for CT", () => {
    const codes = getAvailableCodes("CT");
    expect(codes.map((c) => c.code)).toContain("8235");
    expect(codes.find((c) => c.code === "8235").label).toBe("Supply Only");
  });

  it("does not include 8235 for TX (no supply rate)", () => {
    const codes = getAvailableCodes("TX");
    expect(codes.map((c) => c.code)).not.toContain("8235");
  });

  it("returns empty array for a state not in WC_RATES and not in WC_SUPPLY", () => {
    const codes = getAvailableCodes("CA");
    expect(codes).toEqual([]);
  });

  it("returns empty array for empty state", () => {
    expect(getAvailableCodes("")).toEqual([]);
  });
});
