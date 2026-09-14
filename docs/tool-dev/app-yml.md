---
id: app-yml
title: app.yml - Schema, Types & Validation
sidebar_position: 3
---

# app.yml - Schema, Types & Validation

`app.yml` is the **single source of truth** for a FL-Net tool’s configuration and metadata.

It tells the platform:

- **What users can configure** (`config.hyperparams`)
- **What the tool expects as input** (`config.input`)
- **What the tool produces as output** (`config.output`)
- **How the tool is presented in the UI** (`info.*`)
- **How data should be validated** (types + optional tabular schema rules)

Both **frontend forms** and **backend validation** are derived from this file, so keeping it accurate and explicit is critical.

---

## Top-level structure

`app.yml` maps to these DTOs:

- `LocalAppConfig`  
  - `info: LocalAppInfo`
  - `config: FederatedAppConfigDTO`

```yaml
info:            # LocalAppInfo (metadata)
config:          # FederatedAppConfigDTO (runtime contract)
  hyperparams:   # list[FederatedAppHyperParamConfigDTO]
  input:         # list[FederatedAppInputConfigDTO]
  output:        # list[FederatedAppOutputConfigDTO]
```

> **Naming note:** In older docs you might see `app.yml`. The current canonical file is **`app.yml`**. 
> This can be defined by the .env `CONFIG_SESSTIONGS_PATH`, default is `app.yml`

### Empty example
Sometimes hyperparams, input, or output must be empty. In YAML, represent this with empty lists ([]) or a block list with no items.
```yaml
info:
  name: NAME
  slug: SLUG
  type: TYPE
  shortDescription: Short description
  sourceUrl: https://example.org/repo

config:
  hyperparams: []
  input: []
  output: []
```
---

## Types (enums)

FL-Net uses enums across UI ↔ backend for consistency.

### Tool type (scientific role)

`AppType`

- `EXTRACTOR`
- `DATA_TRANSFORMATION`
- `PRE_PROCESSING`
- `ANALYSIS`
- `EVALUATION`
- `POST_PROCESSING`
- `SELF_LEARNED`

This value is stored in `info.type` and is used for classification and pipeline composition.

---

### Hyper-parameter data types

`FederatedAppConfigHyperParamDataType`

- `STRING`
- `INTEGER`
- `FLOAT`
- `BOOLEAN`
- `CATEGORICAL`

Use these to define “knobs” users can set before execution.

---

### Input/output data types

`ToolConfigDataType` (used by **both** inputs and outputs)

- `CSV`, `TSV`, `JSON`
- `HTML`, `IMAGE`, `TEXT`
- `STRING`
- `MIXED`
- `UNKNOWN`

> Older enums like `FederatedAppConfigInputDataType` / `FederatedAppConfigOutputDataType` may still exist in code, but the **current config DTOs use `ToolConfigDataType`**.

---

## How to choose types (practical guidance)

- Use **INTEGER** for counts: `epochs`, `neighbors`, `n_clusters`.
- Use **FLOAT** for continuous values: `learning_rate`, `alpha`, `gamma`.
- Use **BOOLEAN** for feature flags: `standardize`, `shuffle`.
- Use **CATEGORICAL** for curated choices: `affinity = [rbf, nearest_neighbors, precomputed]`.
- Use **STRING** for labels, IDs, tags. Add `pattern` if needed.
- Use **CSV/TSV/JSON** when you expect structured files.
- Use **HTML** for reports (enables rich rendering in UI).
- Use **IMAGE** when producing images (otherwise: base64 as `STRING` + explain in description).

---

## Validation model (what the platform checks)

Validation is performed:

1. **In the UI** (user guidance)
2. **In the backend** (authoritative, Pydantic v2 + business rules)

Typical checks:

- **Unique names** within `hyperparams`, `input`, `output`
- **Required inputs** must be provided (`required: true`)
- **Type-specific constraints**
  - categorical `default` should be within `options`
  - numeric bounds (`minValue` / `maxValue`)
  - regex validation (`pattern`)
  - CSV/TSV parsing hints (`delimiter`, `hasHeader`)
  - tabular constraints (`tabularSchema`) where provided

