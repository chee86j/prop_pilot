# Proposed work order API

This describes a new contract to implement under `/api/work-orders`. It is separate from the current `/api/property-maintenance-requests` routes; the compatibility approach is in [data and migration](data-and-migration.md). All endpoints require the existing authenticated JWT and enforce [ownership rules](access.md). JSON examples are illustrative and use the proposed field names.

## Representation

```json
{
  "id": 42,
  "propertyId": 12,
  "tenantId": null,
  "title": "Fix kitchen leak",
  "description": "Water under the sink after use.",
  "status": "scheduled",
  "priority": "high",
  "contractorName": "Example Plumbing",
  "contractorContact": "555-0100",
  "targetDate": "2026-12-15",
  "estimatedCost": "250.00",
  "actualCost": null,
  "notes": "Confirm access before arrival.",
  "timeToCompletion": null,
  "createdAt": "2026-12-01T15:00:00Z",
  "updatedAt": "2026-12-02T16:00:00Z",
  "completedAt": null,
  "version": 2
}
```

IDs and `version` are integers. Dates use `YYYY-MM-DD`; timestamps use UTC ISO 8601 with `Z`. Amounts are decimal strings with at most two fractional digits on input and exactly two on output; null means not recorded. Read-only fields are server-generated. A work order response does not embed images; use the attachment endpoints.

## List

`GET /api/work-orders`

Only return orders whose property belongs to the caller. Supported query parameters:

| Parameter | Behavior |
| --- | --- |
| `propertyId` | Optional owned property ID; an unavailable property returns 404. |
| `status` | Optional comma-separated list of valid stored statuses. Omitted means all; the UI explicitly requests its unfinished default. |
| `priority` | Optional one of the four priority values. |
| `due` | Optional `overdue` or `upcoming`; both exclude completed, cancelled, and undated orders. Upcoming means today through seven calendar days ahead. |
| `completedFrom`, `completedTo` | Optional inclusive calendar-date bounds applied to `completedAt` in the requested time zone. Orders with no completion timestamp do not match a supplied bound. |
| `tz` | IANA time zone used to determine the current calendar date; default `UTC`. An unsupported value returns 400. |
| `limit`, `offset` | Integer page size 1–100, default 25, and nonnegative offset, default 0. |

All supplied filters combine with AND. Sort by target date ascending, null dates last, then creation timestamp descending, then ID descending as a stable tie-breaker. Return:

```json
{
  "items": [],
  "total": 0,
  "limit": 25,
  "offset": 0,
  "asOfDate": "2026-12-01"
}
```

`total` is the count after filtering and before pagination. `asOfDate` is the server's current date in the requested zone, even when a due filter is omitted. Offset pagination can shift if records change between requests; the UI should refresh after edits and should not use the current page as a portfolio total.

For a completed-cost drill-down, request `status=completed` and use the same `completedFrom`, `completedTo`, and `tz` values as the summary's `from`, `to`, and `tz`. Reject an invalid date or a start after the end with 400.

## Create and read

`POST /api/work-orders` accepts JSON with `propertyId` and `title`; other editable fields are optional. New orders start with status `open`, priority defaults to `normal`, description defaults to an empty string, and unspecified optional fields are null. If `status` is provided on creation it must be `open`; subsequent changes use PATCH. New records begin at version 1. Return the complete representation with 201 and `Location: /api/work-orders/<id>`.

`GET /api/work-orders/<id>` returns the complete representation with 200 when the record belongs to the caller. An absent or inaccessible ID returns the same generic 404 response.

## Update

`PATCH /api/work-orders/<id>` accepts an object containing `version` and one or more editable fields. Omitted fields remain unchanged; explicit null clears an optional field. `propertyId`, IDs, timestamps, and server-generated fields cannot be changed. An empty patch, unsupported field, invalid null, invalid enum, or invalid amount returns 400. Validate the resulting record atomically before saving.

```json
{
  "version": 2,
  "status": "completed",
  "actualCost": "225.00"
}
```

Compare the submitted version with the persisted version in an atomic update. On a match, apply changes, update timestamps and completion state, increment the version, and return the updated representation with 200. On mismatch return 409 with `code: "version_conflict"`; do not apply any part of the patch. The client should fetch the current record while preserving the user's unsaved inputs. Photo operations use their own records and do not increment the work order version.

The new API has no permanent-delete endpoint. Use a status update to cancel an order. The older DELETE endpoint remains an explicit compatibility exception until retired; see [migration](data-and-migration.md).

## Attachment endpoints

`GET /api/work-orders/<id>/attachments` lists metadata. `POST` to the same path uploads one image using multipart form data with a `file` part and returns its metadata with 201. `GET /api/work-orders/<id>/attachments/<attachmentId>/content` returns the image bytes with the detected content type. `DELETE /api/work-orders/<id>/attachments/<attachmentId>` removes an attachment and returns 204. Both the order and attachment must belong together and be accessible to the owner. Limits, response metadata, and failure behavior are specified in [attachments](attachments.md).

## Cost summary

`GET /api/work-orders/summary` requires an owned `propertyId` and accepts optional `from`, `to`, and `tz` parameters. It returns the completed work order actual-cost totals and counts described in [costs](costs.md), calculated across all matching records rather than the current list page. Register this literal route so it cannot be mistaken for an integer work order ID. The same authentication, ownership, date validation, and time-zone rules apply.

## Validation and errors

Validate on the server: trimmed title 1–160 characters; description and notes up to 10,000; contractor fields within their specified limits; valid dates and enum values; amounts from `0.00` through `9999999999.99` with no more than two decimals; and nonnegative integer `timeToCompletion` if supplied. Reject unknown fields rather than mass assigning them. Enforce the tenant/property association on create or tenant change.

Use a consistent JSON error such as `{"code":"validation_error","message":"Check the highlighted fields.","fields":{"title":"Title is required."}}`. Return 400 for invalid input or malformed JSON, 401 for missing or invalid credentials, 404 for nonexistent or inaccessible resources, 409 for stale versions or property deletion conflicts, 413 for oversized uploads, and 415 for unsupported file types. Unexpected failures return a generic 500 without exposing stack traces. A failed request must not partially save a work order.
