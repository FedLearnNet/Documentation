---
title: Cohorts
sidebar_label: Cohorts
sidebar_position: 3
---

# Cohorts

A **cohort** is a collection of data records managed together within the %%DEPLOYED_PRODUCT_NAME%% Client. It provides a workspace for organizing data, configuring imports, inspecting records, and managing secure federated access. Each cohort is associated with a selected **schema**.

## The role of a schema

A schema is the cohort's **data contract**. It defines the structure, meaning, data types, and validation rules the system uses to interpret records. Ontology nodes describe the concepts represented by the data, datatype nodes define value representations and validation rules, and schema nodes organize these definitions into a usable structure.

Select a schema that covers the information available in your data. Your source data does not need to match the schema exactly: connectors can transform the data during import so that it fits the schema.

If no suitable schema exists, create one on the %%DEPLOYED_PRODUCT_NAME%% Platform using an account with the relevant permissions, or contact someone with the required access to create it for you. Schema creation is not available in the Client.

## Create a cohort

The **Cohorts** page displays existing cohorts and provides the **New Cohort** action.

![Cohorts overview showing the cohort grid and New Cohort button](/img/screenshots/tutorials/walkthrough/client-usage/cohorts.png)

Create a cohort before adding data:

1. Open **Cohort** in the Client and select **New Cohort**.
2. Select an appropriate schema and click **View**.
3. Review the cohort name and description, adjust them for your local use case, and select **Create**.

The new cohort provides a workspace associated with the selected schema. Creating it does not import data.

## Manage a cohort

Select a cohort from the overview to open its workspace.

![Selected US-130 cohort showing its details, management tabs, and cohort actions](/img/screenshots/tutorials/walkthrough/client-usage/cohort.png)

| Operation | Description |
|---|---|
| Review or edit cohort details | Open **Cohort Details** to review metadata, including status, purpose, citation, copyright information, and eligibility criteria. Use the cohort's edit action to update its details. |
| Inspect the schema | Open **Schema** to review the structure and definitions used for the cohort's data. |
| Federated access | Open **Queriability** to set, for each variable, whether a %%DEPLOYED_PRODUCT_NAME%% Platform user can query it and how. See the [federated access documentation](governance.md#manage-access-permissions) for more information. |
| Manage access | Open **Access management** to configure permissions and disclosure controls. See [federated access settings](governance.md#manage-access-permissions). |
| Review statistics | Open **Statistics** to inspect summaries of the cohort's data. |
| Manage records | Open **Patients** to view, create, edit, or delete individual records. See [manual record management](add-data/manual-patient-management.md). |
| Review cohort members | Open **Members** to review cohort membership. |
| Import or update data | Use **Connector** to configure imports and run them against the cohort. See [adding data through connectors](add-data/index.md). |
| Export data | Use the download action to export cohort data. |
| Delete the cohort | Use the cohort's delete action to remove it from the Client. |

## Use cohort data in the network

Cohort permissions determine how data can be queried or used for statistics and federated analysis. See [Requests and governance](governance.md) for an overview of access permissions, incoming requests, and the management of accepted trainings.
