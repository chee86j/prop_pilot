# Maintenance migration runbook

## What changed

Revision `b51c7f2d8a40` adds the work order fields, allows a null tenant in the database, backfills a title and defaults for old records, and maps stored `pending` to `open`. It preserves old IDs, descriptions, associations, durations, and timestamps. The existing API still requires a tenant and returns `pending` for stored `open` or `scheduled` records. The new API, interface, and attachments remain future work.

The migration stops before changing the table if an old record has an unexpected or null status. Its downgrade intentionally stops because automatically dropping the new fields could discard user data. Back up the database before migrating and make a separate recovery plan for any rollback. `db.create_all()` does not upgrade existing tables.

## Historical revision gaps

The existing repository merge `9de37564d2d6` references `add_coordinates_to_property`, whose original migration and parent are missing. The repository includes a guard revision with that ID so Alembic can load the graph for a database already recorded at the merge. The guard raises an error if Alembic tries to apply or reverse the unknown historical migration; it is not a replacement for the missing schema changes.

On 2026-11-17, a read-only check of the configured local PostgreSQL database found its maintenance table in the old shape and its `alembic_version` recorded as `6805acebec80`. That revision is also absent from the repository. Consequently, an ordinary Alembic upgrade cannot determine a safe path for that database yet. The check did not modify the database. This observation may become outdated if the configuration or database changes.

## Safe path to upgrade

1. Back up the configured database and confirm which database the app points to. Preserve the backup until the upgrade and application behavior have been verified.
2. Recover the original migration files, especially `6805acebec80` and `add_coordinates_to_property`, including their dependencies. Inspect the actual schema and revision history to determine the legitimate path. Do not use `flask db stamp` to claim an unknown migration ran merely to bypass the error.
3. Once the history is reconciled and the database has a verified route to the existing merge, run the upgrade from the `backend` directory using the project's virtual environment:

   ```powershell
   ..\venv\Scripts\python.exe -m flask --app app db upgrade
   ```

4. Confirm the recorded revision and inspect the migrated records. Verify that legacy maintenance list, create, and update behavior still works for an owner. If there is an unexpected-status error, resolve the affected data deliberately before retrying.

The migration has been exercised against representative SQLite records and a temporary PostgreSQL table inside a rolled-back transaction. That does not establish the configured database's missing migration ancestry or apply the change to it.
