# Property financial calculations

These describe the current frontend arithmetic, including inconsistencies. They are not normalized accounting periods or financial advice. All five panels receive the property detail object. Amounts are formatted for display using `formatFullCurrency`; the component calculations sum values with JavaScript's `value || 0` fallback. They do not convert monthly figures to annual figures before summing.

## Profit and loss

`ProfitAndLoss.jsx` has rental, sale, and combined strategy sections, all initially collapsed; users can toggle each or all, and invoke browser printing. Its inputs are:

| Group | Property fields included |
| --- | --- |
| Expenses | `purchaseCost`, `refinanceCosts`, `totalRehabCosts`, `utilitiesCost`, `yearlyPropertyTaxes`, `mortgagePaid`, `homeownersInsurance`, `managementFees`, `maintenanceCosts`, `miscFees` |
| Rental income | `expectedYearlyRent`, `rentalIncomeReceived` |
| Sale income | `arvSalePrice` |

Total expenses, rental income, and sale income are sums of their respective groups. Total income is rental plus sale income. Rental profit is rental income minus total expenses; sale profit is sale income minus total expenses; combined profit is total income minus total expenses. Expected rent and rent received are both added, and fields labelled monthly and yearly are summed directly. `totalRehabCosts` is distinct from `totalRehabCost`; changing one does not necessarily populate the other.

## Operating expenses

The panel sums `utilitiesCost`, `homeownersInsurance`, `yearlyPropertyTaxes`, `mortgagePaid`, `managementFees`, `maintenanceCosts`, and `miscFees`. The breakdown starts collapsed, and its header toggles the line items. The total remains visible. Its Print to PDF button calls browser printing; it does not itself generate a PDF file.

## Rental income

The panel adds `expectedYearlyRent`, `rentalIncomeReceived`, and `vacancyLoss`. In particular, the implementation adds vacancy loss as stored, so a positive value increases the displayed total. The details start collapsed and the total remains visible.

## Capital expenditure

The displayed total adds `totalRehabCost`, `equipmentCost`, `constructionCost`, `largeRepairCost`, and `renovationCost`. The property model and detail response use `largeRepairsCost` (with an s); the panel uses `largeRepairCost`, so the model field will not contribute unless the object separately supplies the singular name. Total rehab may itself overlap with the component costs; the UI does not eliminate overlap.

## Rental analysis

The panel organizes values into financial, rental, other, and summary sections, all initially collapsed. Financial fields cover purchase cost, ARV, repairs, loan percentages, mortgage term, points, and fees. Rental fields include rent per unit, unit count, vacancy, tenant stay, and other monthly income. Other fields include utilities, insurance, taxes, mortgage payments, management, maintenance, and miscellaneous fees. Summary displays cash flow, cash ROI, down payment outlay, NOI, 2% and 50% rules, finance amount, and cap rate. It displays values from the object rather than calculating these figures in the component. Some names, including `rentAmount`, `downPaymentCashOutlay`, and `netOperatingIncome`, are not present in the property model's declared columns; missing inputs can therefore appear empty or formatted unexpectedly.

## Export and printing

The enclosing Financial Analysis view renders separate CSV buttons using `profitLossData`, `operatingExpenseData`, `rentalIncomeData`, `capExData`, and the relevant analysis property. These are separate properties of the detail object, rather than the calculated local panel objects. Inspect `exportToCSV` and the actual response before expecting exports to contain the displayed calculations. Each panel also includes its own browser print control.
