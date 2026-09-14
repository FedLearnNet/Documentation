---
title: What is a Client
sidebar_position: 1
---

# What is a Client?

A **Client** is the self-hosted node a data holder operates within the %%DEPLOYED_PRODUCT_NAME%% network.

It's where local data is prepared, governed, and made available for discovery or analysis — according to rules you define. In short: the Client lets an institution join the network without giving up control over its own data.

This documentation may use the term "FL-Net Client" or simply "Client" because it applies to any network built on the FL-Net software stack. When you join %%DEPLOYED_PRODUCT_NAME%% specifically, your Client is a %%DEPLOYED_PRODUCT_NAME%% Client.

## What a client is responsible for

A client typically handles four things:

1. **Hosting local metadata and data access logic**
2. **Running connectors to import and normalize data**
3. **Publishing enough information for network discovery**
4. **Enforcing what external users and workflows are allowed to do**

The client is not just a passive storage endpoint. It is the governance boundary between your local environment and the rest of the network.

## What you can do with a client

With a client deployment, you can:

- describe your local schema using a shared data standard
- import datasets through connectors
- keep your site visible to the network for discovery
- participate in federated analysis when it is allowed
- manage users and permissions locally

## When you need a client

You should deploy a client if:

- your organization owns data that should stay under local control
- you want to participate in the %%DEPLOYED_PRODUCT_NAME%% network as a data holder
- you need to define institution-specific access rules
- you want your data to remain discoverable over time

If you only need to use already available data and tools, start with [Platform usage](../platform-usage/welcome.md) instead.

## Recommended next steps

As the IT adiminstrator of the Client:
1. [Deploy your client](docs/deployment/deploy-client.md)
2. [Backup your client](docs/deployment/backup-client.md)

As the data administrator adding and managing data:
1. [Create a data standard](create-data-standard.md)
2. [Add data through connectors](add-data/index.md)

As the data access manager handling access and permissions:
1. [Control federated access settings](external-access-management.md)
