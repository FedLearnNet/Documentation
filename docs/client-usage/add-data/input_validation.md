---
title: Data validation and normalization
sidebar_position: 4
---

# Data validation and normalization

Connectors can import data from multiple source types. This page describes validation and normalization for file-based imports.

The cohort's selected schema defines how imported values are interpreted. It specifies the available fields, their data types, whether values are required, and any additional validation rules. During an import, source columns are mapped to these schema fields before the data is stored in the cohort.

## Prepare the source files

- Encode CSV and TSV files as UTF-8.
- Use a consistent delimiter and column structure in delimited files.
- Represent missing values with empty cells rather than placeholder text such as `?`, `N/A`, or `unknown`, unless that text is an intended value.
- Ensure that values can be converted to the data types defined by the schema.

Excel `.xlsx` workbooks are read directly and do not require a text-encoding selection. For format-specific requirements, see the [input data formatting guidelines](connectors/input-checklist.md), [delimited file extractor](connectors/extractors/csv-importer.md), and [Excel file extractor](connectors/extractors/excel-importer.md).

## Correct incompatible source values

Extraction and transformation tools can prepare source data before schema validation. Use them when the source format or values do not match the representation required by the schema.

For example, a `BOOLEAN` field accepts `true` and `false`, while a source system may represent the same values as `1` and `0`. An extraction or transformation tool can convert every `1` to `true` and every `0` to `false` before the values are validated and imported.

These tools may also standardize categories, convert units, parse dates, replace placeholder values with nulls, combine columns, or reorganize the input data. Their output must still conform to the cohort's schema.

## Supported data organization

Both horizontal and longitudinal data organizations are supported:

- **Horizontal data** stores multiple properties for an entity in the same row.
- **Longitudinal data** stores repeated observations across rows and associates them with a visit, date, or timestamp.

If the source organization does not match the structure required for mapping, a transformation can convert horizontal data to a longitudinal representation or longitudinal data to a horizontal representation. For repeated measurements, configure the connector's visit and time mappings so that observations are associated with the correct entity and point in time.

When a longitudinal record provides only a date for its visit timestamp, the value is normalized to the start of that day in UTC. For example, `2025-12-12` becomes `2025-12-12T00:00:00Z`.

## Data type normalization

| Schema type | Accepted input | Normalization and restrictions |
|---|---|---|
| `STRING` | Text or another scalar value | Converted to text. Additional length or pattern rules may apply. |
| `CATEGORICAL` | A value matching an allowed category | Converted to text and compared with the configured options. |
| `INT` | An integer or numeric text | Must represent a whole number. Values such as `42` and `42.0` are accepted; `42.5` is rejected. |
| `FLOAT` | A number or numeric text | Converted to a floating-point number. |
| `BOOLEAN` | `true` or `false` | Case-insensitive; surrounding whitespace is ignored. Values such as `1`, `0`, `yes`, and `no` must be transformed before import. |
| `DATE` | A supported date value | Must not contain time information that would be lost. |
| `DATE_TIME` | A supported date or datetime value | Normalized to a UTC point in time. A date without a time is interpreted as start-of-day UTC. |
| `FILE` | — | Not currently supported. |

## Dates and timestamps

ISO 8601 values are recommended because their interpretation is explicit. Supported examples include:

- Date: `2024-01-01`
- Datetime with UTC: `2024-01-01T12:00:00Z`
- Datetime with an offset: `2024-01-01T12:00:00+02:00`
- Datetime without an offset: `2024-01-01T12:00:00`

Datetime values with an offset are converted to UTC. Values without an offset are treated as UTC. A datetime can be imported into a `DATE` field only when its UTC time is exactly `00:00:00`, because otherwise the conversion would discard information.

Epoch timestamps expressed in seconds or milliseconds are also supported. Values with an absolute value up to `10,000,000,000` are interpreted as seconds; larger values are interpreted as milliseconds. Because this distinction is heuristic, ISO 8601 values are preferred.

## Schema validation rules

After normalization, the schema may apply the following rules to each field:

| Rule | Meaning | Applicable types |
|---|---|---|
| `REQUIRED` | A value must be present. | All types |
| `MINLENGTH` | Minimum text length. | `STRING` |
| `MAXLENGTH` | Maximum text length. | `STRING` |
| `PATTERN` | The value must match a regular expression. | `STRING` |
| `MIN` | Minimum accepted value. | `INT`, `FLOAT`, `DATE`, `DATE_TIME` |
| `MAX` | Maximum accepted value. | `INT`, `FLOAT`, `DATE`, `DATE_TIME` |

For a `CATEGORICAL` field with configured options, the normalized value must match one of those options.

## Null and empty values

An empty cell is interpreted as `null`. Whether it is accepted depends on the corresponding schema field:

- If the field is optional, `null` is accepted and other validation rules are skipped for that value.
- If the field is marked `REQUIRED`, a null or empty value is rejected.

This allows the schema to require values for selected columns while permitting missing values in others.

Only truly empty cells are treated as missing values. Text that people commonly type into spreadsheets to mean "no value", such as `-`, `NULL`, `null`, `N/A`, `NA`, `n.a.`, `none`, `unknown`, `?`, or `999`, is **not** treated as missing. Instead, it is validated like any other value and may be rejected (for example, `N/A` in a numeric column) or imported as literal text. Transform such placeholders to empty values before import when appropriate.

## Validation errors and import results

A validation error for one value does not necessarily reject the complete import or the rest of the record. The invalid value is omitted and reported in the connector run as a patient error, while the valid values of the record are still imported.

For example, if a record contains an age of `420` and a BMI of `25`, and the schema permits ages only between `0` and `120`, the age is rejected while the valid BMI can still be imported.

After running the connector, review **Patient Errors**, **Run Errors**, and **Run Logs** on the run details page. These sections identify rejected values and execution problems. See [Import data by running a connector](import-data.md) for the complete review workflow.

## Examples

| Input | Schema type | Result |
|---|---|---|
| `abc` | `STRING` | Accepted as `abc`. |
| `123` | `STRING` | Normalized to `123` as text. |
| `42.0` | `INT` | Accepted as `42`. |
| `42.5` | `INT` | Rejected because it is fractional. |
| `false` | `BOOLEAN` | Accepted as `false`. |
| `1` | `BOOLEAN` | Rejected unless transformed to `true`. |
| `2024-01-01` | `DATE` | Accepted. |
| `2024-01-01T10:30:00` | `DATE` | Rejected because the time would be lost. |
| `2024-01-01T10:30:00+02:00` | `DATE_TIME` | Converted to `2024-01-01T08:30:00Z`. |
