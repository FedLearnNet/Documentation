---
title: Welcome
sidebar_position: 1
displayed_sidebar: introSidebar
---

# Welcome
Welcome to the **%%DEPLOYED_PRODUCT_NAME%% network** and **FL-Net software** documentation.

**%%DEPLOYED_PRODUCT_NAME%%** is a deployed network for secure, collaborative research on sensitive data. Its goal is to make cross-institution analysis possible while keeping data local and under the strict control of the data holder. This network uses the FL-Net software stack.

**FL-Net** provides the software foundation for the %%DEPLOYED_PRODUCT_NAME%% network in a star-shaped network architecture:
- A **Client** encapsulates the local data and governance rules of a participating institution, supporting it with modular data-loading functionality. Many **Clients** can exist in one network. **Clients** connect only to the **Platform**, never to each other, and only exchange federated summary information, not raw data.
- A **Platform** provides discovery of relevant data and user interaction for Data Scientists over all connected **Clients**. Only one **Platform** exists in a network.

This documentation covers both the %%DEPLOYED_PRODUCT_NAME%% network and the FL-Net software stack, allowing you to understand the deployed %%DEPLOYED_PRODUCT_NAME%% network but also how another FL-Net based network could be deployed.

## Terminology
- **Client / Site** — *Client* refers to the software; *Site* refers to the general physical or institutional place where that software runs.
- **%%DEPLOYED_PRODUCT_NAME%% / FL-Net** — *%%DEPLOYED_PRODUCT_NAME%%* refers to the deployed network; *FL-Net* refers to the underlying software. The network is built on the software, so, for example, a %%DEPLOYED_PRODUCT_NAME%% Client is automatically also an FL-Net Client. When joining any FL-Net network, you always deploy an FL-Net Client and during deployment then join the specific network, e.g. the %%DEPLOYED_PRODUCT_NAME%% network. The FL-Net software stack is open-source and can be used to deploy other networks as well.
- **Platform** — The central coordination node that Clients connect to, providing discovery and user interaction for Data Scientists. *Network* refers to the network as a whole, but "network" and "platform" may be used interchangeably in some contexts, since the Platform is the entry point to the network.

## Who this is for
- **Data holders** who want to join the network by deploying their own **Client** while keeping local control over data, access, and approvals.
- **Data Scientists** who want to discover relevant datasets, request and run analyses, and inspect reproducible outputs.
- **Tool developers and auditors** who create, validate, and publish reusable ETL-Tools (Extract, Transform, Load), FL-Tools (Federated Learning), and Inference-Tools.
- **FL-Net developers** who want to contribute directly to the codebase itself.

## How FL-Net works at a glance
- Data stays local at each participating institution's **Client**.
- The **Platform** provides discovery and federated learning access to the data while keeping data holders in control of what is shared and how it is used.
  - Data discovery is secured on each **Client** at multiple levels, such as rounding, thresholds, and minimum response time.
  - Federated runs execute only within locally approved boundaries and isolated environments, using secure and vetted tools.
- Results and artifacts are traceable for reproducibility and transparency while staying limited to the approved user group.

This separation of concerns between **Clients** and the **Platform** is what allows the %%DEPLOYED_PRODUCT_NAME%% network and FL-Net software to balance usability, collaboration, and governance.

## Quickstart
For a **Quickstart**, you can jump directly to the relevant section for your role:
- [Client deployment if you want to deploy your own FL-Net Client](docs/deployment/deploy-client.md)
- [Client usage if you want to understand how to add and control data on your FL-Net Client](docs/client-usage/welcome.md)
- [Platform usage if you want to understand how to discover and analyze data on the FL-Net Network](docs/platform-usage/welcome.md)
- [Tool development if you want to develop and contribute new tools to the FL-Net Network](../tool-dev/create-tool.md)

However, we recommend instead the following reading order for new users, understanding %%DEPLOYED_PRODUCT_NAME%% and FL-Net first and then jumping to the relevant sections for your role:
1. [Welcome (you are here)](welcome.md)
2. [Solutions](solutions.md)
3. [Get Started](get-started.md)
4. [Graphical overview](graphical-overview.md)
5. [Optional: Understanding the architecture](architecture/welcome.md)
6. One of:
   - [Client deployment](../deployment/deploy-client.md)
   - [Client usage](../client-usage/welcome.md)
   - [Platform usage](../platform-usage/welcome.md)
   - [Tool development](../contribution-guide/backend/global-learning-api/intro.md)

## Relationship to PoSyMed
FL-Net does not implement Workflow or Tool execution itself — instead, it builds on [**PoSyMed<sup>1</sup>**](https://arxiv.org/abs/2604.20906), a workflow execution engine. In PoSyMed, Tools are assembled into a directed acyclic graph describing a Workflow, with clear input and output mapping between Tools. Tools are instances with clearly defined Inputs, Outputs, and Hyperparameters. PoSyMed also includes a Tool and Workflow Store, along with an isolated execution engine.

**FL-Net** uses **PoSyMed** under the hood for all Workflow and Tool execution, as well as the basis for the Tool and Workflow Store, expanding it with federated capabilities and further features.

[comment]: <> (TODO: Add link to the journal paper once it is published)
[comment]: <> (TODO: Add FL-Net paper reference once preprinted/published)

*1. Süwer, Simon, et al. "Biomedical systems biology workflow orchestration and execution with PoSyMed." arXiv preprint arXiv:2604.20906 (2026).*
