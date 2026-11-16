# Tools and public pages

## Calculators

The frontend contains a debt service coverage ratio (DSCR) calculator, an amortization calculator, and a rehab estimator. The window renderer connects these components to the application's tool windows. These are calculation interfaces, separate from the stored property and construction records.

## Public pages

The router includes home, about, testimonials, contact, FAQ, and lender pages. The home page includes a property gallery and testimonials. The FAQ includes information about the phase tracker.

## Application experience

The app uses a navigation bar, responsive layouts, loading and error fallbacks, and toast notifications. A service worker and offline page are included; service worker registration depends on the environment in `frontend/src/main.jsx`.

**Source:** `frontend/src/utils/windowRenderer.jsx`, `frontend/src/components/RealEstateTools/`, `frontend/src/App.jsx`, public page components, and `frontend/public/`.

## Calculator behavior

The calculators are implemented in `frontend/src/components/RealEstateTools/` and can be displayed in an app window or an external window through `windowRenderer.jsx`. They maintain their inputs in component state. Closing or reloading a calculator should not be treated as saving its inputs to a property.

- **DSCR:** presents a calculation interface for comparing rental income and debt service. Consult `DSCRCalculator.jsx` for inputs and the exact calculation.
- **Amortization:** presents a loan repayment calculation interface; the implementation in `AmortizationCalculator.jsx` defines its assumptions and schedule.
- **Rehab estimator:** accepts property size, window count, kitchen size, bathroom count and bathroom size. Users choose work categories and DIY or contractor pricing. Categories include roof, plumbing, electrical, HVAC, windows, paint, flooring, kitchen, bathroom, siding, foundation, and landscaping. The component multiplies each selected category's hard-coded rate by a quantity, totals the results, and presents budget and luxury estimates at 75% and 140% of the base estimate. The component labels its rates as Q1 2025 national averages; these are estimates and are not live quotes.

## Routes and supporting components

| Browser route | Page |
| --- | --- |
| `/` | Redirects to `/home`. |
| `/home` | Landing page with gallery and testimonials. |
| `/about`, `/testimonials`, `/contact`, `/faq`, `/lender` | Informational pages. |
| `/authform`, `/profile` | Sign in, registration, and account profile. |
| `/propertylist`, `/addproperty`, `/property/:propertyId` | Property management. |
| `/constructiondraw/:propertyId`, `/receipts/:drawId` | Construction draw and receipt views. |

The app loads most pages lazily, shows a loading fallback while they load, and uses error boundaries for failures. `frontend/src/main.jsx` controls service worker registration; `frontend/public/service-worker.js` contains the caching behavior and `offline.html` provides an offline fallback. These mechanisms do not guarantee that every feature works offline.

## Calculation specification

### DSCR

Inputs begin blank: monthly rent, property taxes, insurance, maintenance, utilities, management fees, monthly mortgage, and other debt. Inputs are parsed as numbers; empty or invalid values contribute zero. The Calculate action computes:

```text
annual income = monthly rent × 12
annual operating expenses = (property taxes + insurance + maintenance + utilities + management fees) × 12
annual NOI = annual income - annual operating expenses
annual debt service = (monthly mortgage + other debt) × 12
DSCR = annual NOI / annual debt service, if debt service > 0; otherwise 0
```

The result includes annual and monthly NOI and debt service, with values formatted to two decimal places. All listed expense and debt inputs are treated as monthly by this formula. Income and Expenses & Debt tabs organize inputs. The result is calculated on demand rather than persisted.

### Amortization

Default inputs are principal $300,000, annual interest 6.5%, term 30 years, extra monthly payment $0, and the current date as an ISO date derived from JavaScript's UTC clock. The result recalculates when inputs change. A principal, annual rate, or term at or below zero clears the schedule and summary; in particular, the current implementation does not produce a zero-interest schedule.

For positive inputs, monthly rate `r = annual rate / 100 / 12`, number of periods `n = years × 12`, and the regular monthly payment is `principal × r × (1+r)^n / ((1+r)^n - 1)`. For each period, interest is opening balance times `r`, principal is payment minus interest, and the balance is reduced by principal. The payment date begins on the supplied start date and advances using JavaScript's `setMonth`. Balances below one cent are set to zero.

The extra-payment schedule adds up to the configured extra amount without exceeding the remaining balance after the regular principal portion. The component compares total interest and number of periods with the regular schedule to show interest saved and months shaved off, and presents a payoff date. The schedule can be downloaded as CSV with payment number, date, amount, principal, interest, extra payment, and balance. The regular payment portion is not capped on the last extra-payment row, which can overstate that row's payment.

### Rehab estimator

Defaults are 1,500 square feet, 10 windows, 150 square feet of kitchen, two bathrooms of 50 square feet each, contractor pricing, and no work categories selected. Windows use window count as quantity; kitchens use kitchen size; bathrooms use bathroom size times count; all other categories use property size. Each selected category multiplies its quantity by the corresponding hard-coded DIY or contractor rate in `RehabEstimator.jsx`. The base total is the sum. Budget and luxury figures multiply that total by 0.75 and 1.4 respectively. Calculations update as inputs and selections change; the Summary tab presents the breakdown and range.
