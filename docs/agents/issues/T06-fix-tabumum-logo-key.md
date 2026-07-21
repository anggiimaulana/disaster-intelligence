---
id: T06
title: cms/settings/umum — fix logo/favicon storage key mismatch
status: open
type: single
parent: wayfinder-map
---

## Problem

`SettingsController@update` (`app/Http/Controllers/Admin/SettingsController.php:19-30`) saves uploaded file URL at key `logo_file` / `favicon_file` (the field name). Frontend (`resources/js/pages/disaster/settings-components/TabUmum.tsx:6-7`) reads `appSettings.logo_url` / `appSettings.favicon_url` for preview — keys never written. After reload, preview falls back to `/icon.png` and `/favicon.ico`.

Also: no "remove logo" / reset button. Old file remains orphaned in `storage/settings/` after upload.

## Fix

### 1. Storage key

- Either:
  - **Backend fix**: in `SettingsController@update`, save uploaded file URL to `logo_url` and `favicon_url` (not the field name).
  - **Frontend fix**: frontend reads `logo_file` / `favicon_file` instead.
- Prefer backend fix — frontend reading `_url` is the conventional pattern.

### 2. Remove button

- Add "Hapus Logo" / "Hapus Favicon" buttons next to preview.
- Backend route: `DELETE /cms/settings/system/logo` / `favicon` → delete file + setting.
- Frontend: confirm dialog → DELETE → reload settings.

## Acceptance

- Upload logo, save, reload → preview shows new logo.
- Same for favicon.
- Hapus button removes logo/favicon and clears preview.
- Old file deleted from disk.

## Verification

- Manual: upload, save, reload, screenshot before/after.
- `php artisan test --compact --filter=SettingsControllerTest`
- Check `storage/app/public/settings/` — orphaned files cleaned up.
