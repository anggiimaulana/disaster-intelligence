---
id: T04
title: cms/settings/pengguna — replace hardcoded mockup with real user CRUD
status: open
type: single
parent: wayfinder-map
---

## Problem

`resources/js/pages/disaster/settings-components/TabPengguna.tsx` is entirely a hardcoded mockup:

- `mockUsers` array (lines 3-8) — never fetched from backend
- "Tambah Pengguna" button — no onClick
- Search input — no onChange/handler
- Role filter select — no onChange
- Per-row action (MoreHorizontal) — no onClick
- Pagination buttons — no onClick
- No `useForm`, no API endpoints consumed

User CRUD routes exist (`admin.roles.users.store`, `admin.roles.users.destroy`) but unused.

## Fix

1. Fetch real users from `/cms/settings/pengguna` (or use existing UserController).
2. Wire search input → client-side filter on results.
3. Wire role filter → server-side filter or client-side filter.
4. Add "Tambah Pengguna" modal: form with nama, email, role (from backend), password.
5. Wire per-row MoreHorizontal menu: Edit, Hapus (with confirm).
6. Wire pagination → use Laravel pagination meta (`links` from Inertia).

## Acceptance

- Page loads real user list from backend.
- Search filters list client-side.
- Add user flow works end-to-end.
- Delete user flow works end-to-end with confirmation modal.
- Empty state shown when no users.

## Verification

- `php artisan test --compact --filter=UserControllerTest` (if exists)
- Manual: add/edit/delete a test user
