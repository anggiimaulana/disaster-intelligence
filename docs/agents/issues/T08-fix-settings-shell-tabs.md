---
id: T08
title: cms/settings shell — add tab-switching UI, wire or remove orphaned tab routes
status: open
type: single
parent: wayfinder-map
---

## Problem

Two parallel implementations of CMS settings coexist:

1. `disaster/settings.tsx` — single-page tabbed UI using `?tab=` query, rendered by `/cms/settings/system` → `PengaturanController@index`.
2. Per-tab pages `resources/js/pages/settings/tabs/*.tsx` rendered by separate routes `/cms/settings/{tab}`.

`disaster/settings.tsx:13-60` defines a menu but never renders it as navigation. Users can only switch tabs by editing URL.

Orphaned routes (no link in UI): `settings.log`, `settings.backup`, `settings.master-data/*`, all legacy `settings/{tab}` pages.

## Fix

### Option A: Consolidate on settings.tsx

- Render the menu from `settings.tsx:13-60` as a sidebar or tabs.
- Delete orphaned legacy tab pages and their routes.
- Keep `settings.log`, `settings.backup` if they're meant to exist — add sidebar entry.

### Option B: Consolidate on per-tab routes

- Make `settings.tsx` redirect to the legacy tab pages.
- Add sidebar nav in admin layout.

### Recommendation

Pick A. The `disaster/settings.tsx` + tab components pattern is the modern one. Legacy pages duplicate logic and routes confuse the URL map.

## Acceptance

- Sidebar in `settings.tsx` shows tabs: Umum, AI, Integrasi, Peringatan, Pengguna, Keamanan, Backup, Log.
- Clicking each tab changes content without URL edit.
- Orphaned legacy routes either deleted or linked from sidebar.
- No 404 on any linked settings page.

## Verification

- Manual: navigate each tab from sidebar.
- `php artisan route:list --path=cms/settings` — review route list, remove dead ones.
- `php artisan test --compact --filter=Settings`
