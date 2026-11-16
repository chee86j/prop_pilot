# Prop Pilot feature guide

This guide describes the features present in the repository and where to find their implementation. The main workflow is to create an account, add a property, review its financial information, and track renovation phases, draws, and receipts.

- [Accounts and profile](features/accounts/overview.md)
- [Properties and research](features/properties/overview.md)
- [Financial analysis and construction](features/financials/overview.md)
- [Tenants and maintenance](features/operations/overview.md)
- [Tools and public pages](features/tools/overview.md)

The frontend is a React application; the backend is a Flask API, normally mounted under `/api`. Setup instructions are in the [project README](../README.md). Feature descriptions reflect the source code, not a guarantee that every integration is configured or fully operational.

## Architecture and implementation map

The browser application uses React Router and loads pages through lazy imports. The API is Flask with SQLAlchemy models and JWT authentication. `backend/app.py` configures PostgreSQL from environment variables outside testing and in-memory SQLite when `FLASK_ENV=testing`; it initializes migrations and creates tables during app startup. The API and individual blueprints are both registered under `/api`, and some routes are declared in more than one blueprint. For exact routing behavior, inspect the running Flask URL map rather than assuming every declaration is independently reachable.

The principal data relationship is User ? Property ? Phase and ConstructionDraw ? Receipt. Property also relates to Lease and PropertyMaintenanceRequest; Tenant relates to leases and maintenance requests. [Data model reference](reference/data-model.md) inventories the actual imported SQLAlchemy columns, including types, nullability, defaults, and foreign keys where declared.

These documents describe the repository as inspected. They do not constitute a verified acceptance test or a complete pixel-level design specification; consult the linked source for exact markup, styles, messages, and all edge cases.

## Detailed references

- [API endpoint inventory](reference/api/README.md): route methods, authentication decorators, directly referenced request keys, and source links.
- [Financial panel calculations](features/financials/calculations.md): exact component inputs and arithmetic, including field-name and unit inconsistencies.
- [Rehab estimator rates](features/tools/rehab-rates.md): the rates used for each work category.

The API inventory is mechanically extracted from source. Its list of request keys and statuses is a navigation aid, not a complete contract: keys accessed through loops or helper functions and framework-generated responses may be absent. Follow each handler link for full behavior.
