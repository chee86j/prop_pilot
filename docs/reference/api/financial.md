# Financial API

## GET /api/construction-draws/<int:property_id>

Handler: `backend/routes/financial.py:11` (`get_construction_draws`). JWT decorator: **yes**.

Directly referenced JSON keys: none detected by static extraction.

Explicit response statuses: 200.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [get_construction_draws](../../../backend/routes/financial.py#L11).

## POST /api/construction-draws

Handler: `backend/routes/financial.py:17` (`add_construction_draw`). JWT decorator: **yes**.

Directly referenced JSON keys: `amount`, `bank_account_number`, `is_approved`, `property_id`, `release_date`.

Explicit response statuses: 201, 400, 500.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [add_construction_draw](../../../backend/routes/financial.py#L17).

## PUT /api/construction-draws/<int:draw_id>

Handler: `backend/routes/financial.py:101` (`update_construction_draw`). JWT decorator: **yes**.

Directly referenced JSON keys: `amount`, `bank_account_number`, `is_approved`, `property_id`, `release_date`.

Explicit response statuses: 200, 400, 500.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [update_construction_draw](../../../backend/routes/financial.py#L101).

## DELETE /api/construction-draws/<int:draw_id>

Handler: `backend/routes/financial.py:165` (`delete_construction_draw`). JWT decorator: **yes**.

Directly referenced JSON keys: none detected by static extraction.

Explicit response statuses: 200, 400, 500.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [delete_construction_draw](../../../backend/routes/financial.py#L165).

## GET /api/receipts/<int:draw_id>

Handler: `backend/routes/financial.py:194` (`get_receipts`). JWT decorator: **yes**.

Directly referenced JSON keys: none detected by static extraction.

Explicit response statuses: 200.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [get_receipts](../../../backend/routes/financial.py#L194).

## POST /api/receipts

Handler: `backend/routes/financial.py:209` (`add_receipt`). JWT decorator: **yes**.

Directly referenced JSON keys: `amount`, `ccnumber`, `construction_draw_id`, `date`, `description`, `pointofcontact`, `vendor`.

Explicit response statuses: 201, 400, 404, 500.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [add_receipt](../../../backend/routes/financial.py#L209).

## PUT /api/receipts/<int:receipt_id>

Handler: `backend/routes/financial.py:296` (`update_receipt`). JWT decorator: **yes**.

Directly referenced JSON keys: none detected by static extraction.

Explicit response statuses: 200, 500.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [update_receipt](../../../backend/routes/financial.py#L296).

## DELETE /api/receipts/<int:receipt_id>

Handler: `backend/routes/financial.py:311` (`delete_receipt`). JWT decorator: **yes**.

Directly referenced JSON keys: none detected by static extraction.

Explicit response statuses: 200, 500.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [delete_receipt](../../../backend/routes/financial.py#L311).
