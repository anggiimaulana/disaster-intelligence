---
id: wayfinder-map
title: Audit & fix CMS pages, public pages, and RTE migration
status: open
type: map
---

## Destination

Resolve every broken/incomplete CMS page and public page in the user's audit request, plus complete Tiptap migration across CMS forms. End state: every page button works, every form persists data, every public image resolves, every rich-text field uses Tiptap with media-library image insert.

## Resolution order (work top-down)

1. ~~T01 — Fix 404 berita image~~ ✅ `5d814b6` (also fixed HomeController double-prefix)
2. ~~T16 — Verify lacak-laporan title~~ ✅ no-op (title already set at track.tsx:388)
3. ~~T02 — cms/incidents detail: Bagikan, Unduh PDF, Validasi Laporan link, Export PDF silent CSV~~ ✅ `9178992`
4. ~~T03 — cms/validation: inverted button disable, dead modal, switch to Inertia router~~ ✅ `fcbeb95`
5. ~~T04 — cms/settings/pengguna: replace mockup with real user CRUD~~ ✅ `b78d7ce`
6. ~~T05 — cms/settings/integrasi: toggle persistence, JSON round-trip, "Pengaturan Lanjut" button~~ ✅ `e250581`
7. ~~T06 — cms/settings/umum: logo/favicon storage key~~ ✅ `5d8f2c4`
8. ~~T07 — cms/settings/keamanan & peringatan: JSON.parse round-trip~~ ✅ `6c79a4c`
9. ~~T08 — cms/settings shell: tab-switching UI, wire/remove orphaned tab routes~~ ✅ `9e64ef5`
10. ~~T09 — cms/settings/profile: center layout + media library avatar picker~~ ✅ `2ca9dd4`
11. ~~T10 — cms/alerts: responsive popup, quick settings handlers, real notification stats~~ ✅ `d39c064`
12. ~~T11 — cms/disaster-types: icon upload via media library~~ ✅ `6ce91b5`
13. ~~T12 — cms/berita & kesiapsiagaan: icon-mode persistence + media-library picker pattern~~ ✅ `5e6150f`
14. ~~T13 — cms/roles: dynamic permissions + remove email-based super-admin~~ ✅ `cf5634e`
15. ~~T14 — header notifications: full redesign (notification model + mark-read)~~ ✅ `39fc90a`
16. ~~T15 — Tiptap audit + enhancement (media library image insert, table support)~~ ✅ `b23272a`

## Frontiers

See child tickets for individual file:line refs and fix details.

## Notes

- Almost all bugs are client-side or controller-data bugs. Backend routes are intact.
- `cms/settings/*` cluster shares infrastructure: resolve umbrella shell (T08) before leaf tabs.
- Media library needs a picker pattern (T12 establishes it; T09, T11, T15 reuse it).
- T15 closes the loop: Tiptap image insertion should pull from media library, not URL prompt.

## Closing

When all child tickets are `[x]`:

- Move map to `archive/wayfinder-map.md`
- Update `issue-tracker.md` resolution order as completed
- Final verification: full test suite + manual walkthrough of every listed page
