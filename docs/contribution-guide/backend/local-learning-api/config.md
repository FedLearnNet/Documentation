---
sidebar_position: 1
id: config
title: Config Guide
---

# Local Learning API Configuration Reference

The Local Learning API configuration is defined by
`local-learning-api/src/main/java/bio/cosy/feddb/local/config/FLNetClientConfig.java`.
The interface is annotated with `@ConfigMapping(prefix = "flnet")`, so every
property documented here starts with `flnet.`.

Older documentation used keys such as `feddb.*`, `global.socket.*`, or
`gitlab.issue.*` without the `flnet.` prefix. Those keys are outdated for the
current `FLNetClientConfig` object.

Generic Quarkus settings, database settings, logging settings, and
infrastructure ports are configured in `application.properties` as well, but
they are not part of `FLNetClientConfig` and are not listed here.

## Naming Rules

Java method names are converted to kebab-case unless the config object uses
`@WithName`.

Examples:

- `clientId()` with `@WithName("client-id")` becomes `flnet.global.auth.client-id`.
- `deleteTraceability()` with `@WithName("delete-traceability")` becomes `flnet.cohort.delete-traceability`.
- `importRowLimitForDiskCache()` becomes `flnet.connector.import-row-limit-for-disk-cache`.

`@WithDefault` defines the Java fallback value. `application.properties` can
still override that fallback for the default profile or for profile-specific
settings such as `%dev`, `%test`, `%staging`, or `%prod`.

## Quick Reference

