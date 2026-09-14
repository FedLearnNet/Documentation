---
title: Creating a Connector from Scratch
sidebar_position: 3
---
## File Import Settings (Extract)

The first step is selecting the file to import and specifying how it should be read. The file is uploaded to the client and stored server-side, associated with the cohort.
Different settings are displayed based on which filetype is selected from `Excel`, `CSV`, `JSON`.
For more information please read the relevant connector documentation:
-  [CSV / Delimited connector](extractors/csv-importer)
-  [Excel connector](extractors/excel-importer)

Furthermore, an extraction tool can be used. This can be used also for e.g. import from a
database or other, more complex data inputs.

## Specify Headers

After the file is read, the detected columns are listed. This step allows reviewing and adjusting column names before mapping:

- **Rename** a column to a more meaningful name. Renamed names carry forward into the mapper and into future re-uploads.
- When **Has header row** is disabled, columns are assigned numeric names (`0`, `1`, `2`, ...) which can be renamed here.

## Transformation (Transform)

Optionally, transformation tools can be selected. Examples for this is e.g. a conversion from 
pounds to kg.

## Mapper

The mapper step assigns each source column to a field in the data standard. The mapper presents a table with all columns and a sample value from the first row of the file.

For each column, the corresponding field in the schema tree is selected using the **Map to Field** option.
When mapping, we show a preview of the normalization and validation later done on one sample value.
You can find more information on the validation in the [guidelines](input_checklist) and 
[extensive validation rules](input_validation) documentation.

### Timeseries mapping

When a column contains **multiple measurements per patient recorded over time** (e.g. serial lab results), it should be mapped as a timeseries.

A timeseries mapping tells the importer that values in that column are time-anchored, so each measurement is stored individually with its point in time rather than overwriting a single value per patient.

To configure a timeseries mapping, use the **Map to Visit/Time** option for the relevant column. A dialog will ask for:

| Field | Description |
|---|---|
| **Visit** | The column that identifies a visit or session. Measurements sharing the same visit ID are grouped together. Useful when multiple readings belong to the same clinical encounter. |
| **Time** | The column in the file that contains the date or datetime of each measurement. Used to order records chronologically and align series across patients. |
| **Timestamp format** | The format of the timestamp values, e.g. `yyyy-MM-dd HH:mm:ss` or `epoch`. A list of common formats is provided. |

Columns designated as timestamp or visit ID carriers are automatically marked as **Timeseries Column** in the mapper and cannot themselves be mapped to schema fields, since their role is to provide temporal context rather than clinical values.

## Save / Save and Run (Load)

Once the mapping is complete, the connector can be saved or saved and run immediately.

- **Save** - Stores the connector configuration without importing data. The connector can be run manually at any time from the connector overview.
- **Save and Run** - Saves the configuration and display the screen from where the import operation can be initialized for loading data into the cohort.
