---
title: Repository Map
sidebar_position: 3
description: Which FedLearnNet repository owns which part of FL-Net.
---

# Repository map

FL-Net is **not a single monorepo**. All repositories live in the [FedLearnNet GitHub organization](https://github.com/FedLearnNet).
Use this page to answer one practical question quickly:

- which repository owns the part of FL-Net you want to change?

If you want the product-level architecture first, start with [Understanding the network architecture](../intro/architecture/network-architecture.md). If you already know you are touching the Angular UI, also see the [Frontend workspace map](frontend/workspace-map.md).

## Mental model

The repositories are easiest to understand as five layers:

1. **Documentation**
2. **Deployment**
3. **Frontend**
4. **Platform and Client services**
5. **Tool development**

```mermaid
flowchart LR
  subgraph Docs["Documentation"]
    DOCS["Documentation"]
  end

  subgraph Deploy["Deployment"]
    CLI["FL-Net-CLI"]
  end

  subgraph Frontend["Frontend"]
    FE["Frontends"]
  end

  subgraph Services["Platform and Client services"]
    LEARN["Learning-APIs\n(local/global learning, datamodeler)"]
    ORCH["Orchestration-API"]
    COMM["Federated-Learning-Communication-API"]
  end

  subgraph Tooling["Tool development"]
    PYAPI["Python-Tool-API"]
    PIPE["Tool-Build-Pipeline"]
  end

  DOCS -.documents.-> Deploy
  DOCS -.documents.-> Frontend
  DOCS -.documents.-> Services
  DOCS -.documents.-> Tooling
  CLI -.deploys.-> Services
  CLI -.deploys.-> Frontend
```

This diagram is intentionally simplified. It does not contain repository interactions.

## Core product repositories

| Repository | What it owns | When you usually change it |
| --- | --- | --- |
| [Documentation](https://github.com/FedLearnNet/Documentation) | Docusaurus site for Client/Platform usage and deployment documentation. Also contains Tool development and contributors documentation | Writing or restructuring docs, see [Documentation workflow](documentation-workflow.md) |
| [Frontends](https://github.com/FedLearnNet/Frontends) | Angular workspace with the local (Client) and global (Platform) frontends, the shared UI library, and project themes | UI flows, components, routes, frontend integrations, brand variants, see [Frontend](frontend/overview.md) |
| [Learning-APIs](https://github.com/FedLearnNet/Learning-APIs) | Multi-module Quarkus project: `core-learning-api` (shared logic and DTOs), `global-learning-api` (Platform), `local-learning-api` (Client, including data import and the patient store), `datamodeler-api` (data models (schemas) with ontologies and datatypes) | Federated learning flows, queries, workflows, data import, schema and ontology handling |
| [Orchestration-API](https://github.com/FedLearnNet/Orchestration-API) | Runs Tools as Docker containers: pulls images, creates an isolated network and volume per run, starts Tool builds, and tracks the run lifecycle. Also handles the tool build pipeline execution. | Starting runs, container isolation, run lifecycle |
| [Federated-Learning-Communication-API](https://github.com/FedLearnNet/Federated-Learning-Communication-API) | Go services for federated communication: one controller per Client and one relay server per network | Controller and relay behavior, encryption, SMPC and DP message flows |

## Tool development repositories

| Repository | What it owns | Notes |
| --- | --- | --- |
| [Python-Tool-API](https://github.com/FedLearnNet/Python-Tool-API) | Python SDK and runtime for FL-Net Tools, published as the `FL-Net-Python-Tool-API` package | Imported as `pyfedappwrap` |
| [Tool-Build-Pipeline](https://github.com/FedLearnNet/Tool-Build-Pipeline) | Containerized pipeline that builds, tests, scans, and publishes Tool images | Normally started by the Orchestration API when a Tool is published |

See [Tool development](../tool-dev/create-tool.md) for how to use these repositories to create a Tool.

## Deployment repositories

| Repository | What it owns |
| --- | --- |
| [FL-Net-CLI](https://github.com/FedLearnNet/FL-Net-CLI) | The `flnet` command line for setting up and operating Clients and Platforms and for scaffolding new Tools |

See the [Deployment section](../deployment/overview.md) for how these are used.

## Fast path: where should I change what?

- **Documentation**: `Documentation`
- **Angular UI or shared frontend components**: `Frontends`
- **Platform backend behavior (projects, queries, workflows, federated runs)**: `global-learning-api` in `Learning-APIs`, potentially also the `local-learning-api` as the federated runs are executed there.
- **Client backend behavior (data import, patient store, local queries, Tool runs)**: `local-learning-api` in `Learning-APIs`
- **Schema, ontology, or data model work**: `datamodeler-api` in `Learning-APIs`
- **Tool container and pipeline execution and run lifecycle**: `Orchestration-API`
- **Federated communication layer (Controller or relay internals)**: `Federated-Learning-Communication-API`
- **Tool development support**: `Python-Tool-API`, `Tool-Build-Pipeline`
- **Deployment including proxy (NGINX) and oauth (KeyCloak) handling**: `FL-Net-CLI`

