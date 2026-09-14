---
title: What is the Platform
sidebar_position: 0
---

# What is the Platform?

The %%DEPLOYED_PRODUCT_NAME%% networks **Platform** is the primary interface that Data Scientists and Auditors interact with directly. It gives Data Scientist a shared interface for discovering data, assembling projects, running tools, and reviewing outputs, while Auditors ensure Tools used by Data Scientists are secure and validated.

## What the platform does

At a high level, the platform lets you:

- search metadata across participating sites
- create projects around a concrete scientific question
- run tools and workflows in a governed environment
- inspect outputs, reports, and generated artifacts

The platform is where distributed infrastructure becomes usable for real work.

## What the platform does not replace

The platform does **not** remove local control from data holders.

Instead:

- clients still control local data and permissions
- tool execution still follows explicit contracts
- federated analysis still depends on what each participating site allows

This distinction matters. The platform makes collaboration easier, but it does not bypass governance.

## Typical user journey

Most users follow a pattern like this:

1. Search the network for relevant data
2. Review what is available and what is permitted
3. Create a project for a specific question
4. Select tools or workflows
5. Run the analysis and inspect the outputs

## Who should read this section

This section is for:

- Data Scientist looking for data to run analysis on via workflows of Tools
- project leads coordinating a federated study
- users who need to understand the UI and analysis workflow

If you are a Data Scientist that wants to create your own Tool to incorperate your analysis logic,
please refer to the [Tool development](../tool-dev/create-tool.md) section instead.

## Recommended next steps

1. [Find data across the network](find-data.md)
2. [Create a federated analysis project](create-fl-project.md)
3. [Read the user guide](./user-guide/overview.md)
