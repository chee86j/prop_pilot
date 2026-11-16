# User API

## GET /api/profile

Handler: `backend/routes/user.py:9` (`get_profile`). JWT decorator: **yes**.

Directly referenced JSON keys: none detected by static extraction.

Explicit response statuses: 200, 404.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [get_profile](../../../backend/routes/user.py#L9).

## PUT /api/profile

Handler: `backend/routes/user.py:24` (`update_profile`). JWT decorator: **yes**.

Directly referenced JSON keys: `avatar`, `email`, `first_name`, `last_name`.

Explicit response statuses: 200, 404, 500.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [update_profile](../../../backend/routes/user.py#L24).

## PUT /api/profile/password

Handler: `backend/routes/user.py:44` (`update_password`). JWT decorator: **yes**.

Directly referenced JSON keys: `current_password`, `new_password`.

Explicit response statuses: 200, 401, 404, 500.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [update_password](../../../backend/routes/user.py#L44).
