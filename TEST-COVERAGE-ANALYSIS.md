# Test Coverage Analysis: UDHG Risk Management Portal

## Current State: Zero Test Coverage

This codebase has **no tests, no test framework, and no `package.json`**. The entire application lives in a single 513-line HTML file (`udhg-index-html.html`) with inline React/JSX and a small service worker (`sw.js`). The CI workflow (`azure-webapps-node.yml`) references `npm run test --if-present`, but there is no testing infrastructure to execute.

---

## Recommended Test Strategy

To add tests, the first step would be to **extract the JavaScript/business logic into separate `.js` files** and set up a minimal toolchain (`package.json` + a test runner like Vitest or Jest with jsdom).

---

## Priority 1 — Critical Business Logic (Insurance Calculations)

These are pure functions dealing with money. Bugs here have direct financial consequences.

| Function / Logic | Location | Why It Matters |
|---|---|---|
| WC calculation (`effRate = baseRate * emrVal * (1 - ldfVal)`) | Lines 152-155 | Core insurance math — incorrect rates = incorrect deductions on real contracts |
| GL calculation (`(contractVal/1000) * GL_RATE`) | Line 149 | Applied to every project |
| Umbrella calculation (`(contractVal/1000) * UMB_RATE`) | Line 150 | Applied to every project |
| `parseNum()` | Line 62 | Parses user currency input; edge cases could silently produce `0` |
| `fmtMoney()` | Line 63 | Displayed in emails and UI — NaN handling matters |
| `fmtInput()` | Line 64 | Formats live input; regex-based, easy to break |
| Savings calculation in Tracker (`cvv * 0.038`) | Line 385 | Financial estimate shown to users |

### Suggested Tests

- WC rates for every state/class-code combination in `WC_RATES`
- EMR and LDF applied correctly per state (especially edge cases: MA has EMR=1.01, NY has EMR=1.87, MI has EMR=0.65)
- States with no WC rates (`noRates` flag) are handled correctly
- Supply-only class code (8235) uses `WC_SUPPLY` rates, not `WC_RATES`
- `parseNum` edge cases: `""`, `"0"`, `"1,234,567.89"`, `undefined`, `null`, non-numeric strings
- `fmtMoney` with `NaN`, negative numbers, zero, very large numbers
- `fmtInput` preserving decimal points, handling multiple decimals, handling non-numeric characters

---

## Priority 2 — Form Validation

| Logic | Location | Why It Matters |
|---|---|---|
| BondRequest `validate()` | Line 321 | Gates whether an email gets generated |
| Conditional validation (bid date for bid bonds, otherType for "other") | Line 321 | Business rules embedded in code |
| `addProgram` validation (`!n.name \|\| !n.cv`) | Line 385 | Prevents adding empty programs |

### Suggested Tests

- All 8 required fields trigger errors when empty
- Bid bond requires `bidDate`; other bond type requires `otherType`
- Valid form passes validation with zero errors
- Partial form shows exactly the missing fields

---

## Priority 3 — Email Generation

| Logic | Location | Why It Matters |
|---|---|---|
| `buildMailto()` in Calculator | Lines 159-208 | Full calculation breakdown sent to customers |
| Bond request email body in `generate()` | Line 322 | Formal bond request emails to surety |

### Suggested Tests

- Mailto URI is properly encoded (special characters in project names)
- All three scope types produce correct WC line content (`none`, `self`, `subcontracted`)
- Rate breakdown in email body matches the calculated values
- Bond request includes urgency prefix for rush/urgent
- Bond request includes conditional fields (bid date, maintenance period, branch)

---

## Priority 4 — Data Integrity

| Data | Location | Why It Matters |
|---|---|---|
| `WC_RATES` | Line 28 | Hardcoded rate table — typos cause silent miscalculations |
| `LDF` lookup | Line 30 | Some states have 0 discount (MA, ME) |
| `EMR` lookup | Line 31 | NY=1.87 is an outlier — worth a snapshot test |
| `STATES` list | Line 52 | Should contain exactly the states that appear in rate tables |
| `CC_LABELS` | Line 32 | Must match all class codes used in `WC_RATES` |

### Suggested Tests

- Every state in `WC_RATES` exists in `STATES`
- Every state in `LDF` and `EMR` exists in `STATES`
- All class codes in `WC_RATES` have a label in `CC_LABELS`
- Rate values are within reasonable bounds (no negative rates, no rates > 20)

---

## Priority 5 — Component Rendering and Interactions

| Component | Why It Matters |
|---|---|
| Lock | Password gate — verify correct/incorrect password behavior |
| Calculator | State selection updates class codes; scope shows/hides fields |
| BondRequest | Form/preview toggle; conditional field visibility |
| Tracker | Add/delete programs; alert logic; stats aggregation |
| `compColor()` | Color thresholds (80+, 60-79, <60) |

### Suggested Tests

- `compColor` returns correct colors at boundaries: 59, 60, 79, 80, 100, 0
- Lock denies wrong password, accepts correct one
- Calculator: selecting a state with no WC rates shows the warning
- Tracker: alerts filter for compliance <60 OR due within 7 days
- Tracker: average compliance and total savings aggregations are correct

---

## Recommended Setup to Enable Testing

1. **Create `package.json`** with Vitest (lightweight, no config needed for JS)
2. **Extract functions** (`parseNum`, `fmtMoney`, `fmtInput`, `compColor`, calculation logic) into a `utils.js` module
3. **Extract data constants** (`WC_RATES`, `LDF`, `EMR`, etc.) into a `data.js` module
4. **Write unit tests** for Priorities 1-4 (pure logic, no DOM needed)
5. **Optionally** add `@testing-library/react` for Priority 5 component tests

This approach keeps the existing single-file architecture intact for production while enabling a proper test suite alongside it.
