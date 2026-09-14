---
title: Solutions
sidebar_position: 2
---

# What the %%DEPLOYED_PRODUCT_NAME%% network and the FL-Net software are good for

The %%DEPLOYED_PRODUCT_NAME%% network and the FL-Net software are good for scenarios where teams need more than a single upload-and-run federated framework. They are designed for cases where **data stays distributed**, **governance matters**, and **analysis must remain reproducible**.

It is also designed to be **extensible** on multiple levels: Tools can be added and reviewed, and data can be onboarded even when it differs from existing standards, staying partially to fully compatible through the **Schema** system.

## Join an existing federated network

You can join the %%DEPLOYED_PRODUCT_NAME%% network or any other FL-Net network by deploying your own client as a data holder, making your datasets discoverable without handing over raw data by default.

Typical outcomes:
- Others can discover that your site has relevant data for their research question, but **cannot see the data itself**.
- Access rules remain under your control.
- Federated workflows approved by you can run on your data without you having to write any code. Again, **raw data never leaves your site, only aggregated information**.

Best fit for hospitals, research institutes, and consortia with multiple independent partners.

## Use the platform for governed analysis

If you are a Data Scientist, the %%DEPLOYED_PRODUCT_NAME%% network gives you a structured way to find data relevant to a question, assemble a project around it, run Tools or workflows securely on Clients with explicit parameters, and review outputs, metrics, and generated artifacts.

This is especially useful when you need a repeatable workflow instead of one-off scripts or manual coordination.

## Operate your own deployment

If your organization needs stronger operational control, you can deploy your own FL-Net network. Typical reasons include internal governance requirements, custom authentication and networking, or institution-specific Tool catalogs and integrations.

## Publish Tools for others to use

The %%DEPLOYED_PRODUCT_NAME%% network lets you package your analysis as a reusable Tool that others can run consistently without worrying about the underlying setup. To create one:

1. Start from our Tool template and define its inputs, outputs, and hyperparameters.
2. Fill in the required methods with your Tools logic; the framework handles the rest.
3. The %%DEPLOYED_PRODUCT_NAME%% network builds your Tool into a Docker image and runs it through a security pipeline, giving an independent Auditor what they need to review it.

Tools can cover data transformation, centralized or federated analysis, model training, evaluation, and reporting — with a dedicated federated communication channel available for anything federated learning needs. The security review helps other users trust and adopt your work.

## Contribute to FL-Net itself

If you want to help shape the underlying software rather than deploy or use an instance of it, you can contribute directly to the FL-Net codebase, extending the Client or Platform, fixing bugs, or helping design new capabilities.

This is the right fit for developers who want to influence the foundation that every FL-Net deployment is built on, rather than working within a single deployment.

## Why teams choose the %%DEPLOYED_PRODUCT_NAME%% network or their own FL-Net network

Many federated learning frameworks focus on the training loop: distributing a model, aggregating updates, and securing that exchange. FL-Net starts from the same need but is built around the full lifecycle of a collaborative research project, not just the model-training step within it.

- **Full lifecycle, not just training** FL-Net covers data description, data onboarding and data discovery, security and governance, federated secure execution, and result publication as one connected system — and aims to support collaboration across research projects, not just within a single one.

- **No-code, validated data onboarding** Harmonizing data is a step every federated collaboration requires. In FL-Net, bioinformaticians write the ETL Tools once; non-technical data holders then just run them, without writing or maintaining any code themselves. The modular design keeps this flexible as collaborations and data standards evolve. The audits of the Tools make sure you can trust them.

- **Traceable end-to-end** Federated runs are traceable up to the creation of reusable Inference-Tools from an executed project. This keeps data holders in control of their data and the analysis performed on it, while making the resulting federated analysis easier to publish and reproduce.

## Where to go next

Ready to act on one of these? **[Get Started](get-started.md)** will route you to the right documentation based on your role.
