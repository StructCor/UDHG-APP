// Rate tables and constants extracted from udhg-index-html.html
// These are the source-of-truth values used by the Calculator component.

export const WC_RATES = {
  AZ: { 5102: 3.31 },
  CO: { 5102: 3.29 },
  CT: { 5102: 4.61 },
  FL: { 5102: 5.33 },
  ME: { 5102: 2.78 },
  MA: { 5102: 4.56 },
  MD: { 5102: 4.09 },
  MI: { 5102: 2.13, 5146: 2.14 },
  NJ: { 5103: 6.28 },
  NY: { 5102: 11.17 },
  PA: { 658: 6.43 },
  RI: { 5102: 3.54 },
  TN: { 5102: 2.58, 5146: 1.91 },
  TX: { 5102: 2.15 },
};

export const WC_SUPPLY = { CT: 3.48, MA: 2.76, ME: 3.04, RI: 3.82 };

export const LDF = {
  AL: 0.0706, AR: 0.2214, AZ: 0.2737, CA: 0.0832, CO: 0.0549,
  CT: 0.0832, FL: 0.2124, GA: 0.054, HI: 0.202, IA: 0.2561,
  ID: 0.0549, IL: 0.0521, IN: 0.0548, KS: 0.0545, KY: 0.0832,
  LA: 0.0506, MA: 0, MD: 0.0548, ME: 0, MI: 0.0833, MN: 0.2094,
  MO: 0.0832, MS: 0.0835, MT: 0.0832, NC: 0.2541, NE: 0.1386,
  NH: 0.0831, NJ: 0.0829, NM: 0.0832, NV: 0.0548, NY: 0.0832,
  OK: 0.0832, OR: 0.1658, PA: 0.1931, RI: 0.0548, SC: 0.0832,
  SD: 0.0832, TN: 0.0832, TX: 0.08, UT: 0.0548, VA: 0.0832,
  WV: 0.052,
};

export const EMR = {
  AL: 0.95, AR: 0.95, AZ: 0.95, CA: 0.95, CO: 0.95, CT: 0.95,
  FL: 0.95, GA: 0.95, HI: 0.95, IA: 0.95, ID: 0.95, IL: 0.95,
  IN: 0.95, KS: 0.95, KY: 0.95, LA: 0.95, MA: 1.01, MD: 0.95,
  ME: 0.95, MI: 0.65, MN: 0.95, MO: 0.95, MS: 0.95, MT: 0.95,
  NC: 0.95, NE: 0.95, NH: 0.95, NJ: 1.115, NM: 0.95, NV: 0.95,
  NY: 1.87, OK: 0.95, OR: 0.95, PA: 1.143, RI: 0.95, SC: 0.95,
  SD: 0.95, TN: 0.95, TX: 0.95, UT: 0.95, VA: 0.95, WV: 0.95,
};

export const CC_LABELS = {
  5102: "Installation",
  5103: "Installation",
  5146: "Furniture Install",
  658: "Metal Erection Install",
  8235: "Supply Only",
};

export const GL_RATE = 0.1506;
export const UMB_RATE = 0.36691;

export const STATES = [
  "AL", "AR", "AZ", "CA", "CO", "CT", "FL", "GA", "HI", "IA",
  "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI",
  "MN", "MO", "MS", "MT", "NC", "NE", "NH", "NJ", "NM", "NV",
  "NY", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT",
  "VA", "WV",
];
