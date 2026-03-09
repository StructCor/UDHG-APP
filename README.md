# StructCor Insurance Cost Calculator
### Free OCIP / CCIP Bid Deduction Tool for Contractors

**Built by StructCor Risk Solutions**
info@structcor.com

---

## What This Is

If you are a contractor bidding on a project that has a wrap-up insurance program (OCIP or CCIP), the project owner or GC is providing the insurance for the job. That means you need to deduct the cost of insurance from your bid, otherwise you are pricing in coverage you are not actually paying for, and you will either lose the bid or leave money on the table.

This tool calculates that deduction for you. Enter your rates from your own insurance policy, fill in the project details, and it gives you the WC, GL, and Umbrella numbers to pull out of your bid. It also emails you the full breakdown with every calculation step shown, so there is never a question about where a number came from.

It is free. No account. No data stored. Works on your phone.

---

## How to Install on Your Phone

This is a Progressive Web App (PWA), which means it installs like an app directly from your browser. No App Store needed.

1. Open [structcor.github.io/insurance-calculator](https://structcor.github.io/insurance-calculator) on your phone
2. iPhone: Tap the Share button, scroll down, tap Add to Home Screen, tap Add
3. Android: Tap the three dots, tap Add to Home Screen, tap Install
4. The app icon appears on your home screen and works fully offline after that

---

## How to Set It Up

Before you run a calculation, you need to enter your rates from your own insurance policy. Tap My Rates in the bottom navigation.

### What you need and where to find it

GL Rate (General Liability): Open your GL policy. Go to the declarations page or the rating worksheet. Look for a line that says something like "Rate per $1,000 of receipts" or "Rate per $1,000 of contract value." That number goes here. If you cannot find it, call your broker and ask: "What is our GL composite rate per $1,000 of contract value for wrap-up deduction purposes?"

Umbrella Rate: Same idea, but from your Umbrella or Excess Liability policy. Your broker's coverage summary will usually list it separately from GL. If your umbrella is rated differently, ask your broker which rate to use for OCIP/CCIP bid deductions.

EMR (Experience Modification Rate): This is on your Workers' Compensation policy declarations page near the top. It is labeled "Experience Modification Factor" or just "Mod." A number like 0.95 means your loss history is better than average. Above 1.0 means higher than average losses. If you have not been in business long enough to have an EMR assigned, leave it at 1.0.

Large Deductible Factor (LDF): Only applies if you have a large deductible workers' compensation program, typically a $100K to $500K per-claim deductible. If you do, the factor is on your WC policy rating pages labeled "Large Deductible Adjustment Factor" or "Deductible Credit." If you do not have a large deductible program, enter 0.

WC Rates by State: Go to the Schedule of Operations section of your WC policy. It lists each state you are covered in, the class codes, and the rate per $100 of payroll. Enter the base rate shown on the policy. The calculator applies your EMR and LDF automatically on top.

---

## How the Calculation Works

The calculator uses three standard wrap-up deduction components:

General Liability:
`(Contract Value / 1,000) x GL Rate = GL Deduction`

Umbrella / Excess:
`(Contract Value / 1,000) x Umbrella Rate = Umbrella Deduction`

Workers' Compensation (self-performed on-site labor only):
`(Payroll / 100) x Base WC Rate x EMR x (1 - LDF) = WC Deduction`

Total Deduction = WC + GL + Umbrella

The emailed output shows every step so your PM, the GC, or the wrap administrator can verify the math without calling anyone.

---

## Labor Scope Options

### Excluded Work

Select this if your work is considered excluded under the OCIP/CCIP manual. This typically applies to material suppliers, delivery only contractors, and other scopes that the program sponsor has determined do not carry on-site installation exposure. In most cases the program sponsor will still want you to enroll, but you will only need to provide GL coverage. The calculator runs a GL only deduction when this option is selected.

### Self-Performed On-Site Labor

Select this if your own employees are performing on-site labor on the project. The calculator will use your payroll, WC class code, and state rate to compute the WC deduction on top of GL and Umbrella. Choose the class code that matches the type of work being performed. If your company has multiple class codes for the project scope, you can add additional class codes in the calculator and it will factor all of them into the deduction.

### Subcontracted

Select this if you are subcontracting work to another company. Your WC deduction is $0 for their portion because the subcontractor carries their own insurance and is responsible for their own wrap enrollment. However, the program sponsor or wrap administrator needs to be notified of every subcontractor working under your contract. If you have not already provided that notification, you need to do so before work begins.

When this option is selected, the calculator will prompt you for the subcontractor's information and generate a template email to the wrap enrollment team. The email will state that you are subcontracting work to the named subcontractor and provide their details so the administrator can issue a separate enrollment request to them.

---

## Disclaimer

This tool is for bid estimation purposes only. The deduction amounts it produces are estimates based on rates you enter. Always confirm the final ICW deduction with your wrap administrator or licensed broker before submitting an enrollment form. StructCor Risk Solutions is not responsible for errors resulting from incorrect rate inputs.

---

## About StructCor

StructCor Risk Solutions provides risk management consulting for construction and building materials companies, including OCIP/CCIP program management, workers' compensation oversight, claims strategy, and custom risk tooling.

info@structcor.com
[structcor.github.io](https://structcor.github.io)

---

*© 2026 StructCor Risk Solutions. Free to use and share.*
