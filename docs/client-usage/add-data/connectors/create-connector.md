---
title: Create a connector from scratch
sidebar_position: 2
---

import mergeFilesImage from '@site/static/img/screenshots/tutorials/walkthrough/client-usage/merge-files.png';
import saveConnectorImage from '@site/static/img/screenshots/tutorials/walkthrough/client-usage/save-connector.png';

# Create a connector from scratch

A connector defines how data is extracted from a source, transformed into the required representation, and mapped to the schema selected for the cohort. An existing cohort is therefore required before a connector can be created.

Open the cohort's [connector overview](index.md), select **Add Connector**, and choose **Create manually**. The configuration wizard guides you through source selection, source settings, header review, optional transformations, and schema mapping.

## 1. Select the data source

The first step determines where the connector obtains its input data.

![Connector source selection showing file import and available extractor tools](/img/screenshots/tutorials/walkthrough/client-usage/connector-select-source.png)

The current release supports two source types:

- **File Import:** Upload a supported tabular file from the local system.
- **Database:** Select **SqlSelectExtractor** to obtain data by executing a read-only SQL `SELECT` statement against a configured database connection.

The source-selection screen may display additional options that are planned for later releases. Future versions are expected to support sources such as APIs and FTP/SFTP servers.

## 2. Configure the source

The settings shown in the second step depend on the selected source.

### File source

Select or drag a file into the **Upload source file** dialog, then specify how the file must be interpreted. For a delimited file, configure its delimiter, indicate whether the first row contains column headers, and select whether the source is a single file or a ZIP archive containing multiple files.

![Upload source file dialog with delimited-file interpretation settings](/img/screenshots/tutorials/walkthrough/client-usage/uploade-source-file%201_2.png)

Select **Upload and analyze**. The Client reads the source and presents the detected tables, row counts, columns, a bounded preview, and column statistics. For a ZIP archive, each supported file is presented as a separate table. Review the analysis and select **Use file**.

![Analyzed ZIP source showing its detected tables and the Use file action](/img/screenshots/tutorials/walkthrough/client-usage/uploade-source-file%202_2.png)

For detailed settings and supported formats, see the [delimited file extractor](extractors/csv-importer.md), [Excel file extractor](extractors/excel-importer.md), and [input data formatting guidelines](input-checklist.md).

### Database source

When **SqlSelectExtractor** is selected, configure the database connection and provide the read-only SQL `SELECT` statement to execute.

![SqlSelectExtractor settings for an SQL query and database connection](/img/screenshots/tutorials/walkthrough/client-usage/database-source.png)

The extractor executes the query and uses its tabular result as the connector input. See [SQL SELECT extractor](extractors/sql-select-extractor.md) for the required connection settings and query guidance.

## 3. Review headers and source data

The **Specify Headers** step provides a preview of the input before transformations and mapping. The preview contains all detected columns and a limited number of rows; it is intended for structural review rather than inspection of the complete dataset.

![Specify Headers step showing source tables, column headers, and a bounded data preview](/img/screenshots/tutorials/walkthrough/client-usage/specify-headers.png)

Review the column names and rename them where necessary. The resulting names are used in transformations and schema mapping.

### Merge multiple files or sheets

If a ZIP source contains multiple files, or an Excel workbook uses multiple sheets, they must be merged into one connector input. This step is mandatory before columns from the separate files or sheets become available together in the transformation and mapping steps.

In step 3, **Specify Headers**, select the merge button above the table preview. This button is used to merge both multiple files and multiple sheets from an Excel workbook. Choose the unique identifier (UID) column for every file or sheet. The data is combined by matching values in these identifier columns, and the result contains one shared identifier column.

<img
  src={mergeFilesImage}
  alt="Merge Multiple CSV Files dialog with a UID column selected for each table"
  style={{display: 'block', width: '440px', maxWidth: '100%', margin: '0 auto'}}
/>

Use identifier columns that represent the same entity in every file or sheet, even when their original column names differ.

## 4. Add transformations

Transformations are optional operations applied after extraction and before schema mapping and validation. Use them to convert the source into the representation expected by the schema—for example, to normalize boolean values, convert units or dates, split combined values, replace placeholders, or reshape the data.

![Transformation selection showing built-in transformations and app tools](/img/screenshots/tutorials/walkthrough/client-usage/transformations.png)

Two transformation sources are available:

- **Built-in transformations** are managed transformation functions provided directly by the Client. They can operate on individual cells or complete rows.
- **App tools** are installed transformation applications. They support reusable or domain-specific processing that is not provided by a built-in transformation.

The available transformations depend on the Client configuration, and installations may provide their own app tools. This guide does not list every transformation. Developers who need custom processing can follow the [tool development guide](../../../tool-dev/create-tool.md), including its section on [transformer apps](../../../tool-dev/create-tool.md#transformer-app-rowcell-transform-on-a-dataframe).

After adding a transformation, review its output before continuing. The transformed columns are the inputs available to the mapper.

## 5. Map source fields to the schema

The mapper associates each source column with the patient field represented by a schema node. Select **Map to Field** for a column and choose the corresponding field from the cohort's schema. A source column can be mapped to one schema field.

![Schema mapping step showing source columns, sample values, field mappings, and validation status](/img/screenshots/tutorials/walkthrough/client-usage/map-fields.png)

The mapper displays sample data and validates mapped values against the selected schema field. Review invalid mappings and add or adjust transformations when the source representation does not satisfy the schema. **Suggest mapping** can propose mappings, but every proposed mapping should be reviewed before saving.

Schema nodes can be configured to accept a single value or multiple values. A multi-value node can collect values found in separate source rows for the same patient—for example, multiple diagnoses or medications. Mapping must therefore reflect both the clinical meaning of the source column and the value structure defined by the schema.

### Map longitudinal and time-series data

For observations associated with visits or points in time, use **Map to Visit/Time**. Configure the source column that identifies the visit or series entry and the column containing its date or timestamp. These columns provide the context used to associate repeated values with the correct patient and observation time.

Columns used only as visit identifiers or timestamps provide mapping context and are not themselves mapped as patient values. See [Data validation and normalization](../input_validation.md) for supported value representations and longitudinal-data behavior.

## 6. Save the connector

After completing the mapping, select **Save** or **Save and Run**. Enter a required connector name and an optional description, then confirm the dialog.

<img
  src={saveConnectorImage}
  alt="Save Connector dialog requesting a connector name and description"
  style={{display: 'block', width: '440px', maxWidth: '100%', margin: '0 auto'}}
/>

- **Save** stores the configuration and returns to the connector overview without importing data.
- **Save and Run** stores the configuration and opens the newly created connector so that an import can be started.

Saving a connector does not itself add patient data. Continue with [Import data by running a connector](../import-data.md) to select the run options and review the import results.
