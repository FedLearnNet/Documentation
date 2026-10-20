---
title: Backend Contribution Guide
sidebar_position: 1
---

# Backend
This section is for contributors working on the Java/Quarkus backend services of FL-Net. The backend lives in two repositories:

| Repository | What it contains |
|---|---|
| [Learning-APIs](https://github.com/FedLearnNet/Learning-APIs) | Multi-module Maven project: `core-learning-api` (shared logic and DTOs), `global-learning-api` (Platform), `local-learning-api` (Client, including data import and the patient store), `datamodeler-api` (data models, schemas, and ontologies) |
| [Orchestration-API](https://github.com/FedLearnNet/Orchestration-API) | Runs Tools as Docker containers and tracks their run lifecycle for the local and global Learning APIs. Also used to run the Tool Build pipeline |

## Getting started
For tool builds, vulnerability rescans, and the locally built Orchestration API, follow
[Pipeline integration and local testing](tool-build-pipeline.md).

**Prerequisites:** Java 25 and Docker. The Maven wrapper is included in both repositories. Quarkus Dev Services use Docker to start the databases and, for the Learning APIs, the Orchestration API.

**Learning-APIs:**
```bash
./mvnw clean install                # build all modules and run the tests

# example for the local-learning-api module, similar for the other modules
cd local-learning-api
cp .env.example .env                         # fill in the secrets,
../mvnw compile quarkus:dev          # live reload, Dev UI at /q/dev/
```
The same applies to `global-learning-api`. Development ports: `global-learning-api` 8080, `local-learning-api` 8081, `datamodeler-api` 8086.

**Orchestration-API:**
```bash
./mvnw compile quarkus:dev    # http://localhost:8082 · Dev UI /q/dev/ · Swagger UI /q/swagger-ui
```
Alternatively, `docker compose up --build` runs the API together with PostgreSQL (API on port 8093).

The secrets of all backend services are described in [Environment secrets](env-secrets.md).

**Testing:** run `./mvnw verify` in the repository root (or `mvn test` inside one module). CI runs `mvnw verify`, for `Learning-APIs` including Checkstyle and SpotBugs.

## Datamodeler access
The `datamodeler-api` validates bearer tokens of the Platform Keycloak (`quarkus-oidc`, application type `service`) and has no
browser login of its own. Permissions:
- reads, including schema subscribe/unsubscribe and ontologies/datatypes of subscribed schemas: login only
- create, update, delete of schemas, ontologies, datatypes: realm role `Data-Modeler` (`Roles.GLOBAL_DATA_MODELER`) or `Admin`
- UMLS import and embedding rebuild: `Admin` only

The datamodeler is not exposed on the platform nginx. Callers:
- Global frontend: through the `global-learning-api` under `/api/data-modeler/**` (`DataModelerForwardService`), forwarded with the user's access token.
- `global-learning-api` itself (`QueryBO`, `TestRunBO`, exports): typed REST clients with a service-account token
  (`@OidcClientFilter`, client credentials of `database-api`).
- FL-Net Clients: the same `/api/data-modeler/**` forward with their Platform account token
  (`quarkus.rest-client.global-schema-api.url` defaults to `${quarkus.rest-client.global-api.url}/data-modeler`).
- Local dev: `global-learning-api` calls a locally started datamodeler on port 8086.

## Health endpoints
`/q/*` is blocked on nginx (`/api/q/`, `/local-learning-api/q/`). Docker compose checks `/q/health/live` inside the containers
(curl). The health dashboard of the local frontend uses `GET /local-learning-api/health/ready` (login required), which returns the
same payload as `/q/health/ready` (503 if a check is down).

Schema subscriptions are per Client: the subscriber id is the SHA-256 hash of the token subject. Before, all Clients
shared the subscriber `test-user`, which broke the queryability counts and let one unsubscribe remove the subscription of every
Client. Existing `test-user` subscriptions need a cleanup.

## Configuration files
Each Quarkus service (`local-learning-api`, `global-learning-api`, `datamodeler-api`) splits its configuration. `application.properties`
loads the others via `quarkus.config.locations=security.properties,openapi.properties,flnet.properties`:

| File | Content |
|---|---|
| `application.properties` | all other Quarkus settings, e.g. datasource, REST clients, Hibernate, logging |
| `security.properties` | OIDC, backend-for-frontend (`flnet.bff.*`), service accounts, CORS |
| `openapi.properties` | OpenAPI document and Swagger UI |
| `flnet.properties` | all `flnet.*` properties except `flnet.bff.*` |

- Swagger UI is only included in `dev` and `test` (datamodeler: also `staging`). The local and global API disable the OpenAPI
  document in `prod` and `staging` with `quarkus.smallrye-openapi.enabled=false`, which replaces the deprecated `.enable`.
- The `test` profile uses `quarkus.oidc.application-type=service`, so tests still get `401` for anonymous calls instead of a
  redirect to Keycloak.

## Detailed documentation
- [Environment secrets](env-secrets.md): the secrets each service needs for local development
- [Pipeline integration and local testing](tool-build-pipeline.md): SAST contracts, run modes, local registry and images, scheduled rescans, and container lifecycle cleanup
- [Federated learning flow](federated-learning-flow.md): the complete life cycle of a federated learning run across all services
- `global-learning-api`: [Configuration](global-learning-api/config.md), [Workflow system](global-learning-api/workflow-system.md), [Query creation](global-learning-api/query-creation.md), [Multi-agent analysis system](global-learning-api/data-analysis-agent.md)
- `local-learning-api`: [Configuration](local-learning-api/config.md), [ETL pipeline](local-learning-api/etl-pipeline.md), [Patient store](local-learning-api/patient-store.md), [Query translation and privacy](local-learning-api/query-translation-and-privacy.md)
- [Authentication](../auth.md): the Keycloak clients, roles, backend-for-frontend login and security defaults of the backend services
