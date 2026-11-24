---
title: Client data flow - sent data
sidebar_position: 4.5
---

# Data sent from Client to Platform

Every field the Local Learning API sends to the Platform, per message. Flows are described in [Client data flow](data-flow-client.md). DTOs live in `core-learning-api`.

## Websocket messages

Each message is wrapped in `FedDBClientDataDTO`: `messageType` and `message`. No message holds patient ids or records. `count`s are rounded by `PrivacyBO`; below `flnet.privacy.query.min-count` they are `0`.

### SYSTEM_INFO

`SystemComputingInfoDTO`, on connect and every 5 min.

`gpuAvailable`; per GPU: `index`, `name`, `driverVersion`, `totalMemory`, `usedMemory`, `computeUtilization`, `memoryUtilization`.

### CURRENT_LEARNINGS

`CurrentLearningClientSyncResponseDTO`, on connect and after a learning is approved or stopped.

`type`, `currentGlobalUqLearningIds`.

### TRE_SOURCES

List of `TreSourceDTO`, on connect and on every change of a cohort with an external database.

`id`, `name`, `description`, `type` (database type), `access` (`DIRECT`/`TOOL`), `toolVersionId`, `toolName`, `hyperParams`, `testData`, `testDataFile`. No host, port, user or password.

### EXISTING_QUERY

`QueryClientResponseDTO`, answer to a [federated query](data-flow-client.md#4-federated-queries).

`type`, `globalUniqueQueryId`, `count` (rounded), `system` (as [SYSTEM_INFO](#system_info)), `supportedModes`, `shareName`.

### DATA_STATISTICS

`DataStatisticsResponseClientDTO`, after a [statistics request](data-flow-client.md#5-federated-statistics) is approved.

`globalQueryId`, `randomClinicId`, `requestId`, `statistics.properties`: one `ColumnProfile` per variable, after `PrivacyStatisticsBO`:
- `name`, `type`: always.
- `count`, `missing`, `uniqueValues`: rounded up.
- `mean`, `std`, `p25`, `median`, `p75`: rounded; empty below `min-subjects`.
- `min`, `max`: empty if `remove-extreme-values` (default).
- `topCategories`: only categories with at least `min-category-count`.
- `valueCounts`, `missingValues`: never.

All variables are empty when fewer than `min-subjects` patients matched. Config: `flnet.privacy.statistics.*`.

### LEARNING_QUERY

`LearningQueryClientResponseDTO`, after a [learning request](data-flow-client.md#6-federated-learning) is approved.

`type`, `globalFLExperimentUniqueId`, `uniqueRandomClinicId`, `count` (rounded), `error` (fixed message), `modelCanBePublic`.

### UPDATE_LEARNING

`LearningClientSyncResponseDTO`, on every status change of a run step.

`type`, `error` (technical message), `uniqueRandomClinicId`, `projectStatus`, `currentNodeId`, `stepStatus`, `globalUniqueExperimentId`.

### RELAY_CERT

`RelayCertSignRequestDTO`, when an FL run step uses the Relay Server.

`globalUniqueExperimentId`, `uniqueRandomClinicId`, `currentNodeId`, `clientId`, `csr` (PEM).

### RUN_METRICS

`RunMetricsResponseClientDTO`, after a [metrics request](data-flow-client.md#7-federated-metrics) is approved.

`globalExperimentUniqueId`, `randomClinicId`, `requestId`; per metric: `metric`, `value`, `x`, `xUnit`. Empty when the request asks for run outputs; those are uploaded via [REST](#rest-requests).

## REST requests

| Request | When | Sent |
| --- | --- | --- |
| `GET` schemas, data types, ontologies, Tools, workflows | Cohort setup, Tool runs | Ids only |
| `GET`/`DELETE /schema/subscriptions/{id}` | Cohort created or deleted | Schema id; Client identity from the token |
| `POST /model/result/experiment/upload` | Coordinating Client: trained model; approved run outputs | `experimentId`, `appVersionId`, `clinicId`, `nodeId` (outputs only), files |
| `POST /files/upload`, `DELETE /files/{id}` | TRE test data file changed | The file |

## Controller

FL messages go from the Controller to the Relay Server, not through the Local Learning API. Contents depend on the Tool, encrypted end to end; see [Client data flow](data-flow-client.md#6-federated-learning).
