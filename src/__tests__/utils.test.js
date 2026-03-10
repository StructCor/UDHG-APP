import { describe, it, expect } from "vitest";
import { parseNum, fmtMoney, fmtInput, compColor } from "../utils.js";

// ── parseNum ─────────────────────────────────────────────────────────

describe("parseNum", () => {
  it("parses a plain integer string", () => {
    expect(parseNum("500000")).toBe(500000);
  });

  it("parses a string with commas", () => {
    expect(parseNum("1,234,567")).toBe(1234567);
  });

  it("parses a decimal string with commas", () => {
    expect(parseNum("1,234,567.89")).toBe(1234567.89);
  });

  it("returns 0 for empty string", () => {
    expect(parseNum("")).toBe(0);
  });

  it("returns 0 for undefined", () => {
    expect(parseNum(undefined)).toBe(0);
  });

  it("returns 0 for null", () => {
    expect(parseNum(null)).toBe(0);
  });

  it('returns 0 for "0"', () => {
    expect(parseNum("0")).toBe(0);
  });

  it("returns 0 for non-numeric string", () => {
    expect(parseNum("abc")).toBe(0);
  });

  it("parses a number passed as a number type", () => {
    expect(parseNum(42)).toBe(42);
  });

  it("parses a string with leading/trailing spaces (via parseFloat behavior)", () => {
    expect(parseNum("  500  ")).toBe(500);
  });
});

// ── fmtMoney ─────────────────────────────────────────────────────────

describe("fmtMoney", () => {
  it("formats a typical dollar amount", () => {
    expect(fmtMoney(1234)).toBe("$1,234");
  });

  it("formats zero", () => {
    expect(fmtMoney(0)).toBe("$0");
  });

  it("rounds to nearest dollar", () => {
    expect(fmtMoney(99.6)).toBe("$100");
    expect(fmtMoney(99.4)).toBe("$99");
  });

  it('returns "$0" for NaN', () => {
    expect(fmtMoney(NaN)).toBe("$0");
  });

  it("formats negative numbers (dollar sign before minus)", () => {
    // The implementation prepends "$" before toLocaleString, so negative = "$-500"
    expect(fmtMoney(-500)).toBe("$-500");
  });

  it("formats large numbers with commas", () => {
    expect(fmtMoney(1000000)).toBe("$1,000,000");
  });
});

// ── fmtInput ─────────────────────────────────────────────────────────

describe("fmtInput", () => {
  it("adds commas to a large number", () => {
    expect(fmtInput("1234567")).toBe("1,234,567");
  });

  it("preserves decimals", () => {
    expect(fmtInput("1234.56")).toBe("1,234.56");
  });

  it("strips non-numeric characters", () => {
    expect(fmtInput("$1,234")).toBe("1,234");
  });

  it("strips letters", () => {
    expect(fmtInput("abc123")).toBe("123");
  });

  it("returns empty for empty string", () => {
    expect(fmtInput("")).toBe("");
  });

  it("handles a single digit", () => {
    expect(fmtInput("5")).toBe("5");
  });

  it("handles multiple decimal points (keeps all parts)", () => {
    // "1.2.3" → strip non-numeric except "." → "1.2.3" → split on "." → ["1","2","3"]
    // join → "1.2.3" — only first segment gets comma formatting
    const result = fmtInput("1.2.3");
    expect(result).toBe("1.2.3");
  });

  it("handles input that already has commas (re-formats correctly)", () => {
    // "1,000,000" → strip non-numeric/dot → "1000000" → add commas → "1,000,000"
    expect(fmtInput("1,000,000")).toBe("1,000,000");
  });
});

// ── compColor ────────────────────────────────────────────────────────

describe("compColor", () => {
  it("returns green for 100", () => {
    expect(compColor(100)).toBe("#27ae60");
  });

  it("returns green for exactly 80", () => {
    expect(compColor(80)).toBe("#27ae60");
  });

  it("returns amber for 79", () => {
    expect(compColor(79)).toBe("#f39c12");
  });

  it("returns amber for exactly 60", () => {
    expect(compColor(60)).toBe("#f39c12");
  });

  it("returns red for 59", () => {
    expect(compColor(59)).toBe("#dc3545");
  });

  it("returns red for 0", () => {
    expect(compColor(0)).toBe("#dc3545");
  });

  it("returns green for values above 100", () => {
    expect(compColor(150)).toBe("#27ae60");
  });
});
