---
title: Statistics
sidebar_label: Statistics
---

# Statistics

The **Statistics** tab of a cohort opens on the **Data Profile**: a generated summary of every stored field. No configuration is needed.

![Data Profile with summary, Rapid Quality Overview, filters, and field cards](/img/screenshots/tutorials/walkthrough/client-usage/patient-data/statistics-data-profile.png)

## Summary

| Value | Meaning |
|---|---|
| Type badges | Number of fields per data type. |
| **Properties** | Number of profiled fields. |
| **Patients** | Number of patients in the cohort. |
| **Rows scanned** | Number of data rows read. |
| **Total missing** | Number of missing values across all fields. |

## Rapid Quality Overview

One chart for the whole cohort:

- **Top:** box plot per numeric field.
- **Bottom:** value distribution per categorical field.

It shows the fields selected by the filters below.

## Filter the fields

| Control | Options |
|---|---|
| **Search properties** | Filter by field name. |
| **Sort** | Missing first, Most complete, Name, Type. |
| **Density** | Compact or Comfortable cards. |
| Type chips | Show one data type only. |

## Field cards

Each field has a card with its type, row count, missing values, and unique values.

- **Statistics:** Count, Missing, Missing rate, Unique. Numeric fields add Mean, Std, Min, P25, Median, P75, Max. **Compact** shows the first six.
- **Chart:** top values for categorical fields, distribution for numeric fields, coverage for all others.

A high missing rate often points to a [connector](../../add-data/connectors/index.md) mapping problem.

For charts of your own, see [Custom statistics](custom-statistics.md).
