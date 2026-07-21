# Issue Tracker

Tickets live as Markdown files in `docs/agents/issues/`.

Each ticket is a single file named `T##-short-slug.md`. Map (parent) issue is `wayfinder-map.md`.

## Status

- `[ ]` open
- `[~]` in progress
- `[x]` resolved (move to `docs/agents/issues/archive/` after closing)

## Frontmatter

Each ticket includes:

```yaml
---
id: T##
title: ...
status: open
type: single | dependent
parent: wayfinder-map
---
```

## Resolution order

Tickets in `wayfinder-map.md` under "Resolution order". Work top-down; mark in_progress before starting, completed after verification.

## Verification

After resolving a ticket:

1. Run `vendor/bin/pint --dirty --format agent`
2. Run targeted tests (`php artisan test --compact --filter=...`)
3. Update ticket status to `[x]` and append `## Resolution` section with: commit SHA, files changed, test summary
4. Move to `archive/`
