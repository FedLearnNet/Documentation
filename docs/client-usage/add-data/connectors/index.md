---
title: Connectors
sidebar_position: 1
---

# Connectors

A **connector** is a reusable ETL configuration that imports data from a source into a cohort. It defines how source data is extracted, which transformations are applied, and how the resulting fields are mapped to the cohort's schema. Running a connector loads new records or updates existing records without requiring the configuration to be recreated for every import.

## Connector overview

Open a cohort and select **Connector** to view its connectors. The overview shows each connector's name, source type, and latest run, including its completion status. Select a connector's name or **View** to open its configuration and run history.

![Connector overview showing existing connectors, their sources and latest runs, and the Add Connector and Files actions](/img/screenshots/tutorials/walkthrough/client-usage/connectors.png)

Select **Files** to view files uploaded to the cohort. These files can be selected when configuring or running file-based connectors.

## Add a connector

Select **Add Connector** from the connector overview. The dialog provides two ways to add a connector:

![Add connector dialog with options to create a connector manually or import an existing connector](/img/screenshots/tutorials/walkthrough/client-usage/add-connector.png)

- [Create a connector from scratch](create-connector.md) to configure the data source, transformations, and schema mapping step by step.
- [Import an existing connector](import-connector.md) to create a connector from a reusable JSON definition.

Creating or importing a connector saves its configuration. Data is added to the cohort when you [run the connector to import data](../import-data.md).
