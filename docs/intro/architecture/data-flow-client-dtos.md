---
title: Client data flow - sent data
sidebar_position: 4.5
---

# Data sent from Client to Platform

Every field the Local Learning API sends to the Platform, per message. Flows are described in [Client data flow](data-flow-client.md).

## Websocket messages

Each message has two parts:
- `messageType`: what kind of message it is, e.g. `SYSTEM_INFO`. The headings below are these types.
- `message`: the content, described below.

No message holds patient ids or patient records.

### SYSTEM_INFO

`SystemComputingInfoDTO`, on connect and every 5 min. Tells the Platform how much computing power the Client has, so users can pick suitable Clients for a learning.

- `gpuAvailable`: whether the Client has at least one graphics card (GPU) usable for training.
- `cpuDetails`, the main processor:
  - `modelName`: processor model, e.g. "Intel Xeon Gold 6230".
  - `logicalCores`: number of tasks the processor can run at once.
  - `architecture`: processor type, e.g. `amd64` or `arm64`.
  - `usedCores`: how many of these are currently busy.
  - `freeCores`: how many are currently idle.
  - `usagePercent`: overall load, 0 to 100.
- `ramDetails`, the working memory:
  - `totalMemoryGb`: total memory in GB.
  - `usedMemoryGb`: memory currently in use.
  - `availableMemoryGb`: memory still free.
- `gpuHardwareInfo`, one entry per graphics card:
  - `index`: number of the card in the machine, starting at 0.
  - `name`: card model.
  - `driverVersion`: installed driver version.
  - `totalMemory`: memory of the card.
  - `usedMemory`: card memory currently in use.
  - `computeUtilization`: how busy the card is.
  - `memoryUtilization`: how busy the card's memory is.

### CURRENT_LEARNINGS

`CurrentLearningClientSyncResponseDTO`, on connect and after a learning is approved or stopped. Tells the Platform which learnings this Client takes part in.

- `type`: always `CURRENT_LEARNINGS`.
- `currentGlobalUqLearningIds`: ids of all learnings approved and running on the Client. The Platform sends messages of a learning only to Clients listing its id. An empty list means the Client takes part in no learning.

### TRE_SOURCES

List of `TreSourceDTO`, on connect and on every change of a cohort with an external database. Describes the external databases a Data Holder offers, so users can find and request them. How to reach a database is never sent: no host, port, user or password.

