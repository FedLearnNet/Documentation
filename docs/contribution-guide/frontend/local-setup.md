---
title: Local Setup
sidebar_position: 2
---

The frontend workspace is straightforward to install, but not every screen is useful without the matching backend services. Start with the smallest setup that proves your change.

## 1. Install dependencies

Requirements: Node.js 22 LTS (or another version supported by the Angular version used) and npm.

```sh
npm install
```

## 2. Pick the app and product variant

The workspace builds different combinations of:

- app type: `local-app` or `global-app`
- product variant: `FLNet`, `dAIbetes`, `microb-AI-ome`, `posymed`
- target: development, staging, or production

For day-to-day work, start with the dev server script that matches the app and brand you are changing. For the default FL-Net brand:

```sh
npm run start-local-fl-net     # http://localhost:4200
npm run start-global-fl-net    # http://localhost:4201
```

Use the matching script if your task is tied to another brand.

## 3. Know which backend services your screen needs

You can usually boot the shell without every backend running, but feature work often needs the matching APIs.

In plain terms:

- `global-app` depends on services around global learning, project data, and authentication
- `local-app` depends on services around data import, local learning, and authentication

If the UI boots but a page stays empty, verify the backend dependency before assuming the bug is in Angular.

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
