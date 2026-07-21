---
id: T03
title: cms/validation — fix inverted button disable, dead modal, switch to Inertia router
status: resolved
type: single
parent: wayfinder-map
---

## Resolution

**Commit:** TBD (just committed)

**Files changed:**
- `resources/js/pages/disaster/validation.tsx`

**Fixes:**
1. Inverted button disable: `disabled={... || selectedReport.validasi_ai}` → `disabled={... || !selectedReport.validasi_ai}`. Added warning text when AI not ready.
2. Dead `showDetailModal` state removed (unused).
3. Replaced raw `fetch()` with `router.post`/`router.patch`. Added `useForm({ catatan })` for the catatan textarea with error display.

**Note:** Side benefit — `useForm`'s `processing` flag now correctly tracks in-flight requests; the loader shows during actual submission.

**Skipped:** Controller-side tests (none exist for ValidasiController).

## Problem

Three bugs on `/cms/validation` (`resources/js/pages/disaster/validation.tsx`):

1. **Inverted logic** (lines 475, 484, 493, 502): all 4 validation buttons disabled when `selectedReport.validasi_ai === true`. `validasi_ai=true` means AI has finished; admin validation should be *enabled*, not blocked.
2. **Dead state** (line 93): `showDetailModal` declared, `setShowDetailModal` never invoked → modal can never open.
3. **Non-idiomatic mutations** (lines 119-130, 161-170): uses raw `fetch()` with manual CSRF-token DOM lookup instead of `router.post()` / `router.patch()`.

## Fix

### 1. Inverted logic

- Change condition from `disabled={isValidating || selectedReport.validasi_ai}` to `disabled={isValidating || !selectedReport.validasi_ai}`.
- Add tooltip: "Tunggu AI menyelesaikan analisis sebelum validasi" when AI not ready.

### 2. Dead modal

- Either remove `showDetailModal` state and related UI (YAGNI), or wire it to a "Lihat Detail" button on each row.
- Recommend removal unless product confirms intent.

### 3. Switch to Inertia router

- Replace `fetch(POST/PATCH /cms/validation/...)` with `router.post(...)` / `router.patch(...)`.
- Use `useForm` hook if multiple fields.
- Remove manual CSRF lookup; Inertia handles it.

## Acceptance

- Validation buttons enabled for reports where AI finished.
- No console errors on click.
- Modal either removed or functional with a trigger.
- Mutations use `router.post` / `router.patch`.
- Validation error responses (422) surface field errors via `errors` prop from Inertia.

## Verification

- Manual click-through of VALID/INVALID/SPAM/DUPLIKAT on a report with `validasi_ai=true`.
- Test 422 case: submit empty catatan, expect red field error.
- `php artisan test --compact --filter=ValidasiControllerTest`
