---
id: T05
title: cms/settings/integrasi — toggle persistence, JSON round-trip, Pengaturan Lanjut
status: open
type: single
parent: wayfinder-map
---

## Problem

`resources/js/pages/disaster/settings-components/TabIntegrasi.tsx`:

1. **Integration toggles** (lines 23-31, 93-96): 5 cards (WA, n8n, AI, Email, SMS) — `toggleStatus` only flips local state. No API call. No persistence.
2. **JSON round-trip** (line 18): `appSettings?.n8n_endpoints` used as array directly without `JSON.parse`. If `Setting` model casts `value` to JSON, the destructured `.name`/`.url` (lines 134-148) may fail.
3. **"Pengaturan Lanjut" button** (line 91): `<button>` with no `onClick`.

## Fix

### 1. Toggle persistence

- Treat each toggle as a setting key: `integration_wa_enabled`, `integration_n8n_enabled`, etc.
- On change, PATCH/POST `/cms/settings/system` with the key.
- Move toggle state to `useForm` data.

### 2. JSON round-trip

- Check `App\Models\Setting` `$casts` for `value`.
- If cast is `array`, frontend uses it directly (no JSON.parse).
- If cast is `string`/none, frontend must JSON.parse.
- Normalize in a frontend helper: `parseSettingValue(setting): any`.

### 3. Pengaturan Lanjut button

- Decide: link to a new sub-page (`/cms/settings/integrasi/{wa|n8n|ai|email|sms}`) OR open a config modal with detailed fields (API key, webhook URL, etc.).
- Minimum: open modal showing the current config for that integration with edit fields.

## Acceptance

- All 5 toggles persist across page reload.
- n8n endpoints load correctly (no console errors).
- "Pengaturan Lanjut" opens modal or navigates to detail page.
- Saving from Pengaturan Lanjut modal updates the setting.

## Verification

- Manual: toggle each card, refresh, verify state preserved.
- `php artisan test --compact --filter=SettingsControllerTest`
- Console: no JSON.parse errors on load.