- `id`: id of the database entry.
- `name`: name given by the Data Holder.
- `description`: free text by the Data Holder.
- `type`: kind of database: `POSTGRES`, `MYSQL`, `MONGODB`, `NEO4J` or `OTHER`.
- `access`: who may read the database. `DIRECT`: any approved Tool. `TOOL`: only the one Tool named below.
- `toolVersionId`, `toolName`: the Tool allowed to read the database, when `access` is `TOOL`.
- `hyperParams`: preset settings for that Tool, chosen by the Data Holder.
- `testData`: made-up sample data in the shape of the real data, so Tool developers can test without seeing real records.
- `testDataFile`: the same as an uploaded file: file name, file type and size. The file itself is uploaded separately, see [REST requests](#rest-requests).

### EXISTING_QUERY

`QueryClientResponseDTO`, answer to a [federated query](data-flow-client.md#4-federated-queries) such as "how many patients are over 50?".

- `type`: `QUERY` for an answer, `ERROR` if the query failed.
- `globalUniqueQueryId`: id of the query this answers.
- `count`: number of matching patients, rounded so single patients cannot be singled out.
- `error`: short reason when `type` is `ERROR`, otherwise empty.
- `system`: the Client's computing power, as in [SYSTEM_INFO](#system_info).
- `supportedModes`: how the requesting user may train on the matching data: `FEDERATED` (together with other Clients) and/or `TRE` (inside this Client's trusted research environment). Depends on the Data Holder's permissions.
- `shareName`: whether the Platform may show this Client's name to the user. Only possible for TRE, and only if the Data Holder allowed it.

### DATA_STATISTICS

`DataStatisticsResponseClientDTO`, after a [statistics request](data-flow-client.md#5-federated-statistics) is approved. Summarises the requested variables, e.g. the age distribution, without single values.

- `globalQueryId`: id of the query the statistics belong to.
- `randomClinicId`: new random id for every answer, so answers of the same Client cannot be linked.
- `requestId`: id of the statistics request this answers.
- `statistics.properties`: one summary per variable:
  - `name`: variable name, e.g. "age".
  - `type`: kind of value: number, whole number, yes/no, date or text.
  - `count`: number of values looked at, rounded up.
  - `missing`: number of empty values, rounded up.
  - `uniqueValues`: number of different values, rounded up.
  - `mean`: average.
  - `std`: standard deviation, how far values spread around the average.
  - `p25`, `median`, `p75`: the values below which 25 %, 50 % and 75 % of patients lie.
  - `min`, `max`: smallest and largest value. Not sent by default, since extreme values can identify a patient.
  - `topCategories`: most frequent values with their counts, e.g. "female: 120". Values too rare are left out.
  - `valueCounts`, `missingValues`: full value lists. Never sent.

Privacy rules, set in `flnet.privacy.statistics.*`, see [Local Learning API configuration](/docs/contribution-guide/backend/local-learning-api/config.md#privacy):


### LEARNING_QUERY

`LearningQueryClientResponseDTO`, after a [learning request](data-flow-client.md#6-federated-learning) is approved.

- `type`: `LEARNING_RESPONSE` for an approval, `ERROR` if the request could not be processed.
- `globalFLExperimentUniqueId`: id of the learning.
- `uniqueRandomClinicId`: random id standing in for this Client in this learning only, so its learnings cannot be linked to each other.
- `count`: number of patients approved for training, rounded. For an external database: number of approved databases.
- `error`: short fixed reason when `type` is `ERROR`, e.g. "Query not found".
- `modelCanBePublic`: whether the Data Holder allows the trained model to be published to other users.

### UPDATE_LEARNING

`LearningClientSyncResponseDTO`, on every status change of a learning step. Lets the Platform show the progress of a learning.

- `type`: `LEARNING_SYNC` for a normal update, `ERROR` if something failed.
- `error`: technical error message when `type` is `ERROR`.
- `uniqueRandomClinicId`: random id of this Client in this learning, see [LEARNING_QUERY](#learning_query).
- `projectStatus`: status of the run on this Client: pending, initialized, started, running, finished, stopped or error.
- `currentNodeId`: which step of the learning's workflow is meant.
- `stepStatus`: status of that step: init, ready, prepare, running, shutdown, stopped, error or finished.
- `globalUniqueExperimentId`: id of the learning.

### RELAY_CERT

`RelayCertSignRequestDTO`, when a learning step talks to other participants through the Relay Server. Asks the Platform for a certificate, a digital pass the Controller needs to connect to the Relay Server.

- `globalUniqueExperimentId`: id of the learning.
- `uniqueRandomClinicId`: random id of this Client in this learning.
- `currentNodeId`: the workflow step the pass is for.
- `clientId`: id the Relay Server gave this Client for the step.
- `csr`: the certificate request itself. Contains only a public key, never a secret.

### RUN_METRICS

`RunMetricsResponseClientDTO`, after a [metrics request](data-flow-client.md#7-federated-metrics) is approved. Results of a finished learning on this Client's data, e.g. how accurate the model was.

- `globalExperimentUniqueId`: id of the learning.
- `randomClinicId`: random id of this Client in that learning.
- `requestId`: id of the metrics request this answers.
- `metrics`, one entry per value:
  - `metric`: name, e.g. "accuracy" or "loss".
  - `value`: the measured value.
  - `x`: where on a chart the value belongs, e.g. training round 3.
  - `xUnit`: what `x` counts, e.g. "round" or "epoch".

`metrics` is empty when the request asks for the run's output files; those are uploaded separately, see [REST requests](#rest-requests).

## REST requests

| Request | When | Sent |
| --- | --- | --- |
| `GET` schemas, data types, ontologies, Tools, workflows | Cohort setup, Tool runs | Ids only |
| `GET`/`DELETE /schema/subscriptions/{id}` | Cohort created or deleted | Schema id; Client identity from the token |
| `POST /model/result/experiment/upload` | Coordinating Client: trained model; approved run outputs | `experimentId`, `appVersionId`, `clinicId`, `nodeId` (outputs only), files |
| `POST /files/upload`, `DELETE /files/{id}` | TRE test data file changed | The file |

## Controller

Message contents depend on the Tool. See [Client data flow](data-flow-client.md#6-federated-learning).