| Property | Type | Java default | Shipped/profile value | Purpose |
| --- | --- | --- | --- | --- |
| `flnet.global.socket.enabled` | Boolean | `true` | `true`, `%test=false` | Enables the socket connection to the global service. |
| `flnet.global.socket.uri` | URI | required | `ws://localhost:8080` | WebSocket URI of the global service. |
| `flnet.global.socket.reconnect.attempts` | Integer | `5` | `-1`, `%dev=5` | Number of reconnect attempts. `-1` means unlimited attempts. |
| `flnet.global.socket.reconnect.delay.init` | Integer | `1000` | `1000` | Initial reconnect delay in milliseconds. |
| `flnet.global.socket.reconnect.delay.reconnect` | Integer | `30000` | `30000` | Delay between reconnect attempts in milliseconds. |
| `flnet.global.auth.enable` | Boolean | `true` | `true`, `%prod=false`, `%staging=false` | Enables authentication for global API calls. |
| `flnet.global.auth.url` | URI | `https://staging.featurecloud.ai/feddb/global-auth` | same | Authentication server URL. |
| `flnet.global.auth.realm` | String | `FederatedDB_Global` | same | Authentication realm. |
| `flnet.global.auth.client-id` | String | `frontend` | `clinic-direct-connect` | Authentication client id. |
| `flnet.global.auth.username` | Optional String | none | `test` | Username used for configured auth flows. |
| `flnet.global.auth.password` | Optional String | none | `test` | Password used for configured auth flows. |
| `flnet.global.auth.authorization-header` | Optional String | none | commented example | Static authorization header, for example `Bearer ...`. |
| `flnet.gitlab.issue.token` | Optional String | none | env/commented | Token for creating GitLab issues. |
| `flnet.gitlab.issue.project-id` | Integer | `9` | `9` | GitLab project id used by issue reporting. |
| `flnet.permission.add-on-create` | Optional Boolean | none | `true` | Adds permissions when supported entities are created. |
| `flnet.permission.user-name` | Optional String | none | none | User name used by the permission bootstrap flow. |
| `flnet.permission.group-name` | Optional String | none | none | Group name used by the permission bootstrap flow. |
| `flnet.permission.query-retry-time` | Integer | `3` | default | Retry count for permission-related query handling. |
| `flnet.privacy.query.min-count` | Integer | `100` | `100` | Minimum result count for privacy-safe query responses. |
| `flnet.privacy.statistics.enabled` | Boolean | `true` | `true` | Enables privacy handling for local statistics. |
| `flnet.privacy.statistics.min-subjects` | Integer | `10` | `10` | Minimum subject count before statistics are returned. |
| `flnet.privacy.statistics.count-rounding-base` | Integer | `5` | `5` | Rounding base for count values. |
| `flnet.privacy.statistics.unique-rounding-base` | Integer | `5` | `5` | Rounding base for unique counts. |
| `flnet.privacy.statistics.min-category-count` | Integer | `3` | `3` | Minimum count for category values. |
| `flnet.privacy.statistics.numeric-decimals` | Integer | `1` | `1` | Decimal places kept for numeric statistics. |
| `flnet.privacy.statistics.remove-extreme-values` | Boolean | `true` | `true` | Removes extreme numeric values from privacy-safe statistics. |
| `flnet.privacy.statistics.keep-local-ids` | Boolean | `false` | `false` | Keeps local ids in statistics output when enabled. |
| `flnet.request.data-statistics.enabled` | Boolean | `true` | `true` | Enables data-statistics request handling. |
| `flnet.request.data-statistics.return-all-on-empty` | Boolean | `false` | `false`, `%dev=true` | Returns all statistics on empty request filters. |
| `flnet.user.system-user-name` | String | `SYSTEM` | `SYSTEM` | Local system user name. |
| `flnet.calendar.gregorian.adoption` | String | `pragmatic` | `pragmatic` | Gregorian calendar adoption strategy. |
| `flnet.cohort.delete-traceability` | Boolean | `true` | `true` | Deletes cohort traceability data when cohort data is removed. |
| `flnet.connector.external-id-column` | String | `Unique Patient ID` | `Unique Patient ID` | Column used as the external patient id during connector imports. |
| `flnet.connector.import-flush-clear-batch-size` | Integer | `50` | default | Number of persisted patients before Hibernate flush/clear during connector imports. |
| `flnet.connector.import-progress-publish-batch-size` | Integer | `50` | default | Number of imported patients between progress events. |
| `flnet.connector.import-row-limit-for-disk-cache` | Integer | `100` | default | Row threshold used to choose in-memory rows or disk-backed JSONL array row storage. |
| `flnet.auto-subscribe.enabled` | Boolean | `false` | `%dev=true` | Enables auto-subscribe bootstrap groups. |
| `flnet.auto-subscribe.<group>.global-schema-id` | String | required per group | dev/test examples | Global schema id for an auto-subscribe group. |
| `flnet.auto-subscribe.<group>.cohort-name` | String | required per group | dev/test examples | Cohort name for an auto-subscribe group. |
| `flnet.auto-subscribe.<group>.etl-data-path` | Optional String | none | dev/test examples | Local ETL data path used by the group. |
| `flnet.auto-subscribe.<group>.connector-path` | Optional String | none | dev/test examples | Connector definition path used by the group. |
| `flnet.auto-subscribe.<group>.query-retry-time` | Integer | `3` | default | Retry count for group queries. |
| `flnet.auto-subscribe.<group>.is-allowed-to-query` | Boolean | `true` | default | Whether the group is allowed to query. |
| `flnet.auto-subscribe.<group>.query-sample-threshold` | Integer | `100` | default | Minimum sample threshold for group queries. |
| `flnet.auto-subscribe.<group>.add-for-user` | Optional String | none | dev/test examples | Adds the group for a specific user. |
| `flnet.auto-subscribe.<group>.auto-training-access` | `AutoTrainingAccess` | `ALL` | default | Default training access granted to the group. |
| `flnet.auto-subscribe.<group>.auto-statistics-access` | `AutoStatisticsAccess` | `ALL` | default | Default statistics access granted to the group. |
| `flnet.auto-subscribe.<group>.enabled-file-watching` | Boolean | `false` | dev/test examples | Enables file watching for group ETL inputs. |

## Global Connection

The `global` section configures communication with the global learning API.
It has two nested parts: `socket` and `auth`.

`flnet.global.socket.*` controls the WebSocket connection. The Local Learning
API uses this connection to communicate with the global service. In tests the
socket is disabled through `%test.flnet.global.socket.enabled=false`.

`flnet.global.socket.reconnect.attempts` is especially important for runtime
behavior. The Java object defaults to `5`, but the shipped application property
sets it to `-1` for the default profile, which means the client keeps trying to
reconnect. The development profile overrides it back to `5`.

`flnet.global.auth.*` controls authentication for global API calls. The Java
default client id is `frontend`; the shipped configuration uses
`clinic-direct-connect`. Production and staging currently disable the auth flag
with profile-specific overrides.

Secrets such as passwords, tokens, and static authorization headers should be
provided through environment-specific configuration instead of committed values.

## GitLab Issues

The `gitlab.issue` section configures GitLab issue reporting:

- `flnet.gitlab.issue.project-id` selects the target GitLab project.
- `flnet.gitlab.issue.token` is optional in the Java object and should be
  supplied through a secure environment-specific source when issue creation is
  enabled.

## Permissions

The `permission` section controls permission bootstrap behavior.

