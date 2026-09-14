---
title: CSV / Delimited file importer
sidebar_position: 1
---

# CSV / Delimited file importer

The CSV importer handles any tabular data stored as plain text with a consistent delimiter between columns. It supports both single-file imports and multi-file imports packaged as a ZIP archive.

## Supported file types

The following file extensions are accepted: `.csv`, `.tsv`, `.txt`, `.psv`, `.dsv`, `.data`, `.dat`, `.tab`

For files using a non-standard delimiter, it can be set explicitly in the connector configuration.

## Single file import

A single delimited text file is uploaded. The client reads it directly and presents the columns for configuration.

### Settings

| Setting | Description | Default |
|---|---|---|
| **Delimiter** | The character separating columns in the file | `,` (comma) |
| **Has header row** | Whether the first row contains column names. If disabled, columns are numbered starting from `0`. | Enabled |

### Column names without a header row

When **Has header row** is disabled, columns are assigned numeric names (`0`, `1`, `2`, ...). These can be renamed to meaningful names in the column configuration step. Those names are then used consistently for schema mapping and future re-uploads.

## Multiple CSV files (ZIP import)

When a dataset is split across several CSV files, they can be packaged into a single `.zip` archive and uploaded together. Each file inside the ZIP becomes a separate table (referred to as a "sheet" in the interface), identified by its filename without extension.

ZIP archives may contain plain `.csv` (or other delimited) files at the top level or in subdirectories

Files that cannot be parsed as delimited text (e.g. binary files, images, metadata files) are silently skipped. A file is also skipped if it contains fewer than two columns, as it is unlikely to be a valid data table.

### Multi-table merge

When data is spread across multiple files and each file shares a common entity (e.g. a patient ID), a merge can be configured so all files are joined into a single flat dataset.

To set up a merge:

1. Select **Multiple CSVs (ZIP)** as the connector type and upload the ZIP file.
2. For each detected file (sheet), specify which column contains the unique identifier for that table.
3. Provide a name for the common Unique Identifier (UID) column in the merged output (e.g. `Patient ID`).

The client produces one row per entry per table. For example, three files with 100 rows each results in a merged dataset of 300 rows - one row per file-entry combination, with columns from all files present (empty where a file does not have data for a given entry).

### Re-uploading

When re-uploading a ZIP, the client validates that each file in the new archive contains the same columns as the original (order-independent). If columns do not match, the upload is rejected and the existing data is preserved.
