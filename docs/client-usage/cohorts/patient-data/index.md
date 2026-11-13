---
title: Patient data
sidebar_label: Patient data
---

# Patient data

Open a cohort from the **Cohorts** page to work with its data. The cohort page groups all features into tabs.

| Tab | Purpose |
|---|---|
| [**Cohort Details**](#cohort-details) | Describe the cohort. |
| [**Schema**](#schema) | Inspect the fields the cohort can hold. |
| [**Queriability**](#queriability) | Set how each field can be queried. |
| [**Access management**](#access-management) | Set who may query or analyze the cohort. |
| [**Statistics**](#statistics) | Explore the stored data. |
| [**Patients**](#patients) | View and edit records. |
| [**Members**](#members) | Set which local users maintain the cohort. |

The header provides the cohort actions:

| Action | Effect |
|---|---|
| **Connector** | Opens the cohort's [connectors](../../add-data/connectors/index.md). |
| Edit | Edits the cohort details. Shown on the **Cohort Details** tab only. |
| Export | Downloads the cohort data after you configure the export. |
| Star | Adds the cohort to the side navigation of this browser. |
| Delete | Deletes the cohort and its records. |

## Cohort Details

Metadata of the cohort: name, description, status, approval date, purpose, citation, copyright, and eligibility criteria. Select Edit to change it.

![Cohort Details tab showing status, approval date, citation, purpose, copyright, and eligibility criteria](/img/screenshots/tutorials/walkthrough/client-usage/cohort.png)

## Schema

The fields of the cohort's [schema](../index.md#schema-and-cohort), with name, description, and data type. Expand a group to see its fields. Switch between table and tree view. The eye icon opens a field's details. The schema is read-only.

![Schema tab with the Demographics group expanded](/img/screenshots/tutorials/walkthrough/client-usage/patient-data/cohort-schema.png)

## Queriability

How Platform users may use each field in queries:

| Option | Allows |
|---|---|
| **Value** | Conditions on the value, such as `Body weight > 80`. Default. |
| **Existence** | Only whether a value exists. |
| **None** | No queries on this field. |

Expand a group, set the option per field, and select **Submit**.

![Queriability tab with a Queryability option per field](/img/screenshots/tutorials/walkthrough/client-usage/patient-data/cohort-queriability.png)

## Access management

Permissions of groups and users for queries, statistics, and training on this cohort. See [Access management](../../governance/access-management.md).

## Statistics

Summaries of the stored data. The tab contains:

- [**Data Profile**](statistics.md): generated for every field.
- [**Custom statistics**](custom-statistics.md): charts you configure, grouped in dashboards.

## Patients

All records of the cohort, identified by their **External Patient ID**.

![Patients tab listing patient records with view, edit, and delete actions](/img/screenshots/tutorials/walkthrough/client-usage/patients.png)

- **Add Patient** creates a record.
- View, edit, or delete a record from its row.
- The grid settings select the visible columns.

See [Create and edit patient records manually](../../add-data/manual-patient-management.md).

## Members

Local users who maintain the cohort. Members can edit the cohort, its records, and its statistics dashboards. The cohort's creator is always a member.

1. Select the add-member icon.
2. Search for a **User** and keep the **Type** MAINTAINER.
3. Select **Add Member**.

![Members tab with the add-member form](/img/screenshots/tutorials/walkthrough/client-usage/patient-data/cohort-members.png)
