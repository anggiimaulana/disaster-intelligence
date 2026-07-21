---
id: T11
title: cms/disaster-types — add icon upload (file/SVG) via media library
status: open
type: single
parent: wayfinder-map
---

## Problem

`resources/js/pages/disaster/types.tsx`:

- Hardcoded `allIconKeys` list of 32 Lucide icon names (`Flame`, `Waves`, `Wind`, etc.) at line 14-21.
- Picker UI at lines 187-217 selects a name string only.
- `app/Http/Controllers/Admin/DisasterTypeController.php:36` stores `icon` as string. No file upload, no media library reference.
- `app/Models/JenisBencana.php:18` — `icon` is a string column.

User can't upload custom disaster-type icons (e.g., agency-specific SVG).

## Fix

1. Migration: add `icon_media_id` (nullable FK to media_library) to `jenis_bencana` table.
2. Update `JenisBencana` model: add `iconMedia()` belongsTo.
3. Update form (`types.tsx`):
   - Keep icon-name picker as fallback for built-in icons.
   - Add "Upload Icon" button → opens media library picker (T12 pattern).
   - On upload/select, store `icon_media_id`.
4. Update `DisasterTypeController::store/update`: accept `icon_media_id` (nullable), `icon` (string fallback).
5. Frontend render: if `icon_media_id` → use media URL; else if `icon` → render Lucide component.

## Acceptance

- Form has both icon-name picker AND upload button.
- Uploaded SVG/PNG renders in disaster-type list.
- Existing icon-name still works as fallback.
- Disaster-type badge on map/list shows correct icon.

## Verification

- Manual: create disaster type with custom icon, verify renders.
- `php artisan test --compact --filter=DisasterTypeControllerTest`
