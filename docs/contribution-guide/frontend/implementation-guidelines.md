---
title: Implementation Guidelines
sidebar_position: 6
---

Use this page when you already know where the change belongs and want the guardrails that keep frontend work maintainable.

## Working defaults

- change the smallest surface that truly owns the behavior
- keep app-specific routes and flows in `local-app` or `global-app`
- extract shared code only when the second consumer is real or clearly imminent
- keep brand-specific assets, styles, and config out of generic components

## Angular conventions

The workspace matters more than abstract purity. Follow the patterns already established in the module you are changing unless there is a clear reason to modernize it.

Good defaults:

- keep state and side effects close to the feature that owns them
- prefer explicit templates and predictable data flow over clever indirection
- avoid introducing a second abstraction layer just to remove a small amount of duplication
- keep route shells, feature logic, and shared building blocks in their intended layers

## What belongs in `shared-lib`

`shared-lib` should contain code that is genuinely reused or needs one canonical implementation across both apps.

Typical examples:

- reusable components, dialogs, and layout primitives
- shared feature modules
- API wrappers, DTOs, guards, interceptors, pipes, and utility code
- shared styles, brand themes, images, and translations

Keep app-only assumptions out of shared code. If a component only makes sense in one route tree or depends on one app's state model, leave it in that app until the shared shape is obvious.

## UI and UX guardrails

Frontend contributions should make the interface easier to operate, not just technically correct.

- keep primary actions and navigation obvious
- tie validation messages to the actual field or rule that failed
- provide accessible labels, hints, and button text
- handle loading, empty, error, and permission states intentionally
- avoid hardcoding brand visuals, icons, or copy that should come from shared assets or translations

## Component extraction rule

Extract a shared component when all of the following are true:

- the same interaction or layout appears in more than one place
- the behavior is meaningfully the same, not just visually similar
- the extracted API is simpler than leaving two copies behind

If those conditions are not met, duplication is often cheaper than a bad shared abstraction.

## One export detail that is easy to miss

`projects/shared-lib/src/public-api.ts` only needs updates when the shared library surface is consumed outside the workspace or intentionally exposed as part of the library API.

Internal workspace-only helpers do not need to be exported there by default.
