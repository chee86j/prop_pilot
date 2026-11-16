# Tenant API

## GET /api/tenants

Handler: `backend/routes/tenant.py:11` (`get_all_tenants`). JWT decorator: **yes**.

Directly referenced JSON keys: none detected by static extraction.

Explicit response statuses: 200, 404.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [get_all_tenants](../../../backend/routes/tenant.py#L11).

## GET /api/tenants/<int:tenant_id>

Handler: `backend/routes/tenant.py:37` (`get_tenant`). JWT decorator: **yes**.

Directly referenced JSON keys: none detected by static extraction.

Explicit response statuses: 200, 404.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [get_tenant](../../../backend/routes/tenant.py#L37).

## POST /api/tenants

Handler: `backend/routes/tenant.py:65` (`add_tenant`). JWT decorator: **yes**.

Directly referenced JSON keys: `creditCheck1Complete`, `creditCheck2Complete`, `creditScoreAtInitialApplication`, `creditScoreAtLeaseRenewal`, `dateOfBirth`, `email`, `employerName`, `firstName`, `guarantor`, `lastName`, `occupation`, `petsAllowed`, `phoneNumber`, `professionalTitle`.

Explicit response statuses: 201, 400, 404, 500.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [add_tenant](../../../backend/routes/tenant.py#L65).

## PUT /api/tenants/<int:tenant_id>

Handler: `backend/routes/tenant.py:150` (`update_tenant`). JWT decorator: **yes**.

Directly referenced JSON keys: none detected by static extraction.

Explicit response statuses: 200, 404, 500.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [update_tenant](../../../backend/routes/tenant.py#L150).

## DELETE /api/tenants/<int:tenant_id>

Handler: `backend/routes/tenant.py:171` (`delete_tenant`). JWT decorator: **yes**.

Directly referenced JSON keys: none detected by static extraction.

Explicit response statuses: 200, 404, 500.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [delete_tenant](../../../backend/routes/tenant.py#L171).

## GET /api/leases/<int:property_id>

Handler: `backend/routes/tenant.py:190` (`get_property_leases`). JWT decorator: **yes**.

Directly referenced JSON keys: none detected by static extraction.

Explicit response statuses: 200.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [get_property_leases](../../../backend/routes/tenant.py#L190).

## GET /api/leases/<int:lease_id>

Handler: `backend/routes/tenant.py:205` (`get_lease`). JWT decorator: **yes**.

Directly referenced JSON keys: none detected by static extraction.

Explicit response statuses: 200.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [get_lease](../../../backend/routes/tenant.py#L205).

## POST /api/leases

Handler: `backend/routes/tenant.py:220` (`create_lease`). JWT decorator: **yes**.

Directly referenced JSON keys: `endDate`, `propertyId`, `renewalCondition`, `rentAmount`, `startDate`, `tenantId`, `typeOfLease`.

Explicit response statuses: 201, 400, 404, 500.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [create_lease](../../../backend/routes/tenant.py#L220).

## PUT /api/leases/<int:lease_id>

Handler: `backend/routes/tenant.py:305` (`update_lease`). JWT decorator: **yes**.

Directly referenced JSON keys: none detected by static extraction.

Explicit response statuses: 200, 500.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [update_lease](../../../backend/routes/tenant.py#L305).

## DELETE /api/leases/<int:lease_id>

Handler: `backend/routes/tenant.py:320` (`delete_lease`). JWT decorator: **yes**.

Directly referenced JSON keys: none detected by static extraction.

Explicit response statuses: 200, 500.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [delete_lease](../../../backend/routes/tenant.py#L320).
