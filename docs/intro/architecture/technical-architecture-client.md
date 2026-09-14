---
title: Client technical architecture 
sidebar_position: 3
---

# Technical architecture of the Client (also called Site)
This document describes the internal structure of the Client, including its components, 
how they interact and how they are deployed. 
It is intended for readers who want to understand the technical details of the Client, including core developers, tool developers, and IT admins considering the security of deploying a Client. 

## Overview
The Client is an ensemble of services that run on a single machine, either on-premise or in the cloud.
These services are either provided by FL-Net or third-party software.
All required services are available as Docker images, and the provided [deployment script](/docs/deployment/deploy-client.md) 
automatically configures everything for deployment via docker compose.
This documentation assumes deployment as described in the [deployment guide](/docs/deployment/deploy-client.md), using the default configuration. 

## Which services get deployed?
The Client is a single-host deployment composed of a small set of runtime services. The services listed here are the default components that make up a standard Client installation and reflect the architecture described in the FL-Net paper and in the network overview.

### FL-Net provided services
1. Local Learning API [Java;Quarkus]: the main local backend service. It manages patient data, data harmonization, DDQ, statistics, local auditing, access control, and federated requests.
2. Orch API [Java;Quarkus]: the orchestration service for ETL and FL workFLows. It prepares the execution environment, starts Tool containers, monitors their status, and returns results to the Local Learning API. To manage Tool containers, it runs as root with access to the host's Docker socket. See the [security model](security-model.md) for the trust implications of this.
3. Instance Manager Frontend [Angular]: the user-facing web interface for local administrators and data managers. It provides access to the Client UI and routes requests to the appropriate backend service.
4. Controller [Go]: the local FL communication component. It handles the secure exchange of model updates and other FL messages between locally running Tools and the Platform-side federated learning channel.

### Third-party services
1. Keycloak: local identity and access management. Each Client deploys its own Keycloak instance to authenticate users and control role-based access.
2. PostgreSQL database: the Client deploys separate PostgreSQL instances for the Local Learning API, the Orch API, and Keycloak. These databases persist patient-related data, orchestration metadata, and identity data.
3. NGINX reverse proxy: part of the Client stack for TLS termination and routing frontend traffic to the correct internal service.

This inventory serves as the deployment view of the Client. The interaction section below explains how these services work together at runtime.


## How do the services interact?
Please refer to the [data flow of the Client](data-flow-client.md) for a detailed description of how data flows in and out of a Client, including which services are involved in each step and authentication information.

### What networks are the services deployed on?
All services run in the same dedicated docker network created on deployment.

However, any Tool container is started in an isolated docker network created per Tool run, attaching the Local Learning API to this network. In case of an FL Tool, the controller is also attached to this network. After the Tool finishes execution, this network is cleaned up. 

For most tools this is an internal network 
with no internet access, but some specific Tools requiring internet or host access may be deployed in a network with internet/host access. Such Tools always require explicit manual approval by the Data Holder before execution, and the Tool's network configuration is documented in the Tool's documentation.
Any automatic approval mechanism is ignored for these Tools.

## How is data persisted?
The database services deployed use named docker volumes to persist data across restarts of the Client:
- `local-learning-api-db-volume`
- `keycloak_postgres_volume`
- `orch-api-db-volume`

An additional named volume, `orch-data-volume`, is used during FL execution, but it is not intended for persistent storage. It's use is documented in the [data flow of the Client](data-flow-client.md).

## How are secrets handled?
Please refer to the [data flow of the Client](data-flow-client.md) for a detailed description of how secrets are handled in the Client.

# Recommended next step

Now that you understand what the Client is and deploys, we recommend you read the [data flow of the Client](data-flow-client.md) to understand which data flows in and out of a Client.
