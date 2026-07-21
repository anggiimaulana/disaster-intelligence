---
id: T01
title: Fix 404 image on public news pages
status: resolved
type: single
parent: wayfinder-map
---

## Resolution

**Commit:** `5d814b6`

**Files changed:**
- `app/Http/Controllers/Public/InformationController.php` (+1 import, 3 `imageUrl` lines)
- `app/Http/Controllers/Public/HomeController.php` (1 `imageUrl` line)

**Root cause confirmed:** `thumbnail` column stores full storage-relative path (e.g. `berita/{hash}.png`) from `$request->file('thumbnail')->store('berita', 'public')` in `BeritaController:53`.

**Both bugs were wrong:**
- `InformationController` passed raw `thumbnail` → browser resolved relative to `/public/informasi/berita` → `/public/informasi/berita/{hash}.png` → 404.
- `HomeController` prepended `'berita/'` again → `/storage/berita/berita/{hash}.png` → 404.

**Fix:** `Storage::url($n->thumbnail)` at all 4 sites. Column value already includes folder.

**Audit coverage:** also caught the HomeController double-prefix bug (not in original ticket scope but same family).

**Tests:** no automated tests cover these controllers. Manual verification pending user smoke test on production. Note that 0 records currently have thumbnails in DB — bug only manifests after user uploads.

**Skipped:** auto-test for these controllers (none exist; T01 is infra fix, add test when establishing controller test coverage).
