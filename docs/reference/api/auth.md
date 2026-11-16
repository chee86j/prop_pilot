# Auth API

## POST /api/register

Handler: `backend/routes/auth.py:90` (`register`). JWT decorator: **no**.

Directly referenced JSON keys: `email`, `first_name`, `last_name`, `password`.

Explicit response statuses: BAD_REQUEST, CONFLICT, INTERNAL_SERVER_ERROR.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [register](../../../backend/routes/auth.py#L90).

## POST /api/login

Handler: `backend/routes/auth.py:133` (`login`). JWT decorator: **no**.

Directly referenced JSON keys: `email`, `password`.

Explicit response statuses: BAD_REQUEST, INTERNAL_SERVER_ERROR, UNAUTHORIZED.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [login](../../../backend/routes/auth.py#L133).

## POST /api/google

Handler: `backend/routes/auth.py:151` (`google_auth`). JWT decorator: **no**.

Directly referenced JSON keys: `token_info`, `userInfo`.

Explicit response statuses: BAD_REQUEST, INTERNAL_SERVER_ERROR, UNAUTHORIZED.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [google_auth](../../../backend/routes/auth.py#L151).

## POST /api/logout

Handler: `backend/routes/auth.py:220` (`logout`). JWT decorator: **no**.

Directly referenced JSON keys: none detected by static extraction.

Explicit response statuses: INTERNAL_SERVER_ERROR, OK.

The handler is the authoritative source for validation, response shape, database queries, and error handling: [logout](../../../backend/routes/auth.py#L220).
