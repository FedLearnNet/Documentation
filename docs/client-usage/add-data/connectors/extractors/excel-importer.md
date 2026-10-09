---
title: Excel file extractor
sidebar_position: 2
---

# Excel file extractor

The Excel file extractor reads `.xlsx` workbooks. It supports workbooks containing one sheet or multiple sheets. When multiple sheets are loaded, they must be merged into one connector input before transformations and schema mapping.

## Supported file types
The following extension is accepted: `.xlsx`

## Settings

| Setting | Description | Default |
|---|---|---|
| **First Sheet** | Read only the first sheet. Disable to load all sheets. | Enabled |
| **Entire Workbook** | Read all sheets. | Disabled |

## Single sheet import

Select **First Sheet** in the connector settings to load one sheet. The Client reads the first sheet in the workbook and presents its columns for review in step 3, [**Specify Headers**](../create-connector.md#3-review-headers-and-source-data).

## Multi-sheet import

When **Entire Workbook** is selected, the Client reads all sheets in the workbook. Each sheet becomes a separate source table identified by its workbook sheet name.

This is useful when related information is distributed across a workbook—for example, when one sheet contains demographic information and another contains longitudinal clinical measurements.

### Multi-table merge

Sheets loaded from an entire workbook must be merged before their columns become available together in subsequent connector steps. Each sheet must contain an identifier, such as a patient ID, through which its rows can be associated with rows in the other sheets.

To set up a merge:

1. Upload the workbook with **Entire Workbook** selected.
2. Continue to step 3, [**Specify Headers**](../create-connector.md#3-review-headers-and-source-data), and select the merge button above the table preview.
3. For every sheet, select the column containing its unique identifier (UID), such as `Patient ID`. The column name may differ between sheets.
4. Confirm the merge after assigning a UID column to every sheet.

The sheets are combined by matching their UID values. Their data is presented in one merged grid with a single shared UID column. The UID column names may differ between sheets, provided that the selected columns identify the same entities.

#### Example

| Sheet | UID column | Rows |
|---|---|---|
| Demographics | `PatientID` | 150 |
| Lab Results | `Pat_ID` | 150 |

The merged output contains a single shared `Patient ID` column together with the data associated with matching identifiers from both sheets.

### Column order in merged output

The merged dataset uses the column order determined during the initial setup. The UID column always appears first, followed by the remaining columns in the order they were configured. This order is preserved on re-upload.

### Source requirements for subsequent imports

The connector retains the workbook structure configured from the original source. Every workbook subsequently used with that connector must contain the same sheets and columns; column order may differ. If a sheet is missing or its columns do not match, the import is rejected and the existing cohort data is preserved.

For the complete configuration sequence, see [Create a connector from scratch](../create-connector.md).
