---
title: Cohorts
sidebar_label: Cohorts
sidebar_position: 3
---

import CohortSchemaAnimation from '@site/src/components/CohortSchemaAnimation';
import SchemaNodesAnimation from '@site/src/components/CohortSchemaAnimation/SchemaNodesAnimation';

# Cohorts

A **cohort** is a collection of data records managed together within the %%DEPLOYED_PRODUCT_NAME%% Client. It provides a workspace for organizing data, configuring imports, inspecting records, and managing secure federated access. Each cohort is associated with a selected **schema**.

## Schema and cohort

A **schema** and a **cohort** work together but play different roles. The schema describes *what* data looks like; the cohort *holds* the data. Select a tab to compare them.

<CohortSchemaAnimation />

| | Schema | Cohort |
|---|---|---|
| **Purpose** | Data contract: variables, meaning, data types, and validation rules | Workspace that holds and manages patient records |
| **Defined in** | %%DEPLOYED_PRODUCT_NAME%% Platform | %%DEPLOYED_PRODUCT_NAME%% Client |
| **Contains patient data** | No | Yes, stored only in the Client |
| **Created by** | A Platform user with the required permissions | A Client user, by selecting an existing schema |
| **Relationship** | Can be used by many cohorts in many Clients | Is based on exactly one schema |
| **Configured with** | Ontology, datatype, and schema nodes | Connectors, records, queriability, access management, and members |

Because cohorts based on the same schema describe their data the same way, a federated query, statistics request, or training can address the same variable in every cohort. Each cohort still answers from its own records and under its own access and disclosure settings.

### Schema building blocks

A schema is built from three node types.

<SchemaNodesAnimation />

| Node | Defines | Example |
|---|---|---|
| **Ontology** | Meaning | Body Weight |
| **Datatype** | Value type and rules | FLOAT, 0–400 |
| **Schema** | Field position and number of values | Measurements → Body weight, single value |

Queries match fields by ontology and datatype, so cohorts on different schemas stay comparable where these nodes are shared.

### Choosing a schema

Select a schema that covers the information in your data. Source data does not need to match it exactly: connectors can transform the data during import.

Schemas are created on the %%DEPLOYED_PRODUCT_NAME%% Platform by users with the required permissions, not in the Client.

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
| Federated access | Open **Queriability** to set, for each variable, whether a %%DEPLOYED_PRODUCT_NAME%% Platform user can query it and how. See the [federated access documentation](governance/access-management.md#permission-settings) for more information. |
| Manage access | Open **Access management** to configure permissions and disclosure controls. See [federated access settings](governance/access-management.md#permission-settings). |
| Review statistics | Open **Statistics** to inspect summaries of the cohort's data. |
| Manage records | Open **Patients** to view, create, edit, or delete individual records. See [manual record management](add-data/manual-patient-management.md). |
| Review cohort members | Open **Members** to review which other users of your client have access to the cohort. |
| Import or update data | Use **Connector** to configure imports and run them against the cohort. See [adding data through connectors](add-data/index.md). |
| Export data | Use the download action to export cohort data. |
| Delete the cohort | Use the cohort's delete action to remove it from the Client. |

## Allowing secured federated access from the network

Cohort permissions determine how data can be queried or used for statistics and federated analysis. See [Requests](requests/index.md) for reviewing incoming requests, and [Governance](governance/index.md) for access permissions and the management of accepted trainings.
