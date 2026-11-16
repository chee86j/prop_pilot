# Rehab estimator rates

The estimator uses the following hard-coded modest-quality rates. The unit is square feet except for windows. DIY rates of zero yield no positive-cost breakdown entry; they do not indicate that the work is free. See [tool overview](overview.md) for input defaults, quantity rules, and budget/luxury multipliers.

| Work | Contractor | DIY | Unit |
| --- | ---: | ---: | --- |
| Roof | 10.50 | 6.75 | sq ft |
| Plumbing | 12 | 0 | sq ft |
| Electrical | 8 | 0 | sq ft |
| HVAC | 15 | 0 | sq ft |
| Windows | 75 | 40 | window |
| Interior paint | 4.75 | 2 | sq ft |
| Flooring | 12 | 5.50 | sq ft |
| Kitchen | 125 | 65 | sq ft |
| Bathroom | 450 | 180 | sq ft |
| Siding | 12 | 6 | sq ft |
| Foundation | 18 | 0 | sq ft |
| Landscaping | 8 | 3 | sq ft |

Rates are static values in `RehabEstimator.jsx`, described there as Q1 2025 national averages. They do not update with location or inflation.
