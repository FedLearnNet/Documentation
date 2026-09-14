---
title: Where to Change What
sidebar_position: 5
---

This is the page most contributors need once they understand the workspace shape and want to place a change correctly.

## Quick routing table

| If you need to change... | Start here | Reason |
| --- | --- | --- |
| a screen only used by the local frontend | `projects/local-app/src/app/modules` | keeps local logic local |
| a screen only used by the global frontend | `projects/global-app/src/app/modules` | avoids leaking global code into the local app |
| a reusable component, dialog, badge, or layout piece | `projects/shared-lib/src/lib/components` | both apps can consume it |
| shared business logic or API wrappers | `projects/shared-lib/src/lib/services` or shared modules | one implementation is easier to maintain |
| brand-specific styling | `projects/shared-lib/src/lib/styles/<brand>` | builds already switch these styles by configuration |
| brand assets like logos or images | `projects/shared-lib/src/assets/images/<brand>` | assets are swapped into app builds |
| translations | `projects/shared-lib/src/assets/i18n` | both apps read from the same translation assets |

## Practical rules

### Put code in an app when

- the feature only exists in one app
- route structure is app-specific
- the screen depends on app-only state or app-only backend flows

### Put code in `shared-lib` when

- both apps already need it
- the second app will need it soon and the shared shape is obvious
- the code is generic enough that the app folders should not own it

### Do not share too early

Not everything should be moved to the library on day one.

If the local and global versions only look similar but behave differently, keep them separate until the common shape is real. Forced reuse usually creates worse abstractions than a bit of duplication.

## If you are still unsure

Start in the route-owning app module, fix the behavior there, and extract only the part that is clearly shared.

## One detail that is easy to miss

`projects/shared-lib/src/public-api.ts` currently exports only a small part of the library surface.

That matters if:

- the library is consumed outside this workspace
- you add something that should become part of the public library API

If your change is only used inside this workspace, you may not need to export it there at all.
