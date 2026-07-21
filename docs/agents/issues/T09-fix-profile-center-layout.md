---
id: T09
title: cms/settings/profile — center layout + media library avatar picker
status: open
type: single
parent: wayfinder-map
---

## Problem

`resources/js/pages/settings/profile.tsx`:

- **Layout** (line 56): `max-w-3xl` left-anchored single column. Photo+name card, password card, danger zone all stack vertically.
- **Avatar upload** (line 92): plain `<input type="file">`, no media library picker. User can't browse previously uploaded images.
- Backend `ProfileController::update` (line 38-43) stores directly to disk, not via MediaLibrary model.

## Fix

### 1. Center layout

- Wrap content in `flex justify-center` or use `mx-auto` with centered max-width.
- Optionally: two-column on `lg:` (avatar card left, info card right).
- Keep form fields grouped in cards.

### 2. Media library avatar picker

- Reuse media library picker pattern from T12.
- "Pilih dari Media Library" button next to upload.
- On select, set avatar URL from media library file.
- On save, send either uploaded file OR media library URL.
- Backend: if URL provided (media library), reference media library ID; if file uploaded, store and reference.

### 3. Old file cleanup

- When user picks a new avatar (file or library), the previous file should be deleted on save.
- Already handled in `ProfileController:39-41` for files — verify also for library references.

## Acceptance

- Profile page centered on screen, card-based layout.
- User can pick avatar from media library OR upload new file.
- Old avatar removed on save.
- Layout responsive on mobile.

## Verification

- Manual: visit `/cms/settings/profile`, verify centered layout, verify both upload paths work.
- `php artisan test --compact --filter=ProfileControllerTest`
