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
| assets like logos or images | `projects/shared-lib/src/assets/images/` set in `/projects/local-app/src/environments` | assets are swapped into app builds |
| translations | `projects/shared-lib/src/assets/i18n` | both apps read from the same translation assets |

## Practical rules

### Put code in an app when

- the feature only exists in one app, e.g. data import in the local app
- route structure is app-specific
- the screen depends on app-only state or app-only backend flows

### Put code in `shared-lib` when

- both apps already need it
- the second app will need it soon and the shared shape is obvious
- the code is generic enough that the app folders should not own it

## If you are still unsure

Start in the route-owning app module, fix the behavior there, and extract only the part that is clearly shared.
