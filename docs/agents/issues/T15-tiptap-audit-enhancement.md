---
id: T15
title: Tiptap audit + enhancement (media library image insert, table support)
status: open
type: single
parent: wayfinder-map
---

## Problem

User asked: "replace all Rich Text Editors with Tiptap". Audit shows:

- `RichTextEditor` (Tiptap-based, `@/components/ui/rich-text-editor.tsx`) already exists.
- Used in: `admin/berita/form.tsx`, `admin/kesiapsiagaan/form.tsx`, `admin/faq/form.tsx`, `disaster/alerts.tsx`.
- Audit found no CMS form using raw `<textarea>` for rich content.

So the migration is mostly done. What remains is enhancement:

1. **Image insert via URL prompt** (line 63-68 in `rich-text-editor.tsx`): `addImage()` uses `window.prompt` for URL. Doesn't integrate with media library.
2. **No table support**: missing `@tiptap/extension-table` family.
3. **No code block with syntax highlighting**: missing `@tiptap/extension-code-block-lowlight`.
4. **No character/word count**: useful for content moderation.
5. **No media embed (YouTube, Twitter)**: `@tiptap/extension-youtube` if needed.

## Fix

### 1. Media library image insert

- Replace `addImage` prompt with a media library picker (T12 picker component).
- On select, insert image with URL from media library.
- Optionally store `media_id` as HTML attribute for tracking.

### 2. Add table support

- Install `@tiptap/extension-table`, `@tiptap/extension-table-row`, `@tiptap/extension-table-cell`, `@tiptap/extension-table-header`.
- Add toolbar buttons: Insert table, Add row/col, Delete row/col.

### 3. Audit full coverage

- Grep for `<textarea` in `resources/js/pages/admin/` and `resources/js/pages/disaster/`.
- For any rich-content textarea, replace with `RichTextEditor`.
- Document any that should stay plain (e.g., short single-line notes).

### 4. Optional: character count, word count

- Add status bar below editor: `1234 chars / 200 words`.

## Acceptance

- Image button in Tiptap opens media library picker.
- Tables can be inserted and edited in any rich-text field.
- No raw `<textarea>` used for rich content (search verifies clean).
- Status bar shows char/word count.

## Verification

- Manual: insert image, insert table in berita form, verify saved HTML renders correctly on public page.
- `php artisan test --compact --filter=` (frontend tests if any)
- Search: `grep -r '<textarea' resources/js/pages/` returns only non-rich fields.