`flnet.permission.add-on-create` is optional in the Java object and is set to
`true` in the shipped application properties. When enabled, the Local Learning
API adds permissions during supported create flows.

`flnet.permission.user-name` and `flnet.permission.group-name` are optional
bootstrap identities. `flnet.permission.query-retry-time` controls retry
behavior and defaults to `3`.

## Privacy

The `privacy` section is split into query privacy and statistics privacy.

`flnet.privacy.query.min-count` is the minimum count required before query
results are considered safe to return. It defaults to `100`.

`flnet.privacy.statistics.*` defines the privacy transformations applied to
local statistics responses. The defaults enforce a minimum subject count,
round counts to configured bases, suppress small categories, keep numeric
precision to one decimal place, remove extreme values, and avoid returning
local ids.

These settings are part of the privacy boundary of the Local Learning API.
Changing them can affect what downstream users are allowed to infer from local
data.

## Request Data Statistics

The `request.data-statistics` section controls whether data-statistics requests
are handled and what happens when filters are empty.

`flnet.request.data-statistics.return-all-on-empty` defaults to `false`, but the
development profile sets it to `true`. That makes local development easier, but
it should be treated carefully in environments with real data.

## Local Identity And Calendar

`flnet.user.system-user-name` defines the internal system user name and defaults
to `SYSTEM`.

`flnet.calendar.gregorian.adoption` controls the Gregorian calendar adoption
strategy. The current default and shipped value is `pragmatic`.

## Cohort Traceability

`flnet.cohort.delete-traceability` controls whether traceability records are
deleted when cohort data is removed. It defaults to `true`.

This setting is relevant for cleanup behavior and for environments where audit
or traceability retention requirements differ.

## Connector Import ETL

The `connector` section configures connector-driven ETL imports.

`flnet.connector.external-id-column` tells the importer which transformed table
column contains the external patient id. The default is `Unique Patient ID`.
During loading, that value is used to group rows by patient so that complete
patient-level checks can run before data is stored.

`flnet.connector.import-flush-clear-batch-size` controls how often the loader
flushes and clears Hibernate state while importing patient batches. Lower values
reduce persistence-context memory pressure; higher values can reduce database
round trips.

`flnet.connector.import-progress-publish-batch-size` controls how often progress
events are published during an import.

`flnet.connector.import-row-limit-for-disk-cache` controls row storage strategy:

- If an imported table is below the threshold, rows can stay in memory.
- If an imported table reaches the threshold, row handling switches to
  disk-backed JSON Lines array storage through `TableDataFileHandler`.

The disk-backed path prevents large `List<Map<String, Object>>` row collections
from growing until they exhaust Java heap memory. Rows are appended step by
step to JSONL files, read through streaming iteration, and updated by writing a
replacement file instead of mutating a large in-memory list.

The JSONL cache stores column names once in table metadata and writes each row
as a compact value array in that column order, for example
`["P-001","baseline","5.6"]`. When streamed back, the handler reconstructs the
normal `Map<String, Object>` row shape for mapping and loading.

## Auto Subscribe

Auto-subscribe is configured through a dynamic map under
`flnet.auto-subscribe.<group>.*`. The group name is part of the property key.

Example shape:

```properties
flnet.auto-subscribe.enabled=true
flnet.auto-subscribe.us-130.global-schema-id=...
flnet.auto-subscribe.us-130.cohort-name=...
flnet.auto-subscribe.us-130.etl-data-path=/path/to/etl-data
flnet.auto-subscribe.us-130.connector-path=/path/to/connector.json
flnet.auto-subscribe.us-130.add-for-user=local-user
flnet.auto-subscribe.us-130.enabled-file-watching=true
```

Each group must provide `global-schema-id` and `cohort-name`. The ETL data path,
connector path, and user assignment are optional in the Java object, but they
are commonly used by development and test configurations.

`auto-training-access` and `auto-statistics-access` default to `ALL`. The
available enum values are defined in the local API model classes
`AutoTrainingAccess` and `AutoStatisticsAccess`.

## Operational Guidance

Use `flnet.*` keys when adding or overriding Local Learning API settings. If a
new Java method is added to `FLNetClientConfig`, update this page and
`application.properties` together so the documented key, Java default, and
shipped profile behavior stay aligned.

For large connector imports, tune the connector section first. In particular,
increase or decrease `flnet.connector.import-row-limit-for-disk-cache` based on
available heap, disk performance, and typical table size. The default keeps
small imports simple while routing larger imports through the disk-backed JSONL
array path.
