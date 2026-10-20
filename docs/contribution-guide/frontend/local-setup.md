---
title: Local Setup
sidebar_position: 2
---

The frontend workspace is straightforward to install, but not every screen is useful without the matching backend services. Start with the smallest setup that proves your change.

## 1. Install dependencies

Requirements: Node.js (version depends on the Angular version used) and npm.

```sh
npm ci
```

This installs the versions in `package-lock.json`. Repeat it after a dependency upgrade or branch
change if `node_modules` still contains older Angular packages. For example, Angular 21 reports
`$safeNavigationMigration` and `withXhr` as unknown when compiling code migrated to Angular 22.
Both are supported by Angular 22; see its [template migration guide](https://angular.dev/guide/templates/expression-syntax#safe-navigation-migration)
and [HTTP setup guide](https://angular.dev/guide/http/setup#withxhr).

## 2. Pick the app and product variant

The workspace builds different combinations of:

- app type: `local-app` or `global-app`
- product variant: `FLNet`, `dAIbetes`, `microb-AI-ome`, `posymed` (use `FLNet` if you're unsure)
- target: development, staging, or production

For day-to-day work, start with the dev server script that matches the app and brand you are changing. For the default FL-Net brand:

```sh
npm run start-local-fl-net     # http://localhost:4200
npm run start-global-fl-net    # http://localhost:4201
```

Use the matching script if your task is tied to another brand.

For the dAIbetes global frontend, use:

```sh
npm run start-global-dAIbetes
# Equivalent: ng serve --project=global-app --configuration=dAIbetes --port 4201
```

## 3. Know which backend services your screen needs

You can usually boot the shell without every backend running, but feature work often needs the matching APIs.

See the [Repository map](../repository-map.md) and check which service calls your change affects.

The login runs through the learning API (backend-for-frontend), so logging in needs the matching backend: `local-learning-api` on
port 8081 for the local app, `global-learning-api` on port 8080 for the global app.

`ng serve` uses `projects/<app>/proxy.conf.json`, so development is same-origin like behind NGINX and the session cookie works:

| Path | Target |
| --- | --- |
| `/local-learning-api` | `http://localhost:8081` |
| `/api` | `http://localhost:8080` |

The prefix is stripped and WebSockets are proxied as well.

## 4. Be careful with environment files

Environment files live under:

- `projects/local-app/src/environments/<brand>/`
- `projects/global-app/src/environments/<brand>/`

There are separate files per product variant and per target: `environment.ts` (development), `environment.staging.ts` (staging), and `environment.prod.ts` (production). Do not edit them casually unless the task is explicitly about configuration.

Why this matters:

- these files control backend URLs and related runtime settings
- build configurations replace them automatically
- a casual local tweak is easy to forget and push by accident

## 5. Start with the smallest useful setup

When you are new to the workspace:

1. boot one app
2. open the screen you care about
3. only bring up extra services once you know what is missing

That keeps debugging focused and makes missing dependencies easier to spot.
