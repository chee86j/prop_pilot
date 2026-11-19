# Ownership and access

This document defines proposed access rules. The first release has one role for this feature: an authenticated property owner operating their own records. A linked tenant and a named contractor do not get accounts or access through this feature.

## Current state

The existing maintenance routes require a JWT and now scope listing, reading, updating, and deletion to properties owned by the authenticated user. Creation and tenant reassignment check that the selected tenant is managed by the user and has a lease for the associated property; historical leases qualify. The update endpoint accepts only existing maintenance fields. It still permits reassignment between properties owned by the same user. The new API and attachment endpoints below remain proposed.

## Authorization rules

Resolve the authenticated JWT identity to the current user using the application's existing identity convention. Scope each order query through `Property.owner_id == current_user.id`; do not rely on an ID or owner value supplied by the browser.

| Action | Required check |
| --- | --- |
| List all orders | Query only orders attached to the owner's properties, including when no property filter is supplied. |
| List for one property | Verify the property is owned and apply the owner-scoped order query. |
| Create | Verify the property is owned; validate any tenant association before inserting. |
| Read or update | Fetch the order through its owned property; reject changing `propertyId`. |
| Upload, list, view, or delete a photo | Authorize the order first, then verify the attachment belongs to that order. |
| Delete through the legacy endpoint | Apply the same owner check and the explicit cleanup behavior in [migration](data-and-migration.md). |
| Calculate a summary | Aggregate only the owner's property orders using the same filters as the drill-down. |

An absent or inaccessible property, order, or attachment should return the same generic 404 response. An unauthenticated request returns 401. Neither response should include another owner's record, file name, storage key, or totals. Authentication and ownership checks apply even when a user opens a deep link or image URL directly.

## Tenant association

For a new or changed `tenantId`, verify that the tenant is managed by the owner and that a lease links the tenant to the selected property. Do not infer tenant access from that association. Preserve migrated links even if they do not meet the new rule; the owner can remove or correct such a link. Tenant data in the selector should be limited to the minimum needed to identify eligible tenants.

## Safe mutations

Use an allowlist of editable fields, server-side validation, and a database transaction for each work order mutation. Never accept `owner_id`, timestamps, IDs, or arbitrary model attributes from a client. The new PATCH API uses the record version to detect concurrent edits; legacy updates increment the same version. Store photos privately and authorize every content request, as described in [attachments](attachments.md).

## Checks before release

Create at least two users, each with a property and an order. Verify that changing an order ID, property filter, attachment ID, or summary property ID cannot reveal or modify the other user's data. Repeat the checks against legacy routes, including the unfiltered list and DELETE. Verify that a tenant from another owner or unrelated property cannot be newly linked. Verify that a stale version returns a conflict without changing the record. Include unauthenticated and expired-token requests.
