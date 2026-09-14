---
title: How is input normalized and validated
sidebar_position: 4
---
# How is input normalized and validated

When a connector is run, the data goes through the following flow, being normalized and validated
multiple times:
## 1. Extraction Tool
1. If selected, the extraction tool(s) run. 
Extraction tools might implement their own normalization/validation logic 
and do not apply the logic discussed here but their own logic. 
1. The extraction tool outputs the data as one or multiple `csv` files
## 2. Client software 
1. The dataimporter reads in the `csv`/`xlsx`(excel) file using the python package `pandas`. 
`pandas` does some normalization, e.g. detecting `nan` values and replacing them with it's own 
representation of nan.
1. If selected, the transformation tool receive the data as an `csv` export, runs it's logic, and send the data back as `csv`.
Transformation tools might implement their own normalization/validation logic 
and do not apply the logic discussed here but their own logic. 
1. Finally, the data is sent to the local learning API. The normalization and validation done
in this step is further discussed in this document.

## Encoding
For `csv` files, you must provide them in `utf-8` (unicode) encoding. 
Excel files support also other encodings, we strongly recommend `utf-8` but another encoding
should work as `pandas.read_excel` automatically converts to `utf-8`.
In most cases this will already be the case except for older files.

## Data type normalization rules

| Target type | Accepted input | Normalized result | Notes |
|---|---|---|---|
| `STRING` | Any value | `String` | Uses `toString()` |
| `CATEGORICAL` | Any value | `String` | Uses `toString()`, then checked against allowed options (if configured) |
| `INT` | Number or numeric string | `Long` | Must be a whole number (no decimal part or e.g. 5.0), and within Java `Long` range, see [below](#important-int-behavior) |
| `FLOAT` | Number or numeric string | `Float` | Parsed as float |
| `BOOLEAN` | `"true"`, `"false"` | `Boolean` | true/false (case-insensitive), see [below](#important-boolean-behavior) |
| `DATE` | Date/time input (see below) | `LocalDate` | Must not contain time information that would be lost, see [below](#date-and-datetime-parsing)  |
| `DATE_TIME` | Date/time input (see below) | `Instant` (UTC) | Stored as an exact UTC point in time. See [below](#date-and-datetime-parsing) |
| `FILE` | - | - | Not implemented yet |

TODO: should datetime support dates?
### Important INT behavior

- `"42"` ✅ valid
- `"42.0"` ✅ valid (no information loss)
- `"42.5"` ❌ invalid (would lose decimal information)
- Values outside `Long` range ❌ invalid

### Important BOOLEAN behavior
The given input is trimmed (white space before and after removed) and set to lowercase.
Based on this, the values `true` and `false` are accepted.
Values like `1`, `0`, `yes`, `no` are rejected.

### Date and datetime parsing

For `DATE` and `DATE_TIME`, the importer supports:

- **ISO date/time strings**
	- With timezone, e.g. `2024-01-01T12:00:00+02:00`, `2024-01-01T12:00:00Z`
	- Without timezone, e.g. `2024-01-01T12:00:00`, `2024-01-01`
- **Epoch timestamps** (seconds or milliseconds)
	- Numeric string or numeric value
- **Java date/time objects** (internal/backend context)
	- `Instant`, `ZonedDateTime`, `LocalDateTime`, `LocalDate`

For a `DATE`, a given datetime normalized to UTC is only accepted if it's exactly
`00:00:00`! 

For `DATETIME`, a simple date is also accepted and automatically set to `00:00:00` UTC.
This is similar to the logic of accepting an integer for a float.

#### Timezone handling

- **Timezone-aware input** is converted to UTC.
- **Timezone-naive input** is treated as already being UTC.

### Epoch handling heuristic
We **strongly** recommend to use iso datetime strings, but we still support epochs:

Epoch values are interpreted automatically:

- Absolute value `<= 10,000,000,000` → treated as **seconds**
- Absolute value `> 10,000,000,000` → treated as **milliseconds**

This is a heuristic and may be ambiguous for very large second-based values.
Generally if you use epochs, use **milliesconds** for current or future dates and **seconds** for
historic dates. 

## Validation rules

After normalization, these validations can apply (depending on field configuration):

| Validation | Meaning | Supported types |
|---|---|---|
| `REQUIRED` | Value must be present (not null) | All types |
| `MINLENGTH` | Minimum string length | `STRING` |
| `MAXLENGTH` | Maximum string length | `STRING` |
| `PATTERN` | Regex must match | `STRING` |
| `MIN` | Minimum numeric/date/datetime value | `INT`, `FLOAT`, `DATE`, `DATE_TIME` |
| `MAX` | Maximum numeric/date/datetime value | `INT`, `FLOAT`, `DATE`, `DATE_TIME` |

### Categorical options

For `CATEGORICAL` fields, if allowed options are configured, the value must be one of those exact options.

## Null handling

- `null` values are allowed by default.
- If `REQUIRED` is configured, `null` is rejected.
- For `null`, other validations (`MIN`, `MAX`, `PATTERN`, etc.) are skipped.
- An empty string is considered a `null` value

## Handling normalization/validation errors
Any normalization or validation error does not lead to an data import failure.
Instead the specific value that failed is not imported.
As an example, if the input data contains an age of `420` years and a bmi of `25`, 
and age is validated to be between `0` and `120` years, then only the bmi value is imported
while the age value is rejected.

Rejected dataentries are logged and reported in the connector run!

## Handling timeseries data

If you provide timeseries data and provide a `visitTimestamp`, please note that if you provide only a date without time information, it is normalized to start-of-day UTC:
- `2025-12-12` → `2025-12-12T00:00:00Z`

## Practical examples

| Input | Target type | Result |
|---|---|---|
| `"abc"` | `STRING` | ✅ accepted as `"abc"` |
| `123` | `STRING` | ✅ normalized to `"123"` |
| `"42.5"` | `INT` | ❌ rejected (fractional) |
| `"false"` | `BOOLEAN` | ✅ normalized to `false` |
| `"yes"` | `BOOLEAN` | ❌ rejected |
| `"2024-01-01"` | `DATE` | ✅ accepted |
| `"2024-01-01T10:30:00"` | `DATE` | ❌ rejected (time would be lost) |
| `"2024-01-01T10:30:00+02:00"` | `DATE_TIME` | ✅ converted to UTC `Instant`, so `"2024-01-01T08:30:00"` |

# Currently missing types
We currently do not support the filetype but plan to do so in the future

# TODO: To clarify
- how should falling extractions be handled?
- how should failing transformations be handled 
	- if we stay with the philosophy of importing what's possible, we should then not run
	the import on any of the columns that are normally affected/produced by the transformation function
- what kind of transformations should we support?
  - on cell 
  - fixed columns to fixed output columns  
  - file input and output?
	We would have to check if the rerun produced the same columns than before!
- how should we handle NaN/None values?
- Should we remove the dataimporter validation (and normalization) logic and instead call endpoints in the
learning-api?
	- would prefer this eventhough it's effort as this would remove all weird bugs where the
	normalization/validation is different accross services.
- should we support time or advise users to represent time as a string?
- how should we handle if two different patients have the same visit_id
	- 2 entries, different patient, same visit_id
		- could ignore?
- how should we handle visit_ids with different visit_timestamps?
	- 2 entries, same patient and same visit_id, different visit_timestamp
		- could:
			- throw an error
			- update the timestamp if it's a new timestamp from the import and the current data has an old timestamp
	- 2 entries, different patient and same visit_id, different visit_timestamp
		- would be okay as different patient, id reuse basically, still unique as different patient
- from index.md: If columns do not match, the upload is rejected and the existing data is preserved.
	- we should clarify this further and implement this well:
		- in theory only columns the followings columns are actually required for a rerun:
			- mapped to a schema node
			- input to a transformation tool/function AND the resulting column of the transformation
			function is mapped to a schema node
		- we could implement this logic and specify this further. For new columns in the new file
		that were not in the previous file we could report something like:
			- the file you added contains new information. Do you want to check if these new columns
			can be mapped to the schema.
