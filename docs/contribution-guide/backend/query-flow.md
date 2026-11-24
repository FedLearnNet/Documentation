---
title: Federated Query Flow
description: How a federated query runs from Platform to Clients and back.
---

# Federated Query Flow

## Flow

A user builds a query tree in the Platform frontend. The Global Learning API validates and saves it, then sends it over the websocket to every connected Client.

Each Client checks the user's cohort permissions, queryability, retry time and the query size. It then turns the tree into SQL on `patient_data`, counts matching patients per cohort, drops cohorts below their sample threshold and rounds the sum. Only this count goes back, with GPU info and supported modes; the matched patients stay local for traceability.

The Global Learning API waits until all Clients answered, at the latest until the deadline. It then sums the counts, but shows `0` until enough Clients matched. The frontend gets the result over SSE.

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant G as Global Learning API
    participant L as Local Learning API
    participant DB as Local DB

    FE->>G: POST /query/fire
    G->>G: QueryValidationBO, save QueryEntity
    G->>G: expected answers = connected Clients
    G->>L: EXISTING_QUERY (websocket, all Clients)
    G->>G: QueryResponseBO.releaseAtDeadline (timer)
    L->>L: permissions, queryability, retry time, QueryCostGuardBO
    L->>DB: SQL from QueryBuilderBO
    DB-->>L: patient count per cohort
    L->>L: sample threshold, PrivacyBO
    L-->>G: EXISTING_QUERY answer (count, GPU info, modes)
    L->>DB: matched patients (async, traceability)
    G->>G: release: all answered or timeout
    G-->>FE: SSE /query/sse
```

## Global Learning API

| Class | Does |
| --- | --- |
| `QueryService(Impl)` | REST `/query`: list, SSE, create, fire, update, delete, `/{id}/systems` |
| `QueryBO` | Validates, saves, versions (`groupId`), fires; a fired query fires again as new version |
| `QueryValidationBO` (core) | Rejects invalid trees; also runs on each Client |
| `FLNetClientBroadcastBO.fireExistingQuery` | Sends the query to all Clients |
| `FLNetClientWebsocketHandlerBO` | Passes answers and the Client's login name to `QueryResponseBO` |
| `QueryResponseBO` | Stores one answer per Client; releases once all answered or at the deadline; answers after release ignored |

Release rules:
- Sum held back as `0` until `min-query-results` Clients matched, or one TRE Client matched.
- Rejections and errors count as `0`.
- Per-Client count, hardware and name only shown for TRE Clients.
- Release timers live in memory only; not restarted after a restart.

## Local Learning API

| Class | Does |
| --- | --- |
| `WebsocketClient` | Receives `EXISTING_QUERY`, adds GPU info, answers |
| `QueryBO.handleQuery` | Checks, runs, applies privacy, stores the query |
| `PermissionBO` | Cohorts the user may query, sample threshold, retry time, TRE modes, name sharing |
| `CohortQueryAbilityBO` | Drops cohorts whose schema nodes are not queryable for the operator |
| `QueryCostGuardBO` | Rejects too many conditions, temporal relations or nesting |
| `QueryBuilderBO` | Query tree → SQL on `patient_data`; groups as `INTERSECT`/`UNION`, temporal relations |
| `QueryOccurrenceBO` | Rows matching one condition: deltas, time windows, first/last, average |
| `QueryPredicateBO` | Operator and value as SQL; values parsed into literals |
| `QueryValueHelper` | Value, data type and interval checks |
| `PrivacyBO.modifyQueryCount` | `0` below `min-count`, otherwise rounds up |
| `QueryPatientBO` | Stores matched patients for traceability |

Answer:
- Rejected before reading data → `ERROR`.
- Anything after (no match, below threshold, SQL error) → `0`.
- Same `globalUniqueId` again → `0`.

Query DTOs (`QueryDTO`, `QueryItemDTO`, `TemporalRelationDTO`, …) live in `core-learning-api` under `bio.cosy.feddb.core.api.query`.

## Configs

| Property | Default | API | For |
| --- | --- | --- | --- |
| `flnet.query.min-query-results` | `3` | Global | Matching non-TRE Clients needed before a result shows |
| `flnet.query.release-timeout` | `PT5M` | Global | Deadline of the release |
| `flnet.privacy.query.min-count` | `100` | Local | Counts below become `0` |
| `flnet.privacy.query.max-conditions` | `30` | Local | Cost guard |
| `flnet.privacy.query.max-temporal-relations` | `5` | Local | Cost guard |
| `flnet.privacy.query.max-depth` | `6` | Local | Cost guard |
| `feddb.query.timeout-seconds` | `120` | Local | SQL statement timeout |
| `flnet.cohort.cohort-permission.is-allowed-to-query` | `true` | Local | Default permission of new cohorts |
| `flnet.cohort.cohort-permission.query-sample-threshold` | `100` | Local | Default min. count per cohort |
| `flnet.cohort.cohort-permission.query-retry-time` | `3` | Local | Default seconds between queries per user and cohort |

Per cohort, the permission and queryability values are changed in the Instance Manager Frontend.

## Persistence

Global Learning API DB:

```mermaid
erDiagram
    queries ||--o{ query_result : "answers"
    queries ||--o{ projects : "query_id"

    queries {
        string keycloak_id
        string group_id "versions"
        string global_unique_id "sent to Clients"
        text query_string "query tree JSON"
        int result "released sum"
        bool has_fired
        bool has_result
        int expected_answers
    }
    query_result {
        int count
        json system "reduced GPU info"
        json supported_modes
        string connection_id
        string client_name "TRE only"
    }
```

Local Learning API DB:

```mermaid
erDiagram
    queries ||--o{ query_queried_cohorts : "queried"
    queries ||--o{ query_patient : "matched"
    patient_meta ||--o{ query_patient : ""
    cohort ||--o{ patient_meta : ""
    patient_meta ||--o{ patient_data : ""
    schemanode ||--o{ patient_data : ""
    cohort ||--o{ permission : ""
    cohort ||--o{ cohort_queryability : ""
    schemanode ||--o{ cohort_queryability : ""

    queries {
        string global_unique_query_id
        text query_string
        string status
        text status_message
        string keycloak_id
        timestamp received_at
    }
    permission {
        string user_id
        bool is_allowed_to_query
        int query_sample_threshold
        int query_retry_time
        bool tre_share_name
    }
    cohort_queryability {
        string queryability_info "VALUE, EXISTENCE, NONE"
    }
    patient_data {
        string value_columns "value_int, value_string, ..."
        timestamp visit_timestamp
        string import_schema_group_id
    }
```
