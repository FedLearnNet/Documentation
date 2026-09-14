---
title: Testing and Review
sidebar_position: 7
---

You do not need to run every check for every change, but you do need to run the checks that prove your change is safe.

## Useful commands

```sh
npm run lint-local
npm run lint-global
npm run lint-shared-lib
npm run test
npm run cy:local:run
npm run cy:global:run
```

## What they cover

| Command | What it tells you |
| --- | --- |
| `lint-local` | whether local app TypeScript and templates still pass linting |
| `lint-global` | whether global app code still passes linting |
| `lint-shared-lib` | whether shared library changes still pass linting |
| `test` | whether Angular unit tests still pass |
| `cy:local:run` | whether the local app still boots in the tested Cypress flow |
| `cy:global:run` | whether the global app still boots in the tested Cypress flow |

## What to run for common changes

- changed only `local-app`: run `lint-local`
- changed only `global-app`: run `lint-global`
- changed `shared-lib`: run `lint-shared-lib` and exercise at least one app that uses the changed code
- changed startup, routing, auth, assets, or environment wiring: run the relevant Cypress flow too

## Review checklist

- the code lives in the right app or in `shared-lib`
- no local-only environment tweak was left behind
- the chosen brand still loads the right assets and styles
- the change does not duplicate something already present in `shared-lib`
- the narrowest useful lint and test commands were run

That is the bar worth keeping. It prevents other people from discovering wiring mistakes after merge.
