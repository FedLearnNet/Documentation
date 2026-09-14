---
title: Authentication
description: Overview of the KeyCloak-based authentication system used across the Client and Platform
---

# Authentication system of %%DEPLOYED_PRODUCT_NAME%%
Both the [%%DEPLOYED_PRODUCT_NAME%% Client](../client-usage/welcome.md) and [Platform](../platform-usage/welcome.md)
use their own deployed KeyCloak instance for authentication:
- between services in the Client/Platform
- between the frontend and the backend

For more information, the easiest is to look at the keycloak realms imported by the relevant keycloak:
- Client: can be found in the [repo for client deployment](https://gitlab.cosy.bio/cosybio/federated-learning/federated_db/feddb-client-deployment)
- Platform: right now is very temporary, for now look at this [realm export](https://gitlab.cosy.bio/cosybio/federated-learning/federated_db/meta/-/blob/main/deployment/currently-deployed/staging.featurecloud.ai/dev.federated-learning.net/keycloak-realms/realm-export.json?ref_type=heads)

# Clients

## %%DEPLOYED_PRODUCT_NAME%% Client (`FLNet-Client` realm)

| Client | Type | Flows | Auth usage |
|---|---|---|---|
| `frontend` | Public | Authorization Code + PKCE (S256) | Angular frontend - needs to authenticate the user for interactions |
| `data-importer-api` | Confidential | None (validates bearer tokens only) | Data importer backend - only has a client as introspection needs a confidential client |
| `local-learning-api` | Confidential | Client Credentials (service account) | Local learning backend - needs the service account to receive tokens to give to apps |

## %%DEPLOYED_PRODUCT_NAME%% Platform (`FederatedLearningNet_Global` realm)

| Client | Type | Flows | Auth usage |
|---|---|---|---|
| `frontend` | Public | Authorization Code | Angular frontend - needs to authenticate the user for interactions |
| `database-api` | Confidential | Client Credentials (service account), Direct Access Grants | General global backend - needs the service account to receive tokens to give to apps  |
| `datamodeler-api` | Confidential | - | Datamodeler API | Currently doesn't use Auth at all, added already for the future

# Auth Flows used

All tokens are signed with RS256.

## Authorization Code Flow (user login) in the frontend

Both `frontend` clients use the **Authorization Code Flow**: the user is redirected to Keycloak,
authenticates, and the resulting authorization code is exchanged for an access token and refresh token.

The Client realm `frontend` additionally enforces **PKCE (S256)** to protect against code interception.
The Platform realm `frontend` does not yet have PKCE configured.

## Client Credentials Grant (service-to-service) for the backend services

`local-learning-api` (Client realm) and `database-api` (this is the `global-learning-api`) (Platform realm) use the **Client Credentials Grant**:
the service authenticates directly with its client secret to obtain an access token without user involvement.
Both have a dedicated service account in their realm.

# Security
- **Token signing:** RS256 on both realms
- **PKCE:** Enforced (S256) on the Client realm `frontend`; not yet configured on the Platform realm `frontend`
- **Access token lifetime:** 5 min (Client realm) / 5 hours (Platform realm - temporary, to be reduced)
- **Self-registration:** Disabled on both realms - users must be created by an admin
- **Password reset:** Disabled on the Client realm (admin must reset passwords); enabled on the Platform realm
- **SSL:** Required for all external connections on both realms
- **Client secrets:** Injected at deploy time via environment variables (`${DATA_IMPORTER_SECRET}`, `${LOCAL_LEARNING_SECRET}`) - not stored in the realm export


# Role System (and groups)
We define for the %%DEPLOYED_PRODUCT_NAME%% client and platform specific realm roles over all keycloak clients (these are the specific backend services).
The idea is that these realm roles represent specific personas.

We also have predefined groups that mirror the realm roles one-to-one (e.g. the group `admin`
has the realm role `admin` mapped to it). This simplifies user management: when creating a user,
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
This system is still not developed. The current temporary roles are:
- admin
- Data-Scientist

These are deployed in the temporary FederatedLearningNet_Global realm.

## Further TODOs
- have deployment repos and correctly link them here
- clean up the platform initial realm, still contains unused flows etc.
    - should ONLY have 
        - auth code flow for frontend (enforce pkce on the platform frontend)
        - Client credentials for the service account of the local/global learning api
- clean up the token lifetime
- password reset - disable on the platform initially as we don't give a smtp server
