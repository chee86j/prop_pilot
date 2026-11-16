# Maintenance API

## GET /api/property-maintenance-requests

Handler: `backend/routes/maintenance.py:9` (`get_property_maintenance_requests`). JWT decorator: **yes**.

Directly referenced JSON keys: none detected by static extraction.

Explicit response statuses: 200.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [get_property_maintenance_requests](../../../backend/routes/maintenance.py#L9).

## GET /api/property-maintenance-requests/<int:request_id>

Handler: `backend/routes/maintenance.py:28` (`get_property_maintenance_request`). JWT decorator: **yes**.

Directly referenced JSON keys: none detected by static extraction.

Explicit response statuses: 200.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [get_property_maintenance_request](../../../backend/routes/maintenance.py#L28).

## POST /api/property-maintenance-requests

Handler: `backend/routes/maintenance.py:43` (`add_property_maintenance_request`). JWT decorator: **yes**.

Directly referenced JSON keys: `description`, `propertyId`, `status`, `tenantId`, `timeToCompletion`.

Explicit response statuses: 201, 400, 404, 500.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [add_property_maintenance_request](../../../backend/routes/maintenance.py#L43).

## PUT /api/property-maintenance-requests/<int:request_id>

Handler: `backend/routes/maintenance.py:108` (`update_property_maintenance_request`). JWT decorator: **yes**.

Directly referenced JSON keys: none detected by static extraction.

Explicit response statuses: 200, 500.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [update_property_maintenance_request](../../../backend/routes/maintenance.py#L108).

## DELETE /api/property-maintenance-requests/<int:request_id>

Handler: `backend/routes/maintenance.py:123` (`delete_property_maintenance_request`). JWT decorator: **yes**.

Directly referenced JSON keys: none detected by static extraction.

Explicit response statuses: 200, 500.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [delete_property_maintenance_request](../../../backend/routes/maintenance.py#L123).
