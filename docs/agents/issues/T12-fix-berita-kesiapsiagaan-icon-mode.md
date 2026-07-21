---
id: T12
title: cms/berita & kesiapsiagaan — fix icon-mode drop on submit + add media-library picker
status: open
type: single
parent: wayfinder-map
---

## Problem

Both forms have identical bugs:

`resources/js/pages/admin/berita/form.tsx`:
- Two-mode toggle `thumbnailMode: 'upload' | 'icon'` (line 35).
- `iconName` state set (line 34) but **never appended to FormData** in `handleSubmit` (lines 60-77). Icon silently dropped on submit.
- `remove_thumbnail` flag (line 69) only sent when `thumbnailMode === 'upload'` — switching to icon mode can't clear existing thumbnail.
- Upload uses raw `<input type="file">`, no media-library picker.

`resources/js/pages/admin/kesiapsiagaan/form.tsx`:
- Same bug (lines 60-83).
- Same `remove_thumbnail` issue (line 67).

## Fix

### 1. Fix icon-mode persistence

- In `handleSubmit`, when `thumbnailMode === 'icon'`, append `icon` (iconName) to FormData.
- When `thumbnailMode === 'icon'` and existing `item.thumbnail` present, append `remove_thumbnail=1` to clear it.
- Backend `BeritaController::update`/`KesiapsiagaanController::update` must handle `icon` field — either:
  - Save `icon` to a separate column (add migration if needed), OR
  - Convert icon name to a generated SVG/PNG and save as thumbnail path.

### 2. Add media-library picker

- Reuse media library picker pattern (build once, share component).
- Add "Pilih dari Media Library" button in `thumbnailMode === 'upload'`.
- On select, store media URL (or media ID).
- Backend: optionally track `thumbnail_media_id` for cleanup.

### 3. Extract shared component

- Create `resources/js/components/media-library-picker.tsx` (modal that lists media, returns selection).
- Use in berita form, kesiapsiagaan form, profile avatar (T09), disaster-type icon (T11), tiptap image insert (T15).

## Acceptance

- Pick icon → save → reload → icon still selected.
- Switch from upload to icon mode → existing thumbnail cleared on save.
- Pick from media library → URL saved.
- Reusable picker component used in 4+ places.

## Verification

- Manual: submit form with icon mode, verify icon persists.
- Manual: switch from upload-mode thumbnail to icon-mode, verify thumbnail removed.
- `php artisan test --compact --filter=BeritaControllerTest`
- `php artisan test --compact --filter=KesiapsiagaanControllerTest`
