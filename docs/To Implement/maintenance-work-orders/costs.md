# Costs and financial views

The proposal records repair estimates and actual costs with each work order. It does not process payments, create invoices, or automatically change the existing property financial fields.

## Individual amounts

`estimatedCost` is the owner's anticipated total; `actualCost` is the final or currently known total entered by the owner. Both are optional nonnegative USD amounts with up to two decimal places. Use decimal database arithmetic and decimal strings in the API. Null is unknown or not entered; `0.00` is a recorded amount of zero. Never substitute the estimate for a missing actual cost.

The form should allow either value to be entered independently, changed later, or cleared. A completed work order may still have no actual cost. Show “Not recorded” for null and format a recorded zero as `$0.00`. These values are estimates and user-entered records; recording a cost does not prove it was paid.

## Property summary

Show a maintenance cost summary alongside a link to the included work orders. The initial summary is **completed work with known actual costs**, across all dates, for the selected property. Include orders whose current status is `completed`; include migrated completed orders even if their completion date is unknown. Exclude open, scheduled, in-progress, and cancelled orders, and exclude null actual amounts from the sum.

Display:

- Sum of known actual costs for included completed work orders.
- Count of included completed work orders with a known actual cost, including a recorded zero.
- Count of completed work orders with no recorded actual cost.
- An explicit **All dates** label and a link or filter that opens the underlying completed records.

Example: three completed orders have actual costs `100.00`, `0.00`, and null. Show `$100.00`, two with recorded costs, and one missing a cost. A cancelled order with `50.00` does not contribute while cancelled. Reopening a completed order removes it from the completed summary until it is completed again; the recorded amount remains on the work order.

## Date-filtered summaries

Offer an optional completion date range. Start and end are inclusive calendar dates in the requested IANA time zone. Compare the `completedAt` UTC timestamp converted to that zone against the range. A migrated completed order with no `completedAt` is excluded from a date-filtered total, and the UI shows the number of completed orders with an unknown completion date so the omission is visible. An all-dates summary includes it.

Expose `GET /api/work-orders/summary?propertyId=<id>&from=<YYYY-MM-DD>&to=<YYYY-MM-DD>&tz=<IANA zone>`; `propertyId` is required and must be owned. Both dates are optional; if supplied, validate the format and reject a start later than the end. Return decimal string `actualTotal`, integer `recordedCostCount`, `missingCostCount`, and `unknownCompletionDateCount`, plus the applied dates and time zone. For an all-dates request, `unknownCompletionDateCount` reports the number included with no completion timestamp. For a date-filtered request it reports the number excluded for that reason, irrespective of whether their cost is known. Counts and totals derive from the full filtered dataset, not a paginated page.

The work order drill-down for a date-filtered summary must use the same status, completion-date, and time-zone rules. Add equivalent completion-range filters to the list endpoint before offering a clickable filtered total; otherwise provide a clearly labelled unfiltered list and avoid implying an exact match.

## Relationship to the existing financial view

The existing property model has a manually entered `maintenanceCosts` field, used by the operating expense and profit-and-loss components. The field may already include repairs that an owner later records as work orders. The first release therefore shows the completed work order total as a separate, labelled figure; it does not write back to `maintenanceCosts` or add the two values in a total. The financial view can link to the work order summary, showing the date range and missing-cost count, without changing its existing calculations.

If a later release replaces the manual field or combines entries, it needs an explicit reconciliation workflow, date-period definitions, a migration, and a way to prevent double counting. It should also account for the existing panels' mixed time periods described in [current financial calculations](../../features/financials/calculations.md).