---

## Schema reference

### `info` → `LocalAppInfo`

| Field | Type | Required | Description |
|---|---|---:|---|
| `name` | string | ✓ | Human-friendly tool name |
| `slug` | string | recommended | Stable identifier for URLs/registry |
| `type` | AppType | recommended | Scientific role / classification |
| `sourceUrl` | string | optional | Repo/homepage |
| `shortDescription` | string | optional | One-line summary |
| `longDescription` | string | optional | Longer description (often handled via README in your tooling) |

---

### `config.hyperparams[]` → `FederatedAppHyperParamConfigDTO`

| Field | Type | Required | Description |
|---|---|---:|---|
| `name` | string | ✓ | Parameter name (unique) |
| `type` | HyperParamDataType | ✓ | STRING/INTEGER/FLOAT/BOOLEAN/CATEGORICAL |
| `description` | string | ✓ | Help text shown in UI |
| `default` | string \| int \| float | ✓ | Default value |
| `options` | string[] | optional | For `CATEGORICAL` |
| `minValue` | number | optional | For numeric types |
| `maxValue` | number | optional | For numeric types |
| `pattern` | string (regex) | optional | For `STRING` |

**Rules**
- If `type: CATEGORICAL`, set `options` and choose a `default` that appears in `options`.
- If `minValue/maxValue` are defined, `default` should fall within bounds.

---

### `config.input[]` → `FederatedAppInputConfigDTO`

Inputs and outputs share the same base schema (`FederatedAppBaseConfigDTO`).

| Field | Type | Required | Description |
|---|---|---:|---|
| `name` | string | ✓ | Input identifier (unique) |
| `type` | ToolConfigDataType | ✓ | CSV/TSV/JSON/IMAGE/… |
| `description` | string | ✓ | What the input is and how it is used |
| `required` | boolean | optional | Defaults to `false` |
| `minValue` / `maxValue` | number | optional | For scalar numeric inputs |
| `shape` | string | optional | Advisory dimensions (e.g., `N x M`) |
| `delimiter` | string | optional | CSV/TSV delimiter (usually `,` or `\t`) |
| `hasHeader` | boolean | optional | CSV/TSV header row |
| `tabularSchema` | TabularSchemaDTO | optional | Structural + column validation for tables |

---

### `config.output[]` → `FederatedAppOutputConfigDTO`

| Field | Type | Required | Description |
|---|---|---:|---|
| `name` | string | ✓ | Output identifier (unique) |
| `type` | ToolConfigDataType | ✓ | CSV/TSV/JSON/HTML/IMAGE/STRING/… |
| `description` | string | ✓ | What the output contains |
| `minValue` / `maxValue` | number | optional | For scalar numeric outputs |
| `shape` | string | optional | Dimensions, if applicable |
| `delimiter` | string | optional | CSV/TSV delimiter |
| `hasHeader` | boolean | optional | CSV/TSV header row |
| `tabularSchema` | TabularSchemaDTO | optional | Optional table constraints |

---

## TabularSchemaDTO (CSV/TSV validation)

Use `tabularSchema` to enforce structure and column-level rules for CSV/TSV inputs (and optionally outputs).

```yaml
tabularSchema:
  minRows: 1
  maxRows: 100000
  minColumns: 2
  maxColumns: 200
  allowOnlyNumbers: false
  prohibitedNulls: false
  nullPolicy:
    prohibitedEmptyCell: true
    prohibitedEmptyString: false
    prohibitedWhitespaceString: true
    prohibitedNullLiterals: true
    nullLiterals: ["null", "none", "na", "nan"]
  requiredColumns: ["id", "age"]
  columns:
    id:
      type: STRING
      nullable: false
      regex: "^[A-Za-z0-9_-]{3,64}$"
      description: Stable sample identifier
    age:
      type: INTEGER
      nullable: false
      min: 0
      max: 130
      description: Age in years
```

### Column rules (`ColumnRuleDTO`)
Per column you can specify:

- `type`: STRING / INTEGER / FLOAT / BOOLEAN / CATEGORICAL
- `nullable`: whether null is allowed
- `regex`: for strings
- `enumValues`: for categorical
- `min` / `max`: numeric constraints
- `description`: documentation shown in UI

