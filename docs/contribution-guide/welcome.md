---
title: Welcome
sidebar_position: 1
---

# Welcome
Welcome to the **FL-Net contribution guide**.

This guide is for developers who want to change the **FL-Net software** itself: the Client and Platform services, the frontends, the federated communication layer, the Tool tooling, or this documentation. It is not needed to use or deploy the %%DEPLOYED_PRODUCT_NAME%% network. For that, see the [Introduction](../intro/welcome.md).

## Who this is for
- **Backend developers** working on the Java/Quarkus services (Learning APIs, Orchestration API).
- **Frontend developers** working on the Angular workspace that contains the local (Client) and global (Platform) frontends.
- **Developers of the federated communication layer**, the Go-based controller and relay server.
- **Developers of the Tool tooling**, such as the Python Tool API and the Tool Build Pipeline.
- **Documentation writers** improving this site.

If you want to build a Tool for the network rather than change FL-Net itself, see [Tool development](../tool-dev/create-tool.md) instead.

## How the codebase is organized at a glance
- FL-Net is **not a monorepo**. Each component lives in its own repository in the [FedLearnNet GitHub organization](https://github.com/FedLearnNet), with its own README, CI, and Docker images.
- The **Client** and the **Platform** are built from the same repositories: for example, the `local-learning-api` and `global-learning-api` modules both live in `Learning-APIs`, and the local and global frontends both live in `Frontends`.
- Deployment repositories and the `flnet` CLI assemble the published Docker images into a running Client or Platform.

See the [Repository map](repository-map.md) to find out which repository owns which part.

## Quickstart
For a **Quickstart**, jump directly to what you need:
- [Quickstart](quickstart.md): prerequisites, getting the code, and running and testing a component locally
- [Repository map](repository-map.md): which repository to change
- [Development workflow](development-workflow.md): issues, branches, pull requests, and CI
- [Documentation workflow](documentation-workflow.md): changing this documentation site

However, we recommend the following reading order for new contributors:
1. [Welcome (you are here)](welcome.md)
2. [Optional: Understanding the architecture](../intro/architecture/welcome.md)
3. [Repository map](repository-map.md)
4. [Quickstart](quickstart.md)
5. [Development workflow](development-workflow.md)
6. One of the detailed sections, depending on your change:
   - [Frontend](frontend/overview.md)
   - Backend: [Environment secrets](backend/env-secrets.md) and [Federated learning flow](backend/federated-learning-flow.md), followed by the `global-learning-api` and `local-learning-api` pages
   - [Authentication](auth.md)
   - [Documentation workflow](documentation-workflow.md)

## What contributors should optimize for
When contributing, prioritize:
- reproducibility over convenience shortcuts
- explicit interfaces over implicit behavior
- typed configuration over loosely structured input
- observability over hidden execution

These properties are what make federated runs traceable and trustworthy for data holders.
