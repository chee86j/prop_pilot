# Tenants and maintenance

The backend provides tenant, lease, and maintenance request resources. The current frontend router does not define dedicated pages for these resources, so API support should not be assumed to imply a complete user interface.

## Tenants and leases

`/api/tenants` provides tenant listing and creation; `/api/tenants/:id` provides retrieval, update, and deletion. Lease routes provide listing by property, individual retrieval, creation, update, and deletion under `/api/leases`. Both property lease listing and individual lease retrieval use an integer path segment, so consult `backend/routes/tenant.py` when integrating with these routes.

## Maintenance requests

`/api/property-maintenance-requests` provides listing and creation, while the ID endpoint supports retrieval, update, and deletion. Requests are represented by the maintenance model and associated with property data.

**Source:** `backend/routes/tenant.py`, `backend/routes/maintenance.py`, and the corresponding files in `backend/models/`.

## Tenant record details

Creating a tenant requires `firstName`, `lastName`, `email`, and `dateOfBirth` (`YYYY-MM-DD`). Optional information includes phone, occupation, employer, title, credit scores and check flags, guarantor, and whether pets are allowed. The model validates email, a 10–11 digit phone number when provided, credit scores between 300 and 850, an age of at least 18, and names containing letters, spaces, hyphens, or apostrophes. Email is unique in the model. Send actual JSON booleans for flags; the create route converts supplied values with Python's `bool()`.

## Lease record details

A lease links one tenant and one property. Creation requires `tenantId`, `propertyId`, `startDate`, `endDate`, `rentAmount`, and `typeOfLease`; `renewalCondition` is optional. The create handler checks that the tenant and property exist, parses dates in `YYYY-MM-DD` format, and parses the rent amount. Review the route for its accepted lease types and validation before integrating.

Two GET handlers are declared with the same `/leases/<int>` URL pattern, one treating the ID as a property ID and the other as a lease ID. This makes the intended individual lookup ambiguous under routing; check the registered route behavior before building a client around it. The repository also contains two lease model definitions, so inspect `backend/models/__init__.py` to determine which one the running application imports.

## Maintenance request details

Creation requires `propertyId`, `tenantId`, and `description`; the route checks that the referenced property and tenant exist. Optional `status` defaults to `pending`, and `timeToCompletion` represents hours. Records also include creation and update timestamps. The maintenance API supports reading, changing, and deleting individual requests. These routes require a JWT; inspect the handlers for their exact validation and ownership behavior before exposing them to users.
Maintenance requests are scoped to the authenticated property's owner. Creating or reassigning a request also requires the selected tenant to be managed by that user; the existing API does not yet verify a lease between that tenant and the property. The updated model permits a null tenant, but the existing API still requires one. Existing databases need the work order migration before using the updated model; see the [migration runbook](../../To%20Implement/maintenance-work-orders/migration-runbook.md).
