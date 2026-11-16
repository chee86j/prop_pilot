# Screens and interactions

All behavior in this document is proposed. The owner is the signed-in user who owns the associated property. The screens should work on narrow mobile screens as well as desktop and should use the app's existing navigation, loading, and error patterns.

## Entry points

1. **Property detail:** add a Maintenance section to the existing property detail page. It starts with work orders for that property and a New work order action. The property is preselected and cannot be changed in this entry path.
2. **Portfolio:** add a Maintenance navigation entry and page at a proposed `/maintenance` route. It lists work across the owner's properties. New work order opens the same form with an owned-property selector.
3. **Order detail:** use a proposed `/maintenance/:workOrderId` route so a user can return to a specific record. The server still checks access when the URL is opened directly.

Return navigation should preserve the originating list's filters where possible. Refreshing a detail URL must reload the record from the server; frontend state alone is not a source of truth.

## Property maintenance section

Display the property name or address, an explanation when no work exists, a New work order action, and a list of its orders. Each list item shows title, status, priority, contractor name when present, target date when present, and estimated and actual amounts. Use an em dash or “Not set” for missing data; display a recorded zero as `$0.00`.

The default filter shows Open, Scheduled, and In progress. A status control can select individual statuses or All, including Completed and Cancelled. Sort by target date ascending, followed by creation time descending; put orders without a target date last. Include a text label for overdue work as well as any color treatment.

The list fetches from the proposed API with the property filter. Show a loading indicator while fetching. If there are no results under an active filter, explain that and offer Clear filters; if the property has no records at all, invite the owner to create one. Show a retry action for a failed fetch, preserving the selected filter. Do not present a failed request as an empty list.

## Portfolio maintenance page

Show the same core information plus property name and address. Provide filters for property, status, priority, and target date state: All, Overdue, and Due within 7 days. Filters apply together. Due within 7 days includes today through seven calendar days later, excludes completed and cancelled orders, and does not include overdue orders. Use the same local-date definition as [workflow rules](workflow.md).

The initial view shows unfinished work across all owned properties. Show the active filters and offer Clear filters, which restores the default unfinished view. Support pagination with a visible way to load the next page; reset to the first page when filters change. When an item is changed so it no longer matches the list filter, refresh the affected list or remove it after the server confirms the change. The count and totals must not imply that only the current page represents the whole portfolio.

## Create and edit form

The form contains property, title, description, tenant, priority, contractor name and contact, target date, estimated cost, actual cost, and notes. On edit, status is controlled explicitly as described in [workflow](workflow.md). Show field labels and validation messages beside the relevant controls, with a summary when submission fails. Use native date and appropriate decimal input controls where available; the server remains authoritative.

For creation from a property, lock the preselected property. For portfolio creation, load only owned properties; do not permit submission before one is selected. The optional tenant selector shows eligible tenants for the selected property. If the property changes before creation, clear any tenant that no longer applies and tell the user why. The detail screen does not support moving an existing order to a different property.

Keep inputs on validation or network failure. Disable repeated submission while a request is in flight. On success, use the server response, navigate to the saved order, and show confirmation. If an edit is stale, retain the unsaved values and offer to reload the current version before the user retries. Warn before discarding dirty form changes. Editing an order must not silently update the property-level `maintenanceCosts` field.

Attachments are managed after the initial order is saved, using the separately specified [photo workflow](attachments.md). Unsaved text edits must not be discarded when a photo action fails.

## Work order detail

Show the title, property, status, priority, due state, description, tenant if linked, contractor contact, target date, estimates, actual cost, notes, timestamps, and photos. Provide Edit and Change status actions. Display completed or cancelled status prominently and offer Reopen. An order can be cancelled without deletion; the first release does not expose permanent deletion.

After saving or changing status, refresh from the response. If a record is unavailable or the owner lacks access, show a generic unavailable message and a link back to maintenance. Do not disclose information about another owner's order. Display attachment errors independently from work order loading so a failed image request does not hide the record.

## Accessibility and presentation

Use semantic headings, labelled controls, keyboard-operable filters and dialogs, visible focus, and status text that does not rely on color. Announce save results and validation summaries to assistive technology. Render a card layout on narrow screens rather than requiring horizontal scrolling for every action. Preserve readable dates, currency, and button labels across layouts.
