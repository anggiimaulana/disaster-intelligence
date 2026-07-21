---
id: T14
title: header notifications — full redesign (notification model + mark-read)
status: open
type: single
parent: wayfinder-map
---

## Problem

`app/Http/Middleware/HandleInertiaRequests.php:53-72` builds notifications from `AuditLog::orderBy('created_at','desc')->limit(10)->get()` every request. Issues:

1. **All users see same logs**: no per-user scoping, no role scoping.
2. **`read` always false**: hardcoded `'read' => false`; no DB column tracking user-read state.
3. **No `Notification` model / `notifications` table**: no proper notification system.
4. **Header never marks-read**: `resources/js/layouts/admin/admin-header.tsx:91-125` shows bell, click navigates but doesn't POST mark-read.
5. **`url` always null**: `HandleInertiaRequests:70` — links go nowhere meaningful.
6. **Type inference crude**: substring match on action text.

## Decision

Two paths. Pick one before implementing.

### Option A: Real notifications table

- Migration: `notifications` table (user_id, type, data json, read_at, created_at).
- Notification model.
- Service `NotificationService::create(user, type, data)`.
- Trigger from key actions: incident created, validation result, alert published, etc.
- `notifications` route on User model.
- Mark-read endpoint: `POST /cms/notifications/{id}/read` or `POST /cms/notifications/read-all`.
- Middleware returns scoped unread count + last 10.
- Header polls every 30s or uses Echo.

### Option B: Improve audit-log surface

- Add `user_id` to `audit_logs` table if missing.
- Add `seen_by` pivot for read tracking.
- Filter middleware to show only logs the user is allowed to see (e.g., own actions + actions on resources they own).
- Mark-read endpoint similar to Option A but on audit log.

### Recommendation

Option A. It's the standard Laravel pattern (`Notifiable` trait). Audit logs and user notifications are conceptually different things; conflating them causes issues like #1 and #6.

## Acceptance (assuming Option A)

- Migration creates `notifications` table.
- Notifications created on key events (incident, validation, alert).
- Each user sees only their notifications.
- Click notification → marks read + navigates to relevant resource.
- "Mark all as read" button works.
- Unread badge updates without full page reload (polling OK, real-time better).

## Verification

- `php artisan test --compact --filter=NotificationTest`
- Manual: trigger event, verify notification appears for target user only.
- Verify read state persists.
