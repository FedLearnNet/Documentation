---
title: Frontend Contribution Guide
sidebar_position: 1
---

# Frontend
This section is for contributors working on the Angular frontend workspace behind %%DEPLOYED_PRODUCT_NAME%%.

The workspace lives in the [Frontends](https://github.com/FedLearnNet/Frontends) repository and contains two applications and one shared library:
- `local-app`: the frontend of the Client, which talks to the `local-learning-api`
- `global-app`: the frontend of the Platform, which talks to the `global-learning-api` and, forwarded through it, the `datamodeler-api`
- `shared-lib`: components, services, styles, and assets used by both apps

Both apps log in through their learning API (backend-for-frontend, see [Authentication](../auth.md)) and never hold a token.
The auth code lives in `shared-lib`:

| File | Content |
| --- | --- |
| `services/auth.ts` | `login`, `logout`, route guards, `provideBffAuth` |
| `services/auth.helper.ts` | realm roles, the `X-Requested-With` BFF header, `getBffUrl`, account management URL |
| `services/auth-state.service.ts` | `AuthStateService`, loads the user and roles from `/bff/me` |
| `utils/url.helper.ts` | `getAppUrl` and other URL helpers |

`keycloak-js` and `keycloak-angular` are no longer used.

*Report an issue* opens a prefilled issue on [FedLearnNet/.github](https://github.com/FedLearnNet/.github/issues/new), which the user submits with their own GitHub account. No backend call or token is involved.

The prerequisites and the commands to start the apps are in [Local setup](local-setup.md) and the [README](https://github.com/FedLearnNet/Frontends#readme); the checks to run before a review are in [Testing and review](testing-and-review.md).

Most frontend changes come down to two questions:

- which app owns the feature: `local-app`, `global-app` or is it a shared model in `shared-lib`? Sometimes your change might involve all three.
- How can I confirm that my changes work?

## Start here

| If you need to... | Read this page |
| --- | --- |
| boot the right frontend variant locally | [Local setup](local-setup.md) |
| understand the workspace layout | [Workspace map](workspace-map.md) |
| decide which folder should own the change | [Where to change what](where-to-change-what.md) |
| avoid wiring mistakes around builds | [Builds and environments](builds-and-environments.md) |
| follow implementation and UI guardrails | [Implementation guidelines](implementation-guidelines.md) |
| jump straight to a feature area | [Systems overview](systems/overview.md) |
| run the right checks before review | [Testing and review](testing-and-review.md) |

## Operating assumptions

The pages here focus on:

- which folder owns what
- which scripts actually start the app you need
- which environment files get swapped during builds
- which checks are worth running before you hand off a change

When in doubt, start with the narrowest change that fixes the problem, then widen the scope only if both apps or multiple brands genuinely need the same solution.

