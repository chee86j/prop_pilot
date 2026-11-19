# Maintenance and work orders

**Status: Partially implemented.** The existing maintenance API checks property ownership and tenant management. The model fields and a preserving migration have been added, but the configured database has an unresolved migration-history mismatch. The screens, new work order API, and photo storage are not yet implemented. See the [migration runbook](migration-runbook.md) before upgrading an existing database.

## Purpose

Help an owner record a property issue, coordinate its repair, and find the work and costs later. The owner can start from an individual property or review work across their portfolio. An order may be associated with a tenant, but the feature must work for vacant properties and issues found by the owner.

Example: an owner creates “Fix kitchen leak,” marks it high priority, adds a plumber and target date, uploads a photo, and enters an estimate. They move it from open to scheduled, then in progress and completed, and record the actual cost. The completed order remains in the property's history.

## Documents

1. [Screens and interactions](screens.md): navigation, lists, forms, states, and accessibility.
2. [Workflow and rules](workflow.md): statuses, dates, priorities, and example scenarios.
3. [Data model and migration](data-and-migration.md): fields, relationships, legacy records, and rollout.
4. [Proposed API](api.md): routes, payloads, validation, errors, and concurrency.
5. [Ownership and access](access.md): identity, authorization rules, and existing gaps.
6. [Costs and financial views](costs.md): amounts, totals, periods, and avoiding duplicate accounting.
7. [Photos and storage](attachments.md): upload and download behavior, lifecycle, and failure handling.
8. [Implementation and acceptance](implementation.md): delivery order, verification scenarios, and future extensions.
9. [Migration runbook](migration-runbook.md): database prerequisites, the missing historical revisions, and safe upgrade steps.

These files use a single proposed design to make the feature reviewable. Names, limits, and contracts are design decisions for implementation, not a description of a deployed API. If a decision changes, update the affected documents together.

## Current starting point

`PropertyMaintenanceRequest` includes the planned work order fields and makes `tenantId` nullable at the model level. Its existing API has list, read, create, update, and delete routes under `/api/property-maintenance-requests`. The legacy create route still requires a tenant and exposes its existing fields. These routes require a JWT, scope records to the property owner, and check that newly assigned tenants are managed by that owner. The legacy API presents stored `open` and `scheduled` statuses as `pending`. There is no dedicated maintenance route in the frontend router.

The migration must be applied to an existing database before the updated model can be used. Legacy create and tenant reassignment now require an owner-managed tenant with a lease for the selected property; historical leases qualify. The proposed new API and work order UI still need implementation. See [existing maintenance documentation](../../features/operations/overview.md) and the [current endpoint inventory](../../reference/api/maintenance.md).

## First release boundary

The first release is owner-operated: property and portfolio lists, work order details and editing, status changes, contractor contact fields, optional photos, and a transparent cost summary. A tenant portal, online vendor coordination, automated reminders, recurring schedules, and a contractor directory are future work. The ability to record an urgent item does not itself provide emergency dispatch or notifications.
