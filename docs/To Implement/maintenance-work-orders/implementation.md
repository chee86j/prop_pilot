# Implementation plan and acceptance criteria

The sections below describe work required to deliver the proposed feature. They are not a record of completed implementation.

## Suggested delivery order

### 1. Establish the backend foundation

- Inspect existing maintenance data and registered Flask routes, including duplicate blueprint registration, before changing endpoint behavior.
- Add the model fields, optional tenant, indexes, and attachment metadata. Create and review an Alembic migration that preserves existing records and handles unknown statuses explicitly.
- Scope existing maintenance routes by property ownership. Limit update fields and validate changes. Apply the compatibility and legacy DELETE rules in [data and migration](data-and-migration.md).
- Implement the new list, create, detail, and update endpoints with validation, ownership checks, UTC timestamps, version checks, and status behavior. Provide the cost summary and the completion-date list filters together.

### 2. Build the owner interface

- Add the property Maintenance section, the portfolio route and navigation entry, and a direct detail route.
- Implement create, edit, status, filter, pagination, and retry states. Use server responses as the persisted source of truth and preserve unsaved inputs on errors.
- Add the separate work order cost summary and financial-view link without changing the existing manual financial calculations.

### 3. Add private photos

- Configure private storage and the attachment metadata model, implement upload and content endpoints, and provide reliable cleanup.
- Add per-file progress, error, retry, viewing, and removal controls. Check authorization on every metadata and content request.
- Make property deletion explicitly account for work orders and attachments before exposing the feature.

These stages can be developed separately, but the feature should be described as complete only when the first-release capabilities and checks below are satisfied.

## Functional acceptance scenarios

| Scenario | Expected result |
| --- | --- |
| Create from a property | Property is preselected; a title is required; an order can be saved with no tenant, date, contractor, cost, or photo. |
| Create from portfolio | The owner selects one of their properties; the new order appears in both the property and portfolio views. |
| Edit and refresh | Valid changes are saved, returned by the API, and still present after reload. A blank amount stays distinct from a zero amount. |
| Validation failure | Invalid values produce field-level feedback; no partial work order update is stored and entered text remains available. |
| Stale editor | A second save using an old version receives a conflict; it does not overwrite the newer save and the user can review current data. |
| Filter and paginate | Property, status, priority, due state, and page controls work together; total counts represent all matches, not just the loaded page. |
| Due date boundary | Yesterday is overdue, today is upcoming, and the eighth day ahead is future, using the requested time zone. Completed and cancelled orders are neither overdue nor upcoming. |
| Cancel and reopen | Cancelled work leaves the default unfinished list but remains in history; reopening returns it to open and clears the completion timestamp if present. |
| Photo | A valid photo is uploaded, viewed, and removed; oversized, malformed, unsupported, or excessive files receive useful errors without losing other edits. |
| Cost summary | Known completed actual costs add correctly; missing costs and unknown completion dates are counted as described in [costs](costs.md). The manual property field is not silently added. |
| Property deletion | The owner receives a clear permanent-deletion warning. On confirmation, related order metadata is deleted with the property and private photo cleanup is scheduled; a database failure leaves the records intact. |

## Access and isolation acceptance scenarios

Use two owners with separate properties, tenants, orders, and photos. Each owner's unfiltered list and summaries contain only their own records. Requests using the other owner's property, order, or attachment IDs return generic unavailable responses and cannot create, read, edit, upload, download, or delete data. Check that a mismatched attachment and order ID is rejected. Verify missing and expired credentials, unrelated tenants, and legacy routes, particularly the unfiltered list and DELETE.

## Migration and compatibility acceptance scenarios

- Migrate representative `pending`, `in_progress`, `completed`, and `cancelled` records. Verify IDs, property and tenant links, descriptions, durations, and original timestamps survive.
- Confirm `pending` becomes `open`, existing completed records retain an unknown completion timestamp, and unexpected statuses stop for explicit resolution rather than being silently discarded.
- Verify a legacy client sees its expected fields and `pending` representation; a legacy update increments the new version and does not accidentally demote a scheduled order when it sends the legacy pending value.
- Verify legacy DELETE remains an explicit permanent-deletion exception, is owner-scoped, and cleans up attachment records and blobs. Plan client migration before removing this endpoint.
- Exercise backup and recovery of both database records and private photo storage, and rehearse a non-destructive rollback strategy on representative data.

## Reliability and usability checks

Test empty portfolios, no matching filters, invalid query parameters, a property with many pages of orders, network failures, failed photo storage, retryable cleanup, and changes made in two browser sessions. Check keyboard navigation, focus, text labels, responsive layouts, and error announcements. Confirm that no user-facing control suggests an urgent label sends a notification or dispatches a contractor.

## Later extensions

The design leaves room for tenant accounts and request submission, a contractor directory and vendor updates, reminders, recurring preventive maintenance, and links to invoices, draws, or receipts. Each addition needs its own permissions, data model, and workflow; none is included in the first-release acceptance criteria.
