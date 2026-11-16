# Property API

## GET /api/properties/<int:property_id>

Handler: `backend/routes/property.py:28` (`get_property`). JWT decorator: **yes**.

Directly referenced JSON keys: none detected by static extraction.

Explicit response statuses: 200, 404.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [get_property](../../../backend/routes/property.py#L28).

## GET /api/properties

Handler: `backend/routes/property.py:170` (`get_properties`). JWT decorator: **yes**.

Directly referenced JSON keys: none detected by static extraction.

Explicit response statuses: 200, 404.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [get_properties](../../../backend/routes/property.py#L170).

## POST /api/properties

Handler: `backend/routes/property.py:191` (`add_property`). JWT decorator: **yes**.

Directly referenced JSON keys: `address`, `amenitiesDescription`, `arvSalePrice`, `bathroomsDescription`, `bedroomsDescription`, `city`, `constructionCost`, `county`, `defendant`, `detail_link`, `equipmentCost`, `kitchenDescription`, `largeRepairsCost`, `plaintiff`, `propertyName`, `property_id`, `purchaseCost`, `renovationCost`, `sheriff_number`, `state`, `status_date`, `totalRehabCost`, `zillow_url`, `zipCode`.

Explicit response statuses: 201, 400, 404, 500.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [add_property](../../../backend/routes/property.py#L191).

## PUT /api/properties/<int:property_id>

Handler: `backend/routes/property.py:287` (`update_property`). JWT decorator: **yes**.

Directly referenced JSON keys: `status_date`.

Explicit response statuses: 200, 400, 404, 500.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [update_property](../../../backend/routes/property.py#L287).

## DELETE /api/properties/<int:property_id>

Handler: `backend/routes/property.py:357` (`delete_property`). JWT decorator: **yes**.

Directly referenced JSON keys: none detected by static extraction.

Explicit response statuses: 200, 404, 500.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [delete_property](../../../backend/routes/property.py#L357).

## GET /api/phases/<int:property_id>

Handler: `backend/routes/property.py:376` (`get_phases`). JWT decorator: **yes**.

Directly referenced JSON keys: none detected by static extraction.

Explicit response statuses: 200.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [get_phases](../../../backend/routes/property.py#L376).

## POST /api/phases

Handler: `backend/routes/property.py:382` (`add_phase`). JWT decorator: **yes**.

Directly referenced JSON keys: `name`, `property_id`.

Explicit response statuses: 201, 400, 500.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [add_phase](../../../backend/routes/property.py#L382).

## PUT /api/phases/<int:phase_id>

Handler: `backend/routes/property.py:418` (`update_phase`). JWT decorator: **yes**.

Directly referenced JSON keys: none detected by static extraction.

Explicit response statuses: 200, 400, 404, 500.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [update_phase](../../../backend/routes/property.py#L418).

## DELETE /api/phases/<int:phase_id>

Handler: `backend/routes/property.py:448` (`delete_phase`). JWT decorator: **yes**.

Directly referenced JSON keys: none detected by static extraction.

Explicit response statuses: 200, 404, 500.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [delete_phase](../../../backend/routes/property.py#L448).

## POST /api/run-scraper

Handler: `backend/routes/property.py:463` (`run_scraper_endpoint`). JWT decorator: **yes**.

Directly referenced JSON keys: `county`.

Explicit response statuses: 200, 400, 500.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [run_scraper_endpoint](../../../backend/routes/property.py#L463).

## GET /api/scraped-properties

Handler: `backend/routes/property.py:496` (`get_scraped_properties`). JWT decorator: **yes**.

Directly referenced JSON keys: none detected by static extraction.

Explicit response statuses: 200, 404, 500.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [get_scraped_properties](../../../backend/routes/property.py#L496).

## DELETE /api/construction-draws/<int:draw_id>

Handler: `backend/routes/property.py:540` (`delete_construction_draw`). JWT decorator: **yes**.

Directly referenced JSON keys: none detected by static extraction.

Explicit response statuses: 200, 400, 500.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [delete_construction_draw](../../../backend/routes/property.py#L540).

## POST /api/construction-draws

Handler: `backend/routes/property.py:569` (`create_construction_draw`). JWT decorator: **yes**.

Directly referenced JSON keys: `amount`, `bank_account_number`, `is_approved`, `property_id`, `release_date`.

Explicit response statuses: 201, 400, 500.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [create_construction_draw](../../../backend/routes/property.py#L569).
