---
id: deployment
title: Deployment overview
---

# Deployment overview

%%DEPLOYED_PRODUCT_NAME%% is designed as a controlled platform, which means deployment is part of the product architecture rather than an afterthought.

## Core deployment idea

The platform separates:

- the **control plane**, where definitions, metadata, runs, and state transitions are managed
- the **execution plane**, where containerized tools actually run

This separation is important for both security and maintainability.

## Typical deployment responsibilities

A production-oriented deployment usually needs to provide:

- authentication and authorization
- persistent storage for metadata and artifacts
- a backend API as the stable control layer
- an orchestration service for runtime execution
- a frontend for user interaction

Depending on the environment, these components may be deployed together or split across services.

## Why deployment quality matters

From the perspective of the paper, reproducibility is not only about code. It also depends on:

- stable execution environments
- controlled container images
- explicit versioning
- persistent run state
- observable status transitions

A weak deployment can undermine all of those properties.

## Recommended operational mindset

Treat deployment as support for controlled scientific execution, not just app hosting.

That means you should care about:

- environment consistency
- traceable configuration
- separation of privileges
- monitoring and logs
- safe update procedures
