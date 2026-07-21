---
id: T07
title: cms/settings/keamanan & peringatan — fix JSON.parse round-trip
status: open
type: single
parent: wayfinder-map
---

## Problem

`resources/js/pages/disaster/settings-components/TabKeamanan.tsx:7` does `JSON.parse(appSettings.security_2fa_methods)`.

`resources/js/pages/disaster/settings-components/TabPeringatan.tsx:23-24` does `JSON.parse(appSettings.risk_thresholds)` and `JSON.parse(appSettings.notif_channels)`.

If `App\Models\Setting` casts `value` to array (JSON cast), `JSON.parse` throws on objects/arrays. If stored as raw string, the parse succeeds.

## Fix

1. Check `App\Models\Setting` `$casts` for `value` and any `*_json` columns.
2. Add frontend helper `parseSettingValue(value): any` that handles both shapes safely.
3. Replace direct `JSON.parse(appSettings.X)` calls with `parseSettingValue(appSettings.X)` in all three tabs.
4. On save, ensure the value is sent as a JSON string in form data (`JSON.stringify` then include), OR as native array if backend cast expects array.

## Acceptance

- All three tabs load without console errors on every setting.
- Save preserves all fields.
- Round-trip (save → reload → edit → save) preserves structure.

## Verification

- Manual: load each tab, verify no red error banner.
- Set a multi-method 2FA config, reload, verify it loads.
