---
title: Delimited file extractor
sidebar_position: 1
---

# Delimited file extractor

The delimited file extractor reads tabular text in which a consistent character separates the columns. It supports a single source file or multiple files packaged in a ZIP archive.

## Supported file types

The following file extensions are accepted: `.csv`, `.tsv`, `.txt`, `.psv`, `.dsv`, `.data`, `.dat`, `.tab`

For files using a non-standard delimiter, it can be set explicitly in the connector configuration.

## Single file import

A single delimited text file is uploaded. The Client reads it directly and presents its columns for review in step 3, [**Specify Headers**](../create-connector.md#3-review-headers-and-source-data).

### Settings

| Setting | Description | Default |
|---|---|---|
| **Delimiter** | The character separating columns in the file | `,` (comma) |
| **First row contains column headers** | Whether the first row contains column names. If disabled, columns are numbered starting from `0`. | Enabled |

### Column names without a header row

When **First row contains column headers** is disabled, columns are assigned numeric names (`0`, `1`, `2`, ...). They can be renamed in [**Specify Headers**](../create-connector.md#3-review-headers-and-source-data). The resulting names are used by transformations and schema mapping and remain part of the connector configuration for subsequent imports.

## Multiple files in a ZIP archive

When a dataset is distributed across several delimited files, the files can be packaged in a single `.zip` archive and uploaded together. Each supported file becomes a separate source table identified by its filename without the extension.

ZIP archives may contain delimited files at the top level or in subdirectories.

Entries that cannot be parsed as delimited text, such as binary files, images, or metadata files, are skipped without interrupting analysis. A file containing fewer than two columns is also skipped because it cannot be used as a tabular connector source.

### Multi-table merge

Files in a ZIP archive must be merged into one connector input before their columns can be used together in transformations and schema mapping. The files must share an identifier, such as a patient ID, through which their rows can be associated.

To set up a merge:

1. Select **ZIP archive containing multiple CSV files** and upload the archive.
2. Continue to step 3, [**Specify Headers**](../create-connector.md#3-review-headers-and-source-data), and select the merge button above the table preview.
3. For every source table, select the column containing its unique identifier (UID).
4. Confirm the merge after assigning a UID column to every table.

The tables are combined by matching their UID values. Their data is presented in one merged grid with a single shared UID column. The UID column names in the source files may differ, provided that the selected columns identify the same entities.

### Source requirements for subsequent imports

The connector retains the structure configured from the original source. Every ZIP archive subsequently used with that connector must contain the same files and columns; column order may differ. If the structure does not match, the import is rejected and the existing cohort data is preserved.

For the complete configuration sequence, see [Create a connector from scratch](../create-connector.md).
