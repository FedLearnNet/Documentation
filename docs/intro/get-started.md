---
title: Get Started
sidebar_position: 3
---

# Get started by role

Most confusion at the beginning comes from mixing up different jobs, usually done by different people in a research project. Not sure if the %%DEPLOYED_PRODUCT_NAME%% network or your own FL-Net based network is the right fit yet? See [Solutions](solutions.md) first. Otherwise, use this page to find the right path for your role:

- Self-hosting your own **FL-Net** network and administering it
- Deploying and configuring a **Client**
- Operating a **Client**
- Using the **Platform**
- Building **Tools**
- Contributing to the **FL-Net** codebase itself

Start with the section that matches what you are actually trying to do.

## I want to understand the architecture first
There are two main components to help you understand FL-Net:
1. A [simple graphical overview](graphical-overview.md) of the architecture, showing how FL-Net works without going into deeper details
2. The [architecture documentation](architecture/welcome.md) goes into further details. Read it if you need to decide:
- Whether the security and governance model fits your needs.
- How the %%DEPLOYED_PRODUCT_NAME%% network and the FL-Net software separate discovery, governance, and execution.

## I am a data holder and want to join the network

To join the network you need to deploy your own client, either on your own infrastructure or in a cloud environment.

Refer to [Client deployment](../deployment/deploy-client.md) for instructions on how to deploy a client. That path covers:
- Requirements for deploying a Client.
- Required configuration of the Client.

For details on the security model, refer instead to [Understanding the architecture](architecture/welcome.md).

After deployment, you can continue with [Client usage](../client-usage/welcome.md) to learn how to:
- Define a data standard.
- Import local data through connectors.
- Configure disclosure control.

This is the right starting point for hospitals, institutes, or consortia that want to participate while keeping operational control over their own data.

## I want to search data and run analysis

Read [Platform usage](../platform-usage/welcome.md). That path covers:
- Finding relevant datasets across the network.
- Creating a project around a concrete analysis question.
- Running tools in a governed way.
- Reviewing outputs and iterating on parameters.

This is the right starting point for researchers, analysts, and project leads.

## I want to create or integrate tools

Read [Tool development](../contribution-guide/backend/global-learning-api/intro.md). That path covers:
- The runtime model for tools.
- How to define inputs, outputs, and parameters.
- How to package a reproducible analysis workflow.
- What changes between local development and production execution.

This is the right starting point for developers and research engineers.

## I want to self-host my own deployment of FL-Net

To self-host your own deployment of FL-Net, you need to deploy your own platform and, optionally, one or more clients.

1. First read [Understanding the architecture](architecture/welcome.md) to understand the security and governance model.
2. Then find instructions for deploying the platform in the [Deployment section](../deployment/deploy-global.md).
3. Refer your own partners deploying clients to the [Client deployment section](../deployment/deploy-client.md) for instructions on how to deploy a client — make sure to communicate the correct parameters to them for connecting to your platform.

## I want to contribute to the FL-Net codebase itself

We welcome contributions to the codebase itself. Refer to the [Contribution guide](../contribution-guide/welcome.md) for instructions on how to get started.
