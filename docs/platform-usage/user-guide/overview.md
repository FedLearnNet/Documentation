---
id: overview
title: User Guide - Overview
---

The User Guide explains how to use the %%DEPLOYED_PRODUCT_NAME%% network as a **controlled biomedical analysis platform**, not just as a collection of standalone tools.

## What makes the %%DEPLOYED_PRODUCT_NAME%% network different

Compared with a typical research software setup, the %%DEPLOYED_PRODUCT_NAME%% network is designed around:

- **formal tool descriptions** instead of ad hoc parameters
- **containerized execution** instead of local environment drift
- **traceable runs and artifacts** instead of one-off outputs
- **human-supervised AI assistance** instead of unconstrained automation

That means the user interface is built to support a repeatable analysis lifecycle, not just isolated uploads and downloads.

## The main user journey

Most users move through the platform in this order:

1. find relevant data or upload inputs
2. choose a tool or workflow
3. configure inputs and parameters
4. execute the run
5. inspect logs, outputs, and derived artifacts
6. optionally ask the platform for guided interpretation

Each part of the guide expands one part of that journey.

## Roles and permissions

Access is usually controlled through Keycloak-based authentication and group membership.

Depending on your deployment, permissions may affect:

- which tools you can see
- which datasets you can access
- whether you can create or execute projects
- whether you can review or administer runs

If something expected is missing, the cause is often a permission boundary rather than a UI bug.

## Main areas of the platform

### Tool-Store

The Tool-Store is the entry point for discovering tools, models, and reusable workflows.

### Analysis workspace

This is where you configure runs, attach inputs, review parameters, and start execution.

### File and result views

Inputs and outputs are presented with previews, downloads, and analysis-specific renderings where possible.

### Logs and execution status

The platform keeps execution visible through statuses, runtime messages, and produced artifacts.

## Recommended next pages

- [User installation and access](installation.md)
- [Workflow guide](workflow.md)
- [Running apps](running-apps.md)
- [Tool-Store](tool-store.md)