### Null policy (`NullValuePolicyDTO`)
Use `nullPolicy` to define what should be treated as invalid “null-like” values (empty cells, whitespace, tokens like `"null"`, NaN, etc.). This is useful for clinical/regulatory pipelines where missingness must be explicitly controlled.

---

## Quick starts

### Minimal example (CSV in, JSON out)

```yaml title="app.yml"
info:
  name: SpectralClustering
  slug: spectral-clustering
  type: SELF_LEARNED
  shortDescription: Graph-based clustering using spectral embedding
  sourceUrl: https://example.org/repo

config:
  hyperparams:
    - name: n_clusters
      type: INTEGER
      description: Number of clusters to compute
      default: 3
      minValue: 2
      maxValue: 50

    - name: affinity
      type: CATEGORICAL
      description: Affinity strategy used to build the graph
      default: rbf
      options: [rbf, nearest_neighbors, precomputed]

    - name: standardize
      type: BOOLEAN
      description: Standardize features before clustering (if applicable)
      default: true

  input:
    - name: data
      type: CSV
      description: Feature matrix (rows=samples, columns=features)
      required: true
      hasHeader: true
      delimiter: ","
      shape: "N x M"

  output:
    - name: labels
      type: CSV
      description: Cluster assignment per sample (one row per input row)
      hasHeader: true
      delimiter: ","
```

### Strict CSV example with tabular schema

```yaml title="app.yml"
info:
  name: StrictCSVExample
  slug: strict-csv
  type: PRE_PROCESSING
  shortDescription: CSV validation and cleanup

config:
  hyperparams: []

  input:
    - name: table
      type: CSV
      description: Semicolon-delimited table with required columns
      required: true
      hasHeader: true
      delimiter: ";"
      tabularSchema:
        minRows: 1
        requiredColumns: ["patient_id", "age"]
        columns:
          patient_id:
            type: STRING
            nullable: false
            regex: "^[A-Za-z0-9_-]{3,64}$"
          age:
            type: INTEGER
            nullable: false
            min: 0
            max: 130

  output:
    - name: cleaned_table
      type: CSV
      description: Cleaned and validated table
      hasHeader: true
      delimiter: ";"
```

---

## Best practices

- ✅ Always write **descriptions** for inputs/outputs/hyperparams (UI + reviewers rely on them).
- ✅ Prefer `CATEGORICAL` over free-form `STRING` when the allowed set is known.
- ✅ Add `minValue/maxValue` and `pattern` to prevent invalid runs early.
- ✅ Use `tabularSchema` for clinical/regulated data: explicit constraints improve traceability.
- ✅ Keep `slug` stable; changing it breaks deep links and stored references.

## Common mistakes

- ❌ `CATEGORICAL` without `options`
- ❌ `default` not compatible with `type` (e.g., string default for integer)
- ❌ Missing declared outputs (users should know what they will receive)
- ❌ CSV inputs without `delimiter`/`hasHeader` when parsing depends on it

---

## Troubleshooting

**“Default value rejected”**
- For `CATEGORICAL`: ensure `default` is in `options`
- For numeric types: ensure `default` is within `minValue/maxValue`

**“CSV validation failed”**
- Ensure `delimiter` matches the file
- Ensure `hasHeader` is correct
- If using `tabularSchema`: check required columns and per-column rules

**“Why is my input optional?”**
- Set `required: true` on the input item

---

## Reference: DTO mapping (backend)

- `LocalAppConfig` → `{ info: LocalAppInfo, config: FederatedAppConfigDTO }`
- `FederatedAppConfigDTO` → `{ hyperparams, input, output }`
- Items:
  - `FederatedAppHyperParamConfigDTO`
  - `FederatedAppInputConfigDTO` (inherits `FederatedAppBaseConfigDTO`)
  - `FederatedAppOutputConfigDTO` (inherits `FederatedAppBaseConfigDTO`)
  - `TabularSchemaDTO` → `NullValuePolicyDTO`, `ColumnRuleDTO`
