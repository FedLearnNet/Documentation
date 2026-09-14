---
title: Query translation & privacy
sidebar_position: 5
---

This page describes how the local-learning-api turns a temporal query into parameterised SQL against `patient_data`, and how the result count is post-processed by privacy rounding before it leaves the client.

## Source files

| Role                | Path                                                                              |
| ------------------- | --------------------------------------------------------------------------------- |
| Temporal translator | `learning-apis/local-learning-api/.../api/query/temporal/TemporalQueryBuilderBO.java` |
| SQL parts container | `learning-apis/local-learning-api/.../api/query/temporal/TemporalSqlPart.java` and `TemporalSqlQuery.java` |
| Validation errors   | `learning-apis/local-learning-api/.../api/query/temporal/TemporalQueryValidationException.java` |
| Schema resolver     | `learning-apis/local-learning-api/.../api/schema/schemanode/SchemaNodeAO.java` |
| Query BO            | `learning-apis/local-learning-api/.../api/query/QueryBO.java`                    |
| Panache repository  | `learning-apis/local-learning-api/.../api/query/QueryAO.java`                    |
| Privacy rounding    | `learning-apis/local-learning-api/.../api/privacy/PrivacyBO.java`                |

## End-to-end shape

```mermaid
sequenceDiagram
  participant FE as Global API (broadcast)
  participant Q as QueryBO (local)
  participant T as TemporalQueryBuilderBO
  participant DB as Postgres (patient_data)
  participant P as PrivacyBO

  FE->>Q: handleQuery(QueryDTO with temporalQuery + optional temporalControlQuery)
  Q->>T: build(CreateTemporalQueryDTO)
  T-->>Q: TemporalSqlQuery { case: SqlPart, control?: SqlPart }
  Q->>DB: SELECT DISTINCT patient_id FROM (caseSql) AS q -- with bound :p0,:p1,...
  Q->>DB: SELECT DISTINCT patient_id FROM (controlSql) AS q -- (if control set)
  Q->>P: modifyQueryCount(caseCount); modifyQueryCount(controlCount?)
  Q-->>FE: QueryClientResponseDTO { count, controlCount?, error? }
```

## DTO → SQL contract

`TemporalQueryBuilderBO.build(CreateTemporalQueryDTO)` returns `TemporalSqlQuery`:

```java
record TemporalSqlPart(String label, String sql, Map<String, Object> parameters) {}
record TemporalSqlQuery(TemporalSqlPart caseQuery, TemporalSqlPart controlQuery) {}
```

The case query is always present; the control query is null when the request had no `controlQuery`.

`caseQuery.label` is the constant `"query case"`; `controlQuery.label` is `"Query control"`. These labels are stable identifiers for output datasets and match the values used by the frontend.

## Translation rules

The translator walks the `QueryGroup` recursively and dispatches per condition type:

### Item condition

Each `QueryItemCondition` is resolved against `SchemaNodeAO.findByOntologyGlobalId(ontologyId)` and emits one `SELECT patient_id, visit_timestamp FROM patient_data WHERE schema_node_id = X AND <op>` per matching schema node, `UNION ALL`-joined when an ontology spans multiple datatypes (e.g. INT + FLOAT).

All values are bound through a `ParameterBag` as `:p0`, `:p1`, …; the SQL string itself contains only placeholders. Concatenating user input into the SQL is a bug — never do it. The translator-driven `QueryAO.findPatientIdsByNativeQuery(sql, params)` is the only entry point that runs the produced SQL.

### Operators

| `QueryOperatorTypes`                 | SQL fragment                                              |
| ------------------------------------ | --------------------------------------------------------- |
| `EQUAL`, `NOT_EQUAL`                 | `column = :pN`, `column <> :pN`                           |
| `SMALLER`, `SMALLER_EQUAL`           | `column < :pN`, `column <= :pN`                           |
| `BIGGER`, `BIGGER_EQUAL`             | `column > :pN`, `column >= :pN`                           |
| `EXISTS`, `NOT_EXISTS`               | `column IS NOT NULL` / `IS NULL`                          |
| `EXIST_VALUE`, `NOT_EXIST_VALUE`     | `column = :pN AND IS NOT NULL` / negation                 |
| `CONTAINS`, `NOT_CONTAINS`           | `column ILIKE :pN` with `%v%`                             |
| `START_WIDTH`, `END_WIDTH`           | `column ILIKE :pN` with `v%` / `%v`                       |
| `IN`, `NOT_IN`                       | `column IN (:pA, :pB, …)` from a `[a,b]`-style value      |
| `REGEX`                              | `column ~ :pN`                                            |

The data type of the schema node decides which `value_*` column is queried (`value_string`, `value_int`, `value_float`, `value_boolean`, `value_date`, `value_date_time`, `value_blob`).

### Time filter

`QueryTimeFilter` is mapped to a `WHERE` predicate on `visit_timestamp`:

- `anytime: true` → no clause.
- `after: "YYYY-MM-DD"` → `visit_timestamp >= :pN` (start of UTC day).
- `before: "YYYY-MM-DD"` → `visit_timestamp < :pN`.
- `valueAggregationMethod`:
    - `NONE` (default) → row-level operator.
    - `FIRST`/`LAST` → wrap the prefiltered rows in `SELECT DISTINCT ON (patient_id) … ORDER BY patient_id, visit_timestamp ASC/DESC`, then apply the operator on the picked row.
    - `AVERAGE` → `SELECT patient_id, MAX(visit_timestamp) FROM patient_data WHERE … GROUP BY patient_id HAVING AVG(value_<num>) <op> :pN`. Requires `INT` or `FLOAT`; throws `TemporalQueryValidationException` for other types.

