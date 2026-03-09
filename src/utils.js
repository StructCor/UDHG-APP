// Utility functions extracted from udhg-index-html.html

import { WC_RATES, WC_SUPPLY, LDF, EMR, GL_RATE, UMB_RATE } from "./data.js";

/** Parse a user-entered currency string into a number. Returns 0 for invalid input. */
export const parseNum = (s) =>
  parseFloat((s || "").toString().replace(/,/g, "")) || 0;

/** Format a number as a rounded dollar string, e.g. "$1,234". Returns "$0" for NaN. */
export const fmtMoney = (n) =>
  isNaN(n) ? "$0" : "$" + Math.round(n).toLocaleString();

/** Format a live input string: strip non-numeric chars (except "."), add thousands commas. */
export const fmtInput = (s) => {
  const p = s.replace(/[^0-9.]/g, "").split(".");
  p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return p.join(".");
};

/** Return a hex color for a compliance score: green ≥80, amber ≥60, red <60. */
export const compColor = (s) =>
  s >= 80 ? "#27ae60" : s >= 60 ? "#f39c12" : "#dc3545";

/**
 * Calculate GL deduction from contract value.
 * Formula: Math.round((contractVal / 1000) * GL_RATE)
 */
export function calcGL(contractVal) {
  return Math.round((contractVal / 1000) * GL_RATE);
}

/**
 * Calculate Umbrella/Excess deduction from contract value.
 * Formula: Math.round((contractVal / 1000) * UMB_RATE)
 */
export function calcUmbrella(contractVal) {
  return Math.round((contractVal / 1000) * UMB_RATE);
}

/**
 * Calculate Workers' Compensation deduction for self-performed work.
 *
 * @param {string} state - Two-letter state code
 * @param {string|number} classCode - WC class code (e.g. "5102", "8235")
 * @param {number} payrollVal - Estimated payroll dollar amount
 * @returns {{ wc: number, baseRate: number|null, emrVal: number|null, ldfVal: number|null, effRate: number|null, hasRates: boolean }}
 */
export function calcWC(state, classCode, payrollVal) {
  const result = { wc: 0, baseRate: null, emrVal: null, ldfVal: null, effRate: null, hasRates: false };

  if (!state) return result;

  const installCodes = WC_RATES[state] || {};
  const supplyRate = WC_SUPPLY[state] || null;
  const cc = String(classCode);

  const baseRate = cc === "8235" ? supplyRate : (installCodes[cc] || null);
  if (baseRate === null) return result;

  const ldfVal = LDF[state] || 0;
  const emrVal = EMR[state] || 1;
  const effRate = baseRate * emrVal * (1 - ldfVal);
  const wc = Math.round((payrollVal / 100) * effRate);

  return { wc, baseRate, emrVal, ldfVal, effRate, hasRates: true };
}

/**
 * Get the list of available class codes for a given state.
 * Includes installation codes from WC_RATES and supply code (8235) if applicable.
 */
export function getAvailableCodes(state) {
  const installCodes = WC_RATES[state] || {};
  const supplyRate = WC_SUPPLY[state] || null;
  return [
    ...Object.keys(installCodes).map((k) => ({ code: k, label: "Installation" })),
    ...(supplyRate ? [{ code: "8235", label: "Supply Only" }] : []),
  ];
}
