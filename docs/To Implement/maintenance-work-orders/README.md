# Maintenance and work orders

**Status: Proposed.** This folder specifies a potential feature; the screens and contracts described here are not implemented. References to current behavior are identified explicitly.

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

These files use a single proposed design to make the feature reviewable. Names, limits, and contracts are design decisions for implementation, not a description of a deployed API. If a decision changes, update the affected documents together.

## Current starting point

`PropertyMaintenanceRequest` stores `propertyId`, required `tenantId`, `description`, `status`, `timeToCompletion` in hours, and timestamps. Its existing API has list, read, create, update, and delete routes under `/api/property-maintenance-requests`. The create route validates a limited set of statuses, while the update route assigns supplied attributes more broadly. The routes require a JWT but currently do not scope requests to the property owner. There is no dedicated maintenance route in the frontend router.

The existing model is a reasonable starting point, but migration, ownership enforcement, and a compatible API plan are needed before exposing a user interface. See [existing maintenance documentation](../../features/operations/overview.md) and the [current endpoint inventory](../../reference/api/maintenance.md).

## First release boundary

The first release is owner-operated: property and portfolio lists, work order details and editing, status changes, contractor contact fields, optional photos, and a transparent cost summary. A tenant portal, online vendor coordination, automated reminders, recurring schedules, and a contractor directory are future work. The ability to record an urgent item does not itself provide emergency dispatch or notifications.
