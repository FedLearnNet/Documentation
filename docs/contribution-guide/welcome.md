---
title: Welcome
sidebar_position: 1
---

# Welcome
Welcome to the **FL-Net contribution guide**.

This guide is for developers who want to change the **FL-Net software** itself: 
- the Client and Platform services including the frontends
- the federated communication layer
- the Tool handling
- this documentation itself

## Who this is for
- **Backend developers** working on the Java/Quarkus services (Learning APIs, Orchestration API).
- **Frontend developers** working on the Angular workspace that contains the local (Client) and global (Platform) frontends.
- **Developers of the federated communication layer**, the Go-based controller and relay server.
- **Developers of the Tool handling**, e.g. via the Python Tool API and the Tool Build Pipeline.
- **Documentation writers** improving this site.

If you want to contribute by building a Tool for the network rather than changing FL-Net itself, see [Tool development](../tool-dev/create-tool.md) instead.

## How the codebase is organized at a glance
- FL-Net is **not a monorepo**. Each component lives in its own repository in the [FedLearnNet GitHub organization](https://github.com/FedLearnNet), with its own README, CI, and Docker images.
- The **Client** and the **Platform** are built using shared repositories: for example, the `local-learning-api` and `global-learning-api` modules both live in [Learning-APIs](https://github.com/FedLearnNet/Learning-APIs), and the local and global frontends both live in [Frontends](https://github.com/FedLearnNet/Frontends).
- The **federated communication layer** also uses shared repositories: the `controller` and `relay-server` modules both live in [Federated-Learning-Communication-API](https://github.com/FedLearnNet/Federated-Learning-Communication-API).
-The [CLI](https://github.com/FedLearnNet/FL-Net-CLI) securely assembles the published Docker images into a running Client or Platform.

See the [Repository map](repository-map.md) to find out which repository owns which part.

## Quickstart
*If you wish to contribute, please make sure you read in any case the [Development workflow](development-workflow.md)!*

For a **Quickstart**, jump directly to what you need:
- [Quickstart](quickstart.md): prerequisites, getting the code, and running and testing a component locally
- [Repository map](repository-map.md): which repository to change
- [Development workflow](development-workflow.md): issues, branches, pull requests, and CI
- [Documentation workflow](documentation-workflow.md): changing this documentation site

However, we recommend the following reading order for new contributors:
1. [Welcome (you are here)](welcome.md)
2. [Read the general welcome page for FL-Net](../intro/welcome.md)
3. [Optional: Understanding the architecture](../intro/architecture/welcome.md)
4. [Repository map](repository-map.md)
5. [Quickstart](quickstart.md)
6. [Development workflow](development-workflow.md)
7. [Documentation workflow](documentation-workflow.md)
8. One of the detailed sections, depending on your change:
   - [Frontend](frontend/overview.md)
   - Backend: [Environment secrets](backend/env-secrets.md) and [Federated learning flow](backend/federated-learning-flow.md), followed by the `global-learning-api` and `local-learning-api` pages
   - [Authentication](auth.md)
   - [Documentation workflow](documentation-workflow.md)
