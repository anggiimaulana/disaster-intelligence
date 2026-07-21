---
id: T10
title: cms/alerts — responsive popup, quick settings handlers, real notification stats
status: open
type: single
parent: wayfinder-map
---

## Problem

`resources/js/pages/disaster/alerts.tsx`:

1. **Popup not responsive** (lines 95, 99): `sm:max-w-[600px]` fixed width, form is single-column with `grid gap-6 py-4`. On desktop all 4 fields stack vertically.
2. **Quick Settings cards** (lines 361-379): 5 cards ("Ambang Batas Risiko", "Template Pesan", "Saluran Notifikasi", "Jadwal & Eskalasi", "Laporan & Evaluasi") with action labels but no `onClick` handlers anywhere.
3. **Mocked notification stats** (`PeringatanController:64-71,124-143`): `distribusiNotifikasi`, `targetNotifikasi`, `notifikasiTerkirim`, `penerimaNotifikasi` are hardcoded zero arrays. Stats grid shows static zeros.

## Fix

### 1. Responsive popup

- Change form to `grid gap-4 sm:grid-cols-2`.
- Fields: Jenis + Level row, Wilayah row, Pesan row (full width).
- Increase dialog max-width to `sm:max-w-[800px]`.

### 2. Quick Settings handlers

- Each card opens a relevant modal or navigates to a tab:
  - "Ambang Batas Risiko" → open modal with risk threshold inputs (or navigate to `cms/settings/peringatan`)
  - "Template Pesan" → modal with template editor (use Tiptap from T15)
  - "Saluran Notifikasi" → modal with channel toggles
  - "Jadwal & Eskalasi" → modal with schedule form
  - "Laporan & Evaluasi" → navigate to reports page or open stats modal

### 3. Real notification stats

- Add migration `add_distribution_columns_to_alerts_table` if needed (distribution stats may be computed at runtime).
- `PeringatanController::index` computes:
  - `distribusiNotifikasi` → group by channel, count success/fail/pending
  - `targetNotifikasi` → query users by role/region
  - `notifikasiTerkirim` trend → last 7 days count per day
  - `penerimaNotifikasi` trend → last 7 days recipients count per day

## Acceptance

- Alert popup has 2-column form on `sm+`, single on mobile.
- Each Quick Settings card opens relevant modal/page.
- Stats grid shows real numbers, not zeros.
- Trend sparklines show real last-7-day data.

## Verification

- Manual: open popup on desktop + mobile viewports, verify layout.
- Click each quick settings card.
- `php artisan test --compact --filter=PeringatanControllerTest`
