---
title: Excel importer
sidebar_position: 2
---

# Excel importer

The Excel importer reads `.xls` and `.xlsx` workbook files. It supports both single-sheet workbooks and multi-sheet workbooks, with the option to merge data across sheets into a single flat dataset.

## Supported file types
The following extension is accepted: `.xlsx`

## Settings

| Setting | Description | Default |
|---|---|---|
| **First Sheet** | Read only the first sheet. Disable to load all sheets. | Enabled |
| **Entire wWorkbook** | Read all sheets. | Disabled |

## Single sheet import

Select **First Sheet** in the connector settings to import a single sheet. The client reads the first sheet of the workbook and presents its columns for configuration.

## Multi-sheet import

When **Entire Workbook** is selected, the client reads all sheets in the workbook. Each sheet becomes a separate table, identified by its sheet name as it appears in the workbook.

This is useful when a single Excel file holds related data across multiple sheets - for example, one sheet has demographic data and the other timeseries with clinical measurements.

### Configuring columns per sheet

Each sheet is configured independently: columns can be renamed or skipped, and each column is mapped to a field in the data standard. Changes to one sheet do not affect others.

### Multi-table merge

When each sheet represents data for the same set of entities (e.g. patients), all sheets can be merged into a single flat dataset.

To set up a merge:

1. Upload a multi-sheet Excel file with **Entire Workbook** selected.
2. Click Merge Sheets.
3. For each sheet, specify which column contains the unique identifier for that sheet (e.g. `Patient ID`). The column name can differ between sheets.
4. Provide a name for the common UID column in the merged output (e.g. `Patient ID`).

The client merges by creating one row per sheet entry. For example, three sheets with 100 rows each produces 300 rows in the merged output - one row per sheet-entry combination, with all columns from all sheets present (empty where a sheet does not have data for a given entry).

#### Example

| Sheet | UID column | Rows |
|---|---|---|
| Demographics | `PatientID` | 150 |
| Lab Results | `Pat_ID` | 150 |

Merged output: 300 rows, with a single `Patient ID` column and all other columns from all three sheets.

### Column order in merged output

The merged dataset uses the column order determined during the initial setup. The UID column always appears first, followed by the remaining columns in the order they were configured. This order is preserved on re-upload.

### Re-uploading

When re-uploading a multi-sheet workbook, the client validates that each sheet in the new file contains the same columns as the original configuration (order-independent). If a sheet is missing or has different columns, the upload is rejected and the existing data is preserved.
