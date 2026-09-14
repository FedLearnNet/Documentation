---
title: Input data formatting guidelines
sidebar_position: 2
---
# Input data formatting guidelines

Use this as a short checklist before adding data. Detailed normalization and validation rules are described in the [detailed normalization and validation documentation](input_validation).

- For CSV input, use `utf-8` encoding (usually this is the default encoding).
- Excel files with different encodings are supported as this is internally translated to `utf-8`.
We do not recommend to use other encodings than `utf-8` due to possible encoding translation errors.
- For `INT` fields, values must be whole numbers. `5` and `5.0` are accepted, but `5.5` is rejected.
- We recommend using ISO date/datetime strings:
	- date: `2025-02-02`
	- datetime: `2025-02-02T10:00:00Z`
    Other formats are supported, see the [detailed normalization and validation documentation](input_validation).
- For `BOOLEAN` fields, use `true` or `false` strings (case-insensitive).
- If you use an extraction or transformation tool, check the tool documentation for additional input rules.
- For missing values (`null`/`nan`), leave the cell empty.
- `FILE` fields are not supported yet.
