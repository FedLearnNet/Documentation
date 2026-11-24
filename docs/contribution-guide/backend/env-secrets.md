---
sidebar_position: 2
id: env-secrets
title: Environment Secrets
---

# API Environment Secrets Reference

This page lists the environment variables required for local development of each backend API.
All values are secrets — never commit real values to version control.

Each module contains `.env.example` templates with exactly these variables: copy them and fill in the values.
The `local-learning`, `global-learning`, and `data-modeler` modules live in the
[Learning-APIs](https://github.com/FedLearnNet/Learning-APIs) repository, the `orch-api` in the
[Orchestration-API](https://github.com/FedLearnNet/Orchestration-API) repository.

## Quick Reference

| Variable | local-learning | global-learning | data-modeler | orch-api |
|---|:---:|:---:|:---:|:---:|
| `QUARKUS_OIDC_CREDENTIALS_SECRET` | ✓ | ✓ | | |
| `QUARKUS_KEYCLOAK_ADMIN_CLIENT_CLIENT_SECRET` | ✓ | ✓ | | |
| `QUARKUS_LANGCHAIN4J_OPENAI_API_KEY` | ✓ | ✓ | | |
| `UMLS_API_KEY` | | | ✓ | |
| `PIPELINE_DOCKER_PASSWORD` | | | | ✓ |
| `PIPELINE_REPO_TOKEN` | | optional | | optional |

No token is needed for issue reporting: *Report an issue* in the frontends opens a prefilled issue on
[FedLearnNet/.github](https://github.com/FedLearnNet/.github/issues/new) that the user submits with their own GitHub account.

No registry credentials are needed: the pipeline image on ghcr.io is public, and the local Compose registry (`localhost:5001`) is anonymous.

## local-learning

This file should be named: `.env`
```env
QUARKUS_OIDC_CREDENTIALS_SECRET=SECRET
QUARKUS_KEYCLOAK_ADMIN_CLIENT_CLIENT_SECRET=SECRET
QUARKUS_LANGCHAIN4J_OPENAI_API_KEY=TOKEN
```

The global login for the dev profile defaults to the `test` user in `flnet.properties`.

`compose-devservices.yml` also expects an `orch_secrets.env` (template: `orch_secrets.env.example`). It can stay empty:
the orch-api builds code transformers in local-build mode, which needs no registry login.

## global-learning

This file should be named: `.env`

```env
QUARKUS_OIDC_CREDENTIALS_SECRET=SECRET
QUARKUS_KEYCLOAK_ADMIN_CLIENT_CLIENT_SECRET=SECRET
QUARKUS_LANGCHAIN4J_OPENAI_API_KEY=TOKEN
```

Plus `orch_secrets.env` (template: `orch_secrets.env.example`), used by `compose-devservices.yml` to start the orch-api as a Quarkus Dev Service.
Tool images are pushed to the anonymous local registry, so only the repository token remains:

```env
# optional, only needed to clone private tool repositories
PIPELINE_REPO_TOKEN=TOKEN
```

## data-modeler

This file should be named: `.env`
```env
UMLS_API_KEY=TOKEN
```

## orch-api

This file should be named: `.env` (template: `.env.example`, which also holds the non-secret registry URLs)
```env
PIPELINE_DOCKER_PASSWORD=TOKEN
# optional, only needed to clone private tool repositories
PIPELINE_REPO_TOKEN=TOKEN
```