### Occurrence constraints

If a `QueryItemCondition` has `atLeast` or `atMost`, the per-schema selects are wrapped in:

```sql
SELECT patient_id, MAX(visit_timestamp) AS visit_timestamp
FROM ( … ) AS occ
GROUP BY patient_id
HAVING COUNT(DISTINCT visit_timestamp) >= :pX
   AND COUNT(DISTINCT visit_timestamp) <= :pY
```

`COUNT(DISTINCT visit_timestamp)` is intentional: it counts events, not duplicate rows that may exist for the same visit due to multi-schema unions.

### Groups

`QueryGroup.connectingOperator` decides the set combinator when there are no temporal relations:

- `AND` → `INTERSECT` of per-condition `SELECT DISTINCT patient_id`.
- `OR`  → `UNION` of the same.

Nested groups recurse — the same rules apply at any depth. Each group emits `(patient_id, visit_timestamp)` so the parent join still has a timestamp to enforce temporal relations on.

### Temporal relations

When a `QueryGroup` has non-empty `temporalRelations`, the translator emits a JOIN of all sibling conditions on `patient_id` and adds predicates per relation:

| Relationship | Predicate                                            |
| ------------ | ---------------------------------------------------- |
| `SAME`       | `cSrc.visit_timestamp = cTgt.visit_timestamp`        |
| `BEFORE`     | `cSrc.visit_timestamp < cTgt.visit_timestamp`        |
| `AFTER`      | `cSrc.visit_timestamp > cTgt.visit_timestamp`        |

Optional `atLeast`/`atMost` on a relation are interpreted as **distance bounds in seconds**: `ABS(EXTRACT(EPOCH FROM (cTgt.ts - cSrc.ts))) BETWEEN :pA AND :pB`.

The translator rejects relations whose `sourceConditionIdx`/`targetConditionIdx` are out of range with a `TemporalQueryValidationException` — invalid indices never reach the database.

## Safety guarantees

- **No string interpolation of values.** All operator values, dates, occurrence counts, and relation distances pass through `ParameterBag.bind`. The translator's unit tests assert that an injection attempt (e.g. `Diabetes'; DROP TABLE patient_data; --`) ends up as a bound parameter, not in the SQL string.
- **Validated operator + datatype combinations.** Unsupported pairings (e.g. `CONTAINS` on a non-string column) throw `TemporalQueryValidationException` with a clear message before the SQL is generated.
- **Explicit errors for missing fields.** Item conditions without `ontologyId` or `operator`, and groups with empty conditions, throw the same exception.
- **Empty resolution is safe.** If an `ontologyId` resolves to zero schema nodes, the per-condition SQL becomes `SELECT NULL::bigint, NULL::timestamp WHERE 1=0` — the join still type-checks and returns no patients.

## Privacy rounding

After the SQL runs, `QueryBO.countAllowedAfterPrivacy` does three things in order:

1. **Cohort allow-list:** drop result rows whose `cohortId` is not in the keycloak user's allowed list. An unauthorized cohort returned by the SQL is logged as an error.
2. **Per-cohort sample threshold:** drop cohorts whose patient count is below `PermissionDTO.querySampleThreshold`. This implements the minimum-cohort-size rule.
3. **Privacy aggregation:** sum the surviving cohort sizes and pass through `PrivacyBO.modifyQueryCount` for the final rounding / fuzzing.

The same pipeline runs separately for the case cohort and the optional control cohort, producing the two values that ship back in `QueryClientResponseDTO`. If `caseCount` is zero after privacy, the entire query is rejected with `REJECTED_EAM_POST_HARMONIZED` and `controlCount` is not reported back.

## Where to start when changing things

| Task                                                | Start here                                                       |
| --------------------------------------------------- | ---------------------------------------------------------------- |
| Support a new operator                              | Add to `QueryOperatorTypes`, then `buildOperatorOnExpression` and a unit test |
| Support a new aggregation                           | `QueryTimeBasedValueAggregationMethod` + `buildPerSchemaSelect`  |
| Change how empty ontology resolution behaves        | `resolve(ontologyId)` and the `1=0` fallback                     |
| Adjust privacy rounding                             | `PrivacyBO.modifyQueryCount` (separate page)                     |
| Make a temporal-relation distance unit configurable | `buildTemporalRelationClause` and the relation `atLeast/atMost`  |
| Add or rename a column on `patient_data`            | `PatientDataEntryEntity` + the column-mapping switch in the translator |

## Test coverage

- Pure unit tests (no DB): `local-learning-api/src/test/java/unit/TemporalQueryBuilderBOTest.java` covers every operator, aggregation, group connector, temporal relation, validation error and SQL-injection safety.
- Integration tests (real Postgres): `local-learning-api/src/test/java/unit/TemporalQueryBuilderIntegrationTest.java` seeds extra `patient_data` rows on top of `import-test/patient.sql` and asserts the patient ids the generated SQL returns.

When adding a new translation rule, **add both** a unit test (for SQL shape and parameter binding) and an integration test (to prove it actually selects the right patients in Postgres).
