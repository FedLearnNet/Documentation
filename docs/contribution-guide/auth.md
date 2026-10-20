---
title: Authentication
sidebar_position: 7
description: Overview of the KeyCloak-based authentication system used across the Client and Platform
---

# Authentication system of %%DEPLOYED_PRODUCT_NAME%%
Both the [%%DEPLOYED_PRODUCT_NAME%% Client](../client-usage/welcome.md) and [Platform](../platform-usage/welcome.md)
use their own deployed KeyCloak instance for authentication:
- between services in the Client/Platform
- between the frontend and the backend, via the backend-for-frontend of the Learning APIs

For more information, the easiest is to look at the keycloak realms imported by the relevant keycloak:
- Client: [`FLNet_client/keycloak-realms/realm-export.json`](https://github.com/FedLearnNet/FL-Net-CLI/blob/main/src/main/resources/bundles/client/keycloak-realms/realm-export.json) in the Client deployment repository
- Platform: [`FLNET_platform/keycloak-realms/realm-export.json`](https://github.com/FedLearnNet/FL-Net-CLI/blob/main/src/main/resources/bundles/platform/keycloak-realms/realm-export.json) in the Platform deployment repository

# Clients

## %%DEPLOYED_PRODUCT_NAME%% Client (`FLNet-Client` realm)

| Client | Type | Flows | Auth usage |
|---|---|---|---|
| `frontend` | Public | Authorization Code + PKCE (S256) | No longer used by the Angular frontend, browser login runs through `local-learning-api` |
| `local-learning-api` | Confidential | Authorization Code + PKCE (S256), Client Credentials (service account) | Local learning backend - browser login (backend-for-frontend, redirect URI `${FRONTEND_BASE_URL}/local-learning-api/bff/login`), and the service account to know which users exist for the cohort membership feature where users can add other users to their cohort |

## %%DEPLOYED_PRODUCT_NAME%% Platform (`FLNet-Platform` realm)

| Client | Type | Flows | Auth usage |
|---|---|---|---|
| `frontend` | Public | Authorization Code + PKCE (S256), Direct Access Grants | Angular frontend - needs to authenticate the user for interactions |
| `database-api` | Confidential | Authorization Code + PKCE (S256), Client Credentials (service account) | General global backend (the `global-learning-api`) - browser login (backend-for-frontend, redirect URI `${FRONTEND_BASE_URL}/api/bff/login`), and the service account to receive tokens to give to apps and to call the datamodeler |
| `datamodeler-api` | Confidential | Authorization Code | Datamodeler API - only validates bearer tokens of this realm (`quarkus.oidc.application-type=service`), never logs anyone in |
| `fl-net-clients` | Public | Direct Access Grants | Used by the FL-Net Clients to authorize towards the Global Learning API of this Platform |

# Auth Flows used

All tokens are signed with RS256.

## Authorization Code Flow (user login) through the backend-for-frontend

Browser login uses the **Authorization Code Flow** with **PKCE (S256)**, run by the `local-learning-api` and the
`global-learning-api` as a backend-for-frontend (BFF). Both run Quarkus OIDC in `hybrid` mode: browsers use a session
cookie, services, FL Clients and Tools keep sending Bearer tokens or API keys.

| Endpoint | Security | Purpose |
|---|---|---|
| `/bff/login` | `@Authenticated` | Starts the Keycloak code flow, Keycloak redirects back here, then on to the frontend |
| `/bff/me` | `@Authenticated` | User name, e-mail, names and realm roles of the session |
| `/bff/logout` | `@PermitAll` | RP-initiated logout at Keycloak, then back to the frontend |

- Tokens stay in the backend, in an encrypted HttpOnly session cookie (`SameSite=Lax`, split tokens, refreshed when expired).
  The frontend never sees a token.
- The cookie path is the path under which NGINX serves the service: `/local-learning-api` on the Client, `/api` on the Platform.
- The callback URL is `flnet.bff.frontend-url` (env `FLNET_BFF_FRONTEND_URL`, the public frontend address) plus the cookie path
  plus `/bff/login`. It must match the redirect URI of the Keycloak client exactly.
- `quarkus.oidc.roles.source=accesstoken`: roles come from the access token, since Keycloak puts the realm roles there.
- `java-script-auto-redirect=false`: an XHR request (`X-Requested-With` header) without a session gets `499` instead of a
  redirect to Keycloak. The frontend then sends the browser to `/bff/login` itself.

### CSRF protection

`BffCsrfFilter` rejects state-changing requests (anything but `GET`, `HEAD`, `OPTIONS`) with `403` if they carry the session
cookie, no `Authorization` header, and no `X-Requested-With` header. Browsers only send this custom header cross-origin after a
CORS preflight, which a foreign origin does not pass. Bearer token and Tool API-key callers are not affected.

## Client Credentials Grant (service-to-service) for the backend services

`local-learning-api` (Client realm) and `database-api` (this is the `global-learning-api`) (Platform realm) use the **Client Credentials Grant**:
the service authenticates directly with its client secret to obtain an access token without user involvement.
Both have a dedicated service account in their realm.

## Tool callbacks (API key)

Tool containers call back with a run-scoped `X-API-Key`. `ToolEndpointSecurityPolicy` (one per Learning API, based on
`BaseToolEndpointSecurityPolicy`) only accepts a key on the Tool endpoints of its own run and denies it on every other endpoint.
An endpoint marked `@ToolAuthenticated` therefore also needs a rule in that policy.

# Security
- **Token signing:** RS256 on both realms
- **PKCE:** Enforced (S256) on the `frontend` clients and on the BFF clients `local-learning-api` and `database-api`
- **Access token lifetime:** 2 hours on both realms. Not shortened yet: Quarkus closes a WebSocket when its token expires, so with e.g. 300 s the Client's WebSocket to the Platform and the browser chats would drop every few minutes (see Further TODOs).
- **Self-registration:** Disabled on both realms - users must be created by an admin
- **Password reset:** Disabled on the Client realm (admin must reset passwords); enabled on the Platform realm
- **SSL:** Required for all external connections on both realms
- **REST endpoints:** Require a logged-in user by default (`quarkus.security.jaxrs.default-roles-allowed=**` in the local, global and datamodeler API), so REST endpoints need no `@Authenticated`. Stricter endpoints use `@RolesAllowed`. The only `@PermitAll` endpoint is `/bff/logout`.
- **Annotation placement:** Security annotations (`@RolesAllowed`, `@PermitAll`, `@PermissionsAllowed`, ...) go on the `*ServiceImpl`. Quarkus ignores them on the `*Service` interface, the endpoint then only gets the login default. Exception: `@RolesAllowed(ToolApiKeyAuthenticationMechanism.ROLE)` stays next to `@ToolAuthenticated` on the interface, the tool endpoints are enforced by `ToolEndpointSecurityPolicy`.
- **Audience:** In prod and staging every service only accepts tokens whose `aud` contains its own client id (`quarkus.oidc.token.audience=${quarkus.oidc.client-id}`). Keycloak adds it with audience mappers: on the client `local-learning-api` (Client realm) and with the client scope `flnet-platform-api-audience` (Platform realm, adds `database-api` and `datamodeler-api`) on `database-api` and `fl-net-clients`. Tokens of other clients of the realm (e.g. `frontend`, `admin-cli`) are rejected.
- **Object-level checks (local):** Cohort data needs a cohort membership, the same rule as the cohort list (also for admins). Endpoints with a `cohortId` use `@PermissionsAllowed(CohortPermissionChecker.READ | EDIT | EDIT_PATIENTS | DELETE)`, endpoints with only another id (connector, run, import, patient, permission) check via `CohortMemberAuthBO`. Lists over all cohorts (audit log, query log, connector runs, permissions) only contain the caller's cohorts.
- **WebSockets:** Not covered by this default, each one needs an explicit `@Authenticated` (chats, `TestEmbed`, `/query/clients`).
- **Platform login for Clients:** Mandatory. The store and apps catalogue, the model result upload and `/query/clients` of the `global-learning-api` require a token, so every FL-Net Client logs in with its Platform account.
- **Client secrets:** Injected at deploy time via environment variables (`${LOCAL_LEARNING_SECRET}` on the Client, `${DATABASE_API_SECRET}` and `${DATAMODELER_API_SECRET}` on the Platform) - not stored in the realm export


# Role System (and groups)
We define for the %%DEPLOYED_PRODUCT_NAME%% client and platform specific realm roles over all keycloak clients (these are the specific backend services).
The idea is that these realm roles represent specific personas.

We also have predefined groups that mirror the realm roles one-to-one (e.g. the group `Admin`
has the realm role `Admin` mapped to it). This simplifies user management: when creating a user,
an operator only needs to assign the appropriate group - the required realm roles are then
automatically inherited, without having to manage individual role assignments.

These are the realm roles (and therefore also groups) we use
## %%DEPLOYED_PRODUCT_NAME%% Client roles
- Data-Access-Manager
- Data-Admin
- Admin

These are deployed in the FLNet-Client realm. Please consider that changing anything here 
must be communicated with every already deployed client instance, so it should be avoided.

## %%DEPLOYED_PRODUCT_NAME%% Platform roles
- Admin
- Data-Scientist
- Auditor
- Data-Modeler: create, update and delete schemas, ontologies and datatypes in the datamodeler (`Roles.GLOBAL_DATA_MODELER`)

These are deployed in the FLNet-Platform realm.

## Existing deployments
Keycloak imports the realms only on the first start. Existing deployments apply realm changes in the Keycloak admin console.
For the backend-for-frontend login:
- Client realm, client `local-learning-api`: enable *Standard flow*, valid redirect URI `${FRONTEND_BASE_URL}/local-learning-api/bff/login`,
  valid post logout redirect URI `${FRONTEND_BASE_URL}/`, PKCE method `S256`.
- Platform realm, client `database-api`: the same with redirect URI `${FRONTEND_BASE_URL}/api/bff/login`.
- Platform realm: add the realm role `Data-Modeler` and assign it to the users that maintain schemas.

For the audience check (otherwise every API answers 401):
- Client realm, client `local-learning-api`: *Client scopes* → dedicated scope → *Add mapper* → *Audience*, included client audience
  `local-learning-api`, add to access token.
- Platform realm: create the client scope `flnet-platform-api-audience` with two *Audience* mappers (`database-api`, `datamodeler-api`,
  add to access token) and add it as *Default* client scope to the clients `database-api` and `fl-net-clients`.

## Further TODOs
- clean up the platform realm, still contains unused flows etc.
- shorten the access token lifetime (target 300 s) once WebSockets refresh their token instead of closing on expiry: the Client's `/query/clients` connection via `WebSocketSecurity.updateSecurityIdentity`, the browser chats/`TestEmbed` with a reconnect. Until then 2 hours.
- password reset - disable on the platform initially as we don't give a smtp server
