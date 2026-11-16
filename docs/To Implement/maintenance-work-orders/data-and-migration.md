# Data model and migration

This is a proposed schema and migration, not the current database structure. The current model is `backend/models/maintenance.py`; the existing database migrations are under `backend/migrations/versions/`.

## Work order record

Extend the existing maintenance record and preserve its primary key so existing references remain meaningful. Keep the current database table and existing column names unless a migration explicitly changes them. API names below describe the new contract; a serializer may map them to existing model attributes.

| API field | Suggested storage | Rules |
| --- | --- | --- |
| `id` | Existing integer primary key | Server assigned and immutable. |
| `propertyId` | Existing required foreign key | Must reference a property owned by the authenticated user; immutable after creation. |
| `tenantId` | Existing foreign key, changed to nullable | Optional; new or changed associations must satisfy the rule in [workflow](workflow.md). |
| `title` | `String(160)`, non-null | Trim whitespace; 1–160 characters. |
| `description` | Existing non-null text | Optional in the new form; store an empty string when absent. Maximum 10,000 characters after trimming. |
| `status` | Existing string | One of `open`, `scheduled`, `in_progress`, `completed`, `cancelled`; default `open`. |
| `priority` | `String(16)`, non-null | `low`, `normal`, `high`, or `urgent`; default `normal`. |
| `contractorName` | Nullable `String(160)` | Optional free text, trimmed; blank becomes null. |
| `contractorContact` | Nullable `String(255)` | Optional free text for phone or email, trimmed; blank becomes null. A structured contractor directory is deferred. |
| `targetDate` | Nullable SQL date | Calendar date only. |
| `estimatedCost`, `actualCost` | Nullable `Numeric(12, 2)` | Nonnegative USD amounts; null means unknown. API uses decimal strings. |
| `notes` | Nullable text | Optional, at most 10,000 characters; blank becomes null. |
| `timeToCompletion` | Existing nullable integer | Preserve existing duration in hours; a nonnegative integer when set. Do not treat it as a deadline. |
| `createdAt`, `updatedAt` | Existing timestamps | Return UTC ISO 8601 timestamps. Preserve existing creation values during migration. |
| `completedAt` | Nullable timestamp | Set and cleared on transitions as specified in [workflow](workflow.md). |
| `version` | Integer, non-null | Start at 1; increment on each successful work order edit, including changes through legacy endpoints. Used for optimistic concurrency. |

Treat the stored amounts as USD and return them as strings such as `"125.50"` to preserve decimal precision. There is no currency conversion in this release. Use database constraints for nonnegative amounts and valid statuses where compatible with migration; validate at the API boundary as well.

## Attachments

Create a separate attachment record with an ID, `workOrderId`, generated storage key, original display name, detected media type, byte size, and UTC upload timestamp. The storage key is internal and must not be returned to clients. Each attachment belongs to exactly one order. See [attachments](attachments.md) for limits, deletion, and storage lifecycle.

## Relationships and lifetime

Ownership derives from `work order → property → owner_id`; do not trust a client-supplied owner ID. The property association is mandatory. A tenant is optional and does not acquire access to the record by being linked. Contractor details are plain fields on the order, not user accounts or assignments that contact a vendor.

The existing property delete route attempts to delete a property; its behavior with related records depends on relationships and database constraints. Before enabling this feature, implement a deliberate property deletion policy. Proposed first release: the property deletion confirmation warns that its work orders, history, and photos will also be permanently deleted. Once the owner confirms, delete the property and its work order and attachment metadata in a transaction, and schedule the private photo blobs for retryable cleanup. If another relationship prevents property deletion, leave the property and work orders intact and show the failure. The feature does not expose a new hard-delete action for individual orders. Existing legacy DELETE behavior and its migration implications are described below.

## Migration sequence

1. Inventory existing statuses and tenant/property links. Back up the database and confirm how deployment applies Alembic migrations. The existing timestamps may be stored without a time zone: establish their original database time zone and conversion policy before interpreting them as UTC, and preserve the original instants rather than assuming all historical values were UTC.
2. Add new fields as nullable or with safe defaults before enforcing required constraints. Make `tenantId` nullable. Create the attachment table and indexes for `propertyId`, status, and target date based on the actual query plan.
3. Backfill each existing record with title `Maintenance request #<id>`, priority `normal`, and version `1`. Preserve its description, tenant, property, duration, ID, and existing timestamps. Do not infer historic costs, due dates, contractor, notes, photos, or completion date.
4. Map `pending` to `open`; preserve `in_progress`, `completed`, and `cancelled`. Add support for `scheduled`. Preserve `completedAt` as null for migrated completed orders because the actual completion time is unknown. Before applying a status constraint, report any unexpected existing status and explicitly resolve it; do not silently rewrite it or discard the row.
5. Enforce non-null/default and allowed-value constraints only after backfill. Verify counts and that every ID, property association, and tenant association is retained. Do not retroactively reject or alter a historical tenant/property pairing that fails the new eligibility rule.
6. Deploy the owner-scoped API and UI with compatibility handling. Validate migration on a copy containing representative old records. A downgrade must not silently drop photos, costs, newly created statuses, or other data; document a backup/export procedure and require an explicit decision before destructive rollback.

## Compatibility with existing endpoints

Keep `/api/property-maintenance-requests` during the transition, but add owner scoping to every operation. Legacy GET responses retain their existing shape. Translate `open` to legacy `pending`; represent `scheduled` as legacy `pending` for display. A legacy update that sends `pending` for an already scheduled order must leave it scheduled, because the legacy representation cannot distinguish the two. Other supported legacy status changes map to the corresponding new state and apply completion rules.

Legacy create continues accepting its existing required fields, creates a fallback title, defaults priority and version, and maps `pending` to `open`. Legacy updates remain last-write-wins because old clients do not supply a version; every successful legacy update increments `version` so an already-open new editor receives a conflict rather than overwriting it. Restrict legacy writable fields to the old contract and validate them, rather than assigning arbitrary model attributes.

Legacy DELETE is a compatibility exception: if retained, it remains an owner-authorized permanent deletion and must also remove attachment metadata and schedule private blobs for cleanup. Completed history can therefore still be deleted by a legacy client. Announce this behavior and retire the endpoint only after clients have moved; the new UI and new API use cancellation instead of hard deletion. Restricting previously unscoped data to the rightful owner is an intentional compatibility and security change.
