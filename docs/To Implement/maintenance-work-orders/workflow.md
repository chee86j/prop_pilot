# Workflow and business rules

This is the proposed behavior for the first owner-operated release. It defines how the screens and API should interpret a work order.

## Statuses

| Stored value | Label | Meaning |
| --- | --- | --- |
| `open` | Open | Work has been recorded and is not yet completed or cancelled. |
| `scheduled` | Scheduled | The owner has arranged or planned work. A contractor and target date are useful but not required. |
| `in_progress` | In progress | Work is underway. |
| `completed` | Completed | The owner considers the work finished. |
| `cancelled` | Cancelled | The owner is no longer pursuing this order. |

An order starts `open` unless an existing legacy record is being migrated. The typical progression is open → scheduled → in progress → completed, but real work can move directly between any two valid statuses. The server validates that the destination is a supported value; no contractor, date, photo, or actual cost is required to complete an order. Cancelling preserves the record. Reopening a completed or cancelled order sets its status to `open`.

When entering `completed` from another state, set `completedAt` to the current UTC timestamp. When leaving `completed`, clear `completedAt`; completing it again records a new completion timestamp. A no-op status update does not change `completedAt`. `updatedAt` reflects the latest successful work order edit. Full status history is outside the first release, so a reopening replaces the previous completion timestamp.

## Priority

Priority is `low`, `normal`, `high`, or `urgent`, defaulting to `normal`. Priority is a label set by the owner; it does not automatically change status, contact a contractor, or send a notification. The UI must not imply that marking work urgent triggers emergency response.

## Dates and due state

`targetDate` is an optional calendar date encoded as `YYYY-MM-DD`; it has no time of day. A target date of today is due today, not overdue. For an unfinished order, a date before today is overdue; today through seven days ahead is upcoming. A later date is future. Completed and cancelled orders have no overdue or upcoming badge, even if their stored target date is in the past. An order with no target date has no due state.

The portfolio request sends the browser's IANA time zone as `tz`; the server uses it to determine today's calendar date for due-state filters and returns the `asOfDate` used. If the browser cannot provide a supported zone, use `UTC` and make that fallback visible near the filter. Times are stored in UTC; display timestamps in the browser's local time. A target date remains the same calendar date regardless of time zone.

## Tenant and property association

Every order belongs to one property for its lifetime. The tenant is optional, allowing owner-identified work and repairs before a tenant moves in. When a tenant is selected or changed, require a tenant managed by the owner and a lease linking that tenant and property; a historical lease is sufficient because work can relate to a prior tenancy. Removing the tenant leaves the work order intact. For migrated records whose association does not satisfy this rule, preserve and display the existing link; require correction only when the tenant association is changed.

## Examples

- **Vacant property:** create an order with no tenant, enter the contractor later, and schedule work when a date is known.
- **No cost yet:** leave actual cost blank on completion. It is an unknown amount, not a recorded zero, and is excluded from actual-cost sums while counted as missing.
- **Rescheduled repair:** edit the target date; the due state is recomputed using the new date and current status.
- **Reopened repair:** set a completed order back to open; its completion timestamp clears, its old target date may make it overdue, and the owner can edit the date.
- **Cancelled appointment:** cancel the order to keep the record without showing it among unfinished work. Reopen it if work resumes.

## Actions intentionally deferred

This release does not invite tenants, send contractor assignments, trigger alerts, schedule appointments with external calendars, or automatically book an expense in the existing financial fields. Those can be designed separately after the core work order data is reliable.
