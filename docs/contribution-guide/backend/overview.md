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
The README of each repository is the source of truth for the commands below.

**Prerequisites:** Java 25 and Docker. The Maven wrapper is included in both repositories. Quarkus Dev Services use Docker to start the databases and, for the Learning APIs, the Orchestration API.

**Learning-APIs:**
```bash
./mvnw clean install                # build all modules and run the tests

# example for the local-learning-api module, similar for the other modules
cd local-learning-api
cp .env.example .env                         # fill in the secrets,
./mvnw compile quarkus:dev          # live reload, Dev UI at /q/dev/
```
The same applies to `global-learning-api`. Development ports: `global-learning-api` 8080, `local-learning-api` 8081, `datamodeler-api` 8086.

**Orchestration-API:**
```bash
./mvnw compile quarkus:dev    # http://localhost:8082 · Dev UI /q/dev/ · Swagger UI /q/swagger-ui
```
Alternatively, `docker compose up --build` runs the API together with PostgreSQL (API on port 8093).

The secrets of all backend services are described in [Environment secrets](env-secrets.md).

**Testing:** run `./mvnw verify` in the repository root (or `mvn test` inside one module). CI runs `mvnw verify`, for `Learning-APIs` including Checkstyle and SpotBugs.

## Detailed documentation
- [Environment secrets](env-secrets.md): the secrets each service needs for local development
- [Federated learning flow](federated-learning-flow.md): the complete life cycle of a federated learning run across all services
- `global-learning-api`: [Configuration](global-learning-api/config.md), [Workflow system](global-learning-api/workflow-system.md), [Query creation](global-learning-api/query-creation.md), [Multi-agent analysis system](global-learning-api/data-analysis-agent.md)
- `local-learning-api`: [Configuration](local-learning-api/config.md), [ETL pipeline](local-learning-api/etl-pipeline.md), [Patient store](local-learning-api/patient-store.md), [Query translation and privacy](local-learning-api/query-translation-and-privacy.md)
- [Authentication](../auth.md): the Keycloak clients and roles used by the backend services
