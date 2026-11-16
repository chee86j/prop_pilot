# Photos and storage

The first release allows an owner to attach photos to a saved work order. Photos may document an issue, progress, or completed work. They are not public URLs and do not create tenant or contractor access.

## Proposed limits

Accept JPEG, PNG, and WebP images, up to 10 MiB each and 10 images per work order. Inspect the uploaded bytes and decode the image; do not rely only on the file extension or browser-provided content type. Reject malformed files and images whose decoded dimensions exceed a configured maximum; use 25 million pixels as the initial limit. Generate a private storage key rather than using the supplied filename as a path. Preserve a sanitized original name for display, limited to 255 characters.

These are implementation targets, not current app settings. Use server configuration for the storage location and limits. Decide whether to strip metadata or re-encode images during implementation and document the resulting behavior; do not promise image metadata privacy until that processing is in place.

## User workflow

1. Save the work order first. The detail page then offers Add photos.
2. Choose one or more images. Upload each image as a separate request, showing its progress and result. Client-side checks provide quick feedback, but server checks are authoritative.
3. On success, show the returned image in the photo list. On failure, identify the failed file and allow retry or removal from the queue. A failed upload must not erase other images or unsaved work order text.
4. Open a photo through the authenticated content endpoint. Provide descriptive alternative text or a visible filename; allow the owner to remove the photo with confirmation.

The client should refresh the list after a successful upload or deletion. If the user navigates away during an upload, it must not report success until the server confirms completion. A retry should not silently create duplicates after a lost response; the UI should refresh the attachment list before offering another upload and ask the owner to confirm whether to retry if the result is uncertain.

## API and metadata

Use the work order attachment endpoints in [API](api.md). Each returned metadata object includes `id`, `workOrderId`, sanitized `name`, detected `contentType`, integer `sizeBytes`, and UTC `createdAt`. Do not expose an internal storage path or permanent public URL.

Authenticate and check ownership before listing, uploading, reading, or deleting a photo. Check that an attachment belongs to the requested work order, including when IDs are valid individually. Return a generic 404 for inaccessible records. Return 413 for the size limit, 415 for unsupported types, and 400 for malformed images or when the image-count limit is exceeded. Set the detected content type and appropriate safe response headers on downloads.

## Persistence and cleanup

Store bytes in private storage and metadata in the database. A successful response means both are durable. If storage or metadata persistence fails, clean up any partial object and return an error; do not list it as uploaded. Remove metadata only when deletion is accepted, and make failed blob cleanup retryable rather than losing track of orphaned files.

Property deletion and the legacy work order DELETE need an explicit attachment cleanup path. A database transaction cannot guarantee deletion from external file storage, so use a durable cleanup queue or equivalent retryable process. See [data and migration](data-and-migration.md). Backups and restores must account for both the database metadata and the corresponding private objects.
