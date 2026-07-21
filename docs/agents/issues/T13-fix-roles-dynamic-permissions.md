---
id: T13
title: cms/roles — dynamic permissions + remove email-based super-admin
status: open
type: single
parent: wayfinder-map
---

## Problem

`resources/js/pages/admin/roles/index.tsx`:
- Frontend fetches `permissions` prop from backend and renders in modal (lines 234-246).

`app/Http/Controllers/Admin/RoleController.php:22-32`:
- 11 permissions hardcoded in code on every `index()` call when `Permission::count() === 0`.
- No Permission CRUD UI: permissions can only be created via controller's hardcoded list.
- No `app/Models/Permission.php`; uses Spatie's.

`resources/js/layouts/admin/admin-sidebar.tsx:178`:
- `isSuperAdmin = user?.is_admin || user?.email === 'admin@example.com' || user?.email === 'admin@bpbd.id'` — hardcoded emails bypass permission checks. Security smell.

## Fix

### 1. Dynamic permissions from backend

- Add migration: ensure all current permissions are seeded via dedicated seeder, not in controller.
- Move permission list to a config file (`config/permissions.php`) or seeder class.
- Frontend already receives permissions from backend — verify prop name matches controller.

### 2. Permission CRUD UI (optional but recommended)

- Add "Kelola Permission" page under `/cms/roles/permissions`.
- Allow super-admin to create/edit/delete permissions.
- Only super-admin role can access this page.

### 3. Remove email-based super-admin

- Drop email hardcoding in `admin-sidebar.tsx:178`.
- Use Spatie role check: `user->hasRole('super-admin')`.
- Ensure `super-admin` role is seeded with all permissions.

## Acceptance

- Adding a new permission in seeder/config makes it appear in the role modal.
- No permission hardcoded in controller logic.
- Sidebar correctly identifies super-admin by role, not email.
- Optional: super-admin can manage permissions via UI.

## Verification

- `php artisan db:seed --class=PermissionSeeder` — verify seed works.
- `php artisan test --compact --filter=RoleControllerTest`
- Manual: login as super-admin, verify all sidebar items visible.
- Manual: login as regular user, verify permission-filtered sidebar.
