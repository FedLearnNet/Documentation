---
sidebar_position: 2
id: env-secrets
title: Environment Secrets
---

# API Environment Secrets Reference

This page lists the environment variables required for local development of each backend API.
All values are secrets — never commit real values to version control.

## Quick Reference

| Variable | local-learning | global-learning | data-modeler | orch-api |
|---|:---:|:---:|:---:|:---:|
| `FLNET_GITLAB_ISSUE_TOKEN` | ✓ | ✓ | | |
| `QUARKUS_OIDC_CREDENTIALS_SECRET` | ✓ | ✓ | | |
| `QUARKUS_KEYCLOAK_ADMIN_CLIENT_CLIENT_SECRET` | ✓ | ✓ | | |
| `QUARKUS_LANGCHAIN4J_OPENAI_API_KEY` | | ✓ | | |
| `UMLS_API_KEY` | | | ✓ | |
| `ORCH_DOCKER__GITLAB__REGISTRY_PASSWORD` | ✓ | ✓ | | ✓ |
| `ORCH_DOCKER__FEATURECLOUD__REGISTRY_PASSWORD` | ✓ | ✓ | | ✓ |
| `PIPELINE_DOCKER_PASSWORD` | ✓ | ✓ | | ✓ |
| `PIPELINE_REPO_TOKEN` | ✓ | ✓ | | ✓ |

## local-learning

This file should be named: `.env`
```env
FLNET_GITLAB_ISSUE_TOKEN=TOKEN
QUARKUS_OIDC_CREDENTIALS_SECRET=SECRET
QUARKUS_KEYCLOAK_ADMIN_CLIENT_CLIENT_SECRET=SECRET
```

Plus the shared [orch secrets](#orch-secrets) below, name this `orch-secrets.env`.

## global-learning

This file should be named: `.env`

```env
QUARKUS_LANGCHAIN4J_OPENAI_API_KEY=TOKEN
FLNET_GITLAB_ISSUE_TOKEN=TOKEN
QUARKUS_OIDC_CREDENTIALS_SECRET=TOKEN
QUARKUS_KEYCLOAK_ADMIN_CLIENT_CLIENT_SECRET=TOKEN
```

Plus the shared [orch secrets](#orch-secrets) below, name this `orch-secrets.env`.

## data-modeler

This file should be named: `.env`
```env
UMLS_API_KEY=TOKEN
```

## orch-api

The orch-api requires the shared [orch secrets](#orch-secrets) listed below.

This file should be named: `.env`

## Orch Secrets

Both `local-learning` and `global-learning` need these in addition to their own variables.
The `orch-api` project also requires the same set.

```env
ORCH_DOCKER__GITLAB__REGISTRY_PASSWORD=TOKEN
ORCH_DOCKER__FEATURECLOUD__REGISTRY_PASSWORD=TOKEN

PIPELINE_DOCKER_PASSWORD=TOKEN
PIPELINE_REPO_TOKEN=TOKEN
```
