---
title: Authentication
sidebar_position: 6
description: Overview of the KeyCloak-based authentication system used across the Client and Platform
---

# Authentication system of %%DEPLOYED_PRODUCT_NAME%%
Both the [%%DEPLOYED_PRODUCT_NAME%% Client](../client-usage/welcome.md) and [Platform](../platform-usage/welcome.md)
use their own deployed KeyCloak instance for authentication:
- between services in the Client/Platform
- between the frontend and the backend

For more information, the easiest is to look at the keycloak realms imported by the relevant keycloak:
- Client: [`FLNet_client/keycloak-realms/realm-export.json`](https://github.com/FedLearnNet/FL-Net-CLI/blob/main/src/main/resources/bundles/client/keycloak-realms/realm-export.json) in the Client deployment repository
- Platform: [`FLNET_platform/keycloak-realms/realm-export.json`](https://github.com/FedLearnNet/FL-Net-CLI/blob/main/src/main/resources/bundles/platform/keycloak-realms/realm-export.json) in the Platform deployment repository

# Clients

## %%DEPLOYED_PRODUCT_NAME%% Client (`FLNet-Client` realm)

| Client | Type | Flows | Auth usage |
|---|---|---|---|
| `frontend` | Public | Authorization Code + PKCE (S256) | Angular frontend - needs to authenticate the user for interactions |
| `local-learning-api` | Confidential | Client Credentials (service account) | Local learning backend - needs the service account to know which users exist for the cohort membership feature where users can add other users to their cohort |

## %%DEPLOYED_PRODUCT_NAME%% Platform (`FLNet-Platform` realm)

| Client | Type | Flows | Auth usage |
|---|---|---|---|
| `frontend` | Public | Authorization Code + PKCE (S256), Direct Access Grants | Angular frontend - needs to authenticate the user for interactions |
| `database-api` | Confidential | Authorization Code, Client Credentials (service account) | General global backend (the `global-learning-api`) - needs the service account to receive tokens to give to apps |
| `datamodeler-api` | Confidential | Authorization Code | Datamodeler API - currently doesn't use Auth at all, added already for the future |
| `fl-net-clients` | Public | Direct Access Grants | Used by the FL-Net Clients to authorize towards the Global Learning API of this Platform |

# Auth Flows used

All tokens are signed with RS256.

## Authorization Code Flow (user login) in the frontend

Both `frontend` clients use the **Authorization Code Flow** with **PKCE (S256)**: the user is redirected to Keycloak,
authenticates, and the resulting authorization code is exchanged for an access token and refresh token.

## Client Credentials Grant (service-to-service) for the backend services

`local-learning-api` (Client realm) and `database-api` (this is the `global-learning-api`) (Platform realm) use the **Client Credentials Grant**:
the service authenticates directly with its client secret to obtain an access token without user involvement.
Both have a dedicated service account in their realm.

# Security
- **Token signing:** RS256 on both realms
- **PKCE:** Enforced (S256) on the `frontend` client of both realms
- **Access token lifetime:** 2 hours on both realms
- **Self-registration:** Disabled on both realms - users must be created by an admin
- **Password reset:** Disabled on the Client realm (admin must reset passwords); enabled on the Platform realm
- **SSL:** Required for all external connections on both realms
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

These are deployed in the FLNet-Platform realm.

## Further TODOs
- clean up the platform realm, still contains unused flows etc.
- clean up the token lifetime
- password reset - disable on the platform initially as we don't give a smtp server
