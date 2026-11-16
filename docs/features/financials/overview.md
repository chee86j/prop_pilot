# Financial analysis and construction

## Property financial analysis

A property detail page includes financial analysis components for profit and loss, operating expenses, rental income, capital expenditure, and rental analysis. These organize property figures for evaluating income and costs. The financial analysis component also provides CSV export.

## Phases

The property detail page displays a phase timeline and a phase form. Phases can be created, updated, and deleted through `/api/phases`; the property-specific GET endpoint loads the timeline data. This supports tracking stages of work against a property.

## Construction draws and receipts

Construction draws are associated with a property and can be viewed at `/constructiondraw/:propertyId` or from property details. The draw interface supports creating, editing, and deleting draws. Receipts are associated with a draw and have their own view at `/receipts/:drawId`; the API provides create, retrieve, update, and delete operations for draws and receipts.

**Source:** `frontend/src/components/property/FinancialAnalysis.jsx`, the related financial components, `PhaseTimeline.jsx`, `PhaseForm.jsx`, `ConstructionDraw.jsx`, `Receipt.jsx`, `backend/routes/property.py`, and `backend/routes/financial.py`.

## Financial information in context

The analysis components consume property fields and present different views of income, expenses, rental assumptions, capital costs, and projected sale outcomes. Their values depend on the figures entered for the property; inspect the corresponding component before relying on a specific formula. The CSV export is initiated in the financial analysis interface.

## Phase data and operations

Each phase belongs to a property and has a name plus optional actual and expected start and end dates. Dates are submitted as ISO date strings. The timeline and form display and edit these records.

| Method and path | Purpose |
| --- | --- |
| `GET /api/phases/:property_id` | List phases for a property. |
| `POST /api/phases` | Create using `property_id`, `name`, and optional `startDate`, `expectedStartDate`, `endDate`, `expectedEndDate`. |
| `PUT /api/phases/:phase_id` | Update a phase and its dates. |
| `DELETE /api/phases/:phase_id` | Delete a phase. |

The routes require a JWT, but the phase handlers query by ID without checking property ownership. API consumers and maintainers should account for that implementation limit.

## Draw data and operations

A draw belongs to a property and records `release_date`, `amount`, `bank_account_number`, and `is_approved`. The model requires a positive amount, a positive property ID, a release date, and an account number of at least four digits containing only digits. Approval defaults to false. The model checks that a release date exists; it does not actually reject dates in the past.

`GET /api/construction-draws/:property_id` lists draws, `POST /api/construction-draws` creates one, and `PUT` or `DELETE /api/construction-draws/:draw_id` changes or removes one. The property and financial blueprints both declare some draw routes; consult their registration order and handlers when changing this feature.

## Receipt data and operations

A receipt belongs to a draw. Creation requires `construction_draw_id`, `date` in `YYYY-MM-DD` format, `vendor`, and `amount`. Optional fields include `description`, `pointofcontact`, and `ccnumber`. The model stores at most four characters for `ccnumber`. The receipt interface lets the user review and maintain records associated with a draw.

`GET /api/receipts/:draw_id` lists receipts; `POST /api/receipts` creates one; `PUT` and `DELETE /api/receipts/:receipt_id` address an individual receipt. These endpoints require authentication. Draw and receipt data contain financial information, so access checks and deployment configuration should be reviewed before production use.
