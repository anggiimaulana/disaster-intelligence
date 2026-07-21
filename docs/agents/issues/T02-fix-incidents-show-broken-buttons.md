---
id: T02
title: cms/incidents detail — fix Bagikan, Unduh PDF, Validasi Laporan link, Export PDF
status: resolved
type: single
parent: wayfinder-map
---

## Resolution

**Commit:** `9178992`

**Files changed:**
- `app/Http/Controllers/Kejadian/KejadianController.php` (+exportReportPdf method, fixed export PDF branch, added Pdf import)
- `routes/web.php` (+incidents.show.pdf route)
- `composer.json`, `composer.lock` (+barryvdh/laravel-dompdf)
- `resources/js/pages/disaster/incidents/show.tsx` (Bagikan onClick, Unduh PDF link, Validasi Laporan fix, Check icon)
- `resources/views/pdf/incidents-list.blade.php` (new)

**Fixes:**
1. Bagikan → `navigator.clipboard.writeText(window.location.href)`, "Tersalin" feedback, prompt fallback.
2. Unduh PDF → link to `/cms/incidents/{laporan}/pdf` → `exportReportPdf` via DomPDF (reuses `pdf.laporan` Blade view).
3. Validasi Laporan → `report.id` (numeric) instead of `report.database_id` (decorative `db_lap_*`).
4. Export PDF (index) → real PDF via `pdf.incidents-list` Blade view (landscape A4).

**Side effect:** dompdf was imported in `TrackingController:7` but missing from `composer.json` — latent bug. Composer install now resolves it.

**Skipped:** controller test for `exportReportPdf` (no test infrastructure for these controllers).

## Problem

Four broken items on `/cms/incidents/{laporan}` and `/cms/incidents` (index):

1. **Bagikan button** (`resources/js/pages/disaster/incidents/show.tsx:62-64`) — no onClick.
2. **Unduh PDF button** (`resources/js/pages/disaster/incidents/show.tsx:65-67`) — no onClick, no per-report export route exists.
3. **Validasi Laporan link** (`resources/js/pages/disaster/incidents/show.tsx:286-288`) — uses `report.database_id` which is decorative string like `"db_lap_123"`. `ValidasiController::show` calls `findOrFail($id)` → 404.
4. **Export PDF (index)** (`resources/js/pages/disaster/incidents.tsx:208` + `KejadianController:380-383`) — backend silently rewrites `pdf` → `csv`. Download is CSV with `.xls` extension.

## Fix

### 1. Bagikan

- Add onClick that copies `window.location.href` to clipboard.
- Show toast on success.
- Use `navigator.clipboard.writeText()` with fallback.

### 2. Unduh PDF

- Either: add `GET /cms/incidents/{laporan}/pdf` route → `KejadianController@exportPdf` (use `barryvdh/laravel-dompdf` if installed, else install via composer — `dompdf/dompdf` or use `spatie/laravel-pdf`).
- Or: redirect to existing export endpoint with `format=pdf` after fixing #4.
- Update button onClick to `window.open('/cms/incidents/{kode}/pdf', '_blank')`.

### 3. Validasi Laporan link

- Use `report.id` (numeric `laporan.id`) instead of `report.database_id`.
- Verify `ValidasiController::show` accepts the route binding. Update if needed.

### 4. Export PDF

- Fix `KejadianController::export` lines 380-383 to honor `format=pdf`:
  - `excel` → CSV/XLSX
  - `pdf` → real PDF via DomPDF
- Install `barryvdh/laravel-dompdf` if not present: `composer require barryvdh/laravel-dompdf`.
- Generate PDF from a Blade view `resources/views/cms/incidents/pdf.blade.php`.

## Acceptance

- Click Bagikan → URL copied, toast shown.
- Click Unduh PDF → PDF downloads (or opens in new tab).
- Click Validasi Laporan → loads `/cms/validation/{id}` successfully.
- Click Export PDF on index → real PDF downloads.
- Export Excel still works.

## Verification

- Manual click-through on staging data.
- `php artisan test --compact --filter=KejadianControllerTest`
- If new export route added, test response is `application/pdf`.
