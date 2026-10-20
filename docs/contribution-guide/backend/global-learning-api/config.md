---
sidebar_position: 1
id: config
title: Config Guide
---

# Global Learning API Configuration Reference

This document describes the project-specific configuration consumed by the Global Learning API.
It intentionally focuses on application-level keys and excludes generic Quarkus runtime settings.

The canonical mapping for these properties is **FLNetConfig**.
## Design Notes

- Prefix: all global custom properties live under `flnet.*`.
- Source of truth: defaults can come from either `FLNetConfig` or `flnet.properties`, which holds all `flnet.*` values except `flnet.bff.*` (in `security.properties`). See [Configuration files](../overview.md#configuration-files).
- Removed: `flnet.feddb-client.auth.enable`. Clients must always authenticate with their Platform account.
- Backward compatibility: property names are already used in runtime code and should not be renamed casually.
- Profile overrides: some values intentionally differ in `dev`, `test`, or `staging`.

## Quick Reference

| Property | Type | Default | Purpose |
| --- | --- | --- | --- |
| `flnet.create-vector-extension-on-startup` | `boolean` | `true` | Enables vector extension preparation during startup. |
| `flnet.ingestor.enable-start-up` | `boolean` | `true` | Runs the store ingestor during startup. |
| `flnet.ingestor.ignore-start-up-check` | `boolean` | `false` | Bypasses ingestor startup safety checks. |
| `flnet.tool-configs.enabled` | `boolean` | `false` in code, `true` in shipped config | Enables external tool config discovery. |
| `flnet.tool-configs.paths` | `List<Path>` | `tool-configs` in shipped config | Declares tool config lookup roots. |
| `flnet.tool-imports.enabled` | `boolean` | `false` in code, `true` in shipped config | Enables external tool imports. |
| `flnet.tool-imports.paths` | `List<Path>` | `tool-imports` in shipped config | Declares tool import roots. |
| `flnet.tool-imports.create-unpublished-version` | `boolean` | `false` | Imports tools as unpublished versions. |
| `flnet.tool-imports.override-existing` | `boolean` | `true` | Updates existing imported tool definitions. |
| `flnet.tool-imports.build-on-import` | `ToolImportBuildingOnStart` | `IF_NOT_EXISTS_IN_REGISTRY` | Selects which imported versions are rebuilt. |
| `flnet.workflow-imports.enabled` | `boolean` | `false` in code, `true` in shipped config | Enables workflow imports. |
| `flnet.workflow-imports.paths` | `List<Path>` | `workflow-imports` in shipped config | Declares workflow import roots. |
| `flnet.workflow-imports.create-unpublished-version` | `boolean` | `false` | Imports workflows as unpublished versions. |
| `flnet.pipeline.builder.image` | `String` | set in shipped config | Selects the pipeline builder image. |
| `flnet.pipeline.rescan.cron` | `String` | `0 0 3 ? * MON`; dev/test: `off` | Queues weekly vulnerability rescans of built tool versions in UTC. |
| `flnet.federated-learning.participants.minamount` | `int` | `3` | Defines the minimum clinic count for federated experiments. |
| `flnet.audit.min-acceptance-amount` | `long` | `1` | Defines the minimum accepted audits for certification progress. |
| `flnet.tools.semantic-scholar.api-key` | `String` | none | Supplies an optional Semantic Scholar API key. |
| `flnet.tools.semantic-scholar.limit` | `int` | `100` | Caps Semantic Scholar result volume. |
| `flnet.guardtrails.prompt-injection.enabled` | `boolean` | `true` | Enables prompt injection validation. |
| `flnet.guardtrails.prompt-injection.agent.enabled` | `boolean` | `true` | Enables model-based prompt injection scoring. |
| `flnet.guardtrails.prompt-injection.score.threshold` | `double` | `0.7` | Defines prompt injection failure sensitivity. |
| `flnet.guardtrails.grounding.enabled` | `boolean` | `true` | Enables grounding checks. |
| `flnet.guardtrails.grounding.score.threshold` | `double` | `0.7` | Defines grounding acceptance sensitivity. |
| `flnet.data-analysis.inactivity-timeout` | `Duration` | `20S` | Limits tolerated inactivity during analysis runs. |
| `flnet.data-analysis.absolute-timeout` | `Duration` | `10M` | Sets the hard runtime cap for analysis runs. |

## Startup And Bootstrap

### `flnet.create-vector-extension-on-startup`

- Type: `boolean`
- Default: `true`
- Required: no
- Purpose: Controls whether the service tries to prepare the vector database extension during startup.
- Runtime effect: If enabled, the startup hook attempts to initialize the vector extension before other bootstrapping steps continue. Disable this if the database is managed externally and startup should not modify extensions.
- Allowed values: `true`, `false`

### `flnet.ingestor.enable-start-up`

- Type: `boolean`
- Default: `true`
- Profile overrides: `%dev=false`, `%test=false`
- Required: no
- Purpose: Enables the store ingestor during service startup.
- Runtime effect: When enabled, startup triggers automatic ingestion of store content. This is useful in managed environments, but often undesirable in local development and tests because it adds side effects and startup time.
- Allowed values: `true`, `false`

### `flnet.ingestor.ignore-start-up-check`

- Type: `boolean`
- Default: `false`
- Required: no
- Purpose: Allows the ingestor startup check to be bypassed.
- Runtime effect: This is a safety override. Turning it on can help in recovery or bootstrap scenarios, but it also reduces protection against invalid ingestion prerequisites.
- Allowed values: `true`, `false`

## Tool Configuration Discovery

### `flnet.tool-configs.enabled`

- Type: `boolean`
- Default: `false` in code, set to `true` in the shipped `flnet.properties`
- Required: no
- Purpose: Enables lookup of external tool configuration descriptors from configured roots.
- Runtime effect: If disabled, the external standard handler skips directory-based tool config discovery entirely.
- Allowed values: `true`, `false`

### `flnet.tool-configs.paths`

- Type: `List<Path>`
- Default: none in code, set to `tool-configs` in the shipped `flnet.properties`
- Required: only if `flnet.tool-configs.enabled=true`
- Purpose: Defines one or more filesystem roots that contain tool configuration descriptors.
- Runtime effect: The application scans these paths when resolving externally managed tool configs.
- Allowed values: Any readable path or comma-separated path list resolvable by the runtime environment

## Tool Import

### `flnet.tool-imports.enabled`

- Type: `boolean`
- Default: `false` in code, set to `true` in the shipped `flnet.properties`
- Required: no
- Purpose: Enables automatic import of external tool definitions.
- Runtime effect: Startup and import handlers will process configured tool import locations only when this flag is enabled.
- Allowed values: `true`, `false`

### `flnet.tool-imports.paths`

- Type: `List<Path>`
- Default: none in code, set to `tool-imports` in the shipped `flnet.properties`
- Required: only if `flnet.tool-imports.enabled=true`
- Purpose: Declares the import roots for external tool definitions.
- Runtime effect: These directories are used for startup imports and export target resolution.
- Allowed values: Any readable or writable path list supported by the deployment

### `flnet.tool-imports.create-unpublished-version`

- Type: `boolean`
- Default: `false`
- Required: no
- Purpose: Decides whether imported tools should create an unpublished version instead of being treated as directly publishable content.
- Runtime effect: This changes the lifecycle state of imported tools and therefore affects review, publishing, and visibility workflows.
- Allowed values: `true`, `false`

### `flnet.tool-imports.override-existing`

- Type: `boolean`
- Default: `true`
- Purpose: Updates existing imported tool definitions and permits the existing single-version override behavior.
- Allowed values: `true`, `false`

### `flnet.tool-imports.build-on-import`

- Type: `ToolImportBuildingOnStart`
- Default: `IF_NOT_EXISTS_IN_REGISTRY`
- Environment variable: `FLNET_TOOL_IMPORTS_BUILD_ON_IMPORT`
- Allowed values: `ALWAYS`, `IF_NOT_EXISTS_IN_STORE`, `IF_NOT_EXISTS_IN_REGISTRY`, `NEVER`
- Purpose: Selects whether startup imports rebuild all versions, only new versions, only missing official images, or none.
- Runtime effect: Rebuild candidates start without the imported image or scan reports. Other versions retain an image only after it is verified in the official registry. If the policy does not rebuild an unavailable image, the definition is still imported without build information.

See [Startup imports and the official registry](../tool-build-pipeline.md#startup-imports-and-the-official-registry)
for the policy table and report handling.

## Workflow Import

### `flnet.workflow-imports.enabled`

- Type: `boolean`
- Default: `false` in code, set to `true` in the shipped `flnet.properties`
- Required: no
- Purpose: Enables workflow import from configured filesystem roots.
- Runtime effect: If enabled, startup imports workflow bundles from the configured locations.
- Allowed values: `true`, `false`

### `flnet.workflow-imports.paths`

- Type: `List<Path>`
- Default: none in code, set to `workflow-imports` in the shipped `flnet.properties`
- Required: only if `flnet.workflow-imports.enabled=true`
- Purpose: Lists the directories used as workflow import roots.
- Runtime effect: Workflow import and export logic read from and write to these roots depending on the operation.
- Allowed values: Any readable or writable path list supported by the deployment

### `flnet.workflow-imports.create-unpublished-version`

- Type: `boolean`
- Default: `false`
- Required: no
- Purpose: Mirrors the tool import draft behavior for workflow imports.
- Runtime effect: Imported workflows can be kept unpublished first, which is useful when imports should go through validation or review before exposure.
- Allowed values: `true`, `false`

## Build And Delivery

### `flnet.pipeline.builder.image`

- Type: `String`
- Default: none in code, set in the shipped `flnet.properties`
- Required: effectively yes for pipeline build flows
- Profile overrides: `%dev=localhost:5001/flnet/tool-build-pipeline:dev`
- Purpose: Defines the container image used by the pipeline builder integration.
- Runtime effect: Changing this value switches the build image used for pipeline generation and execution preparation. This directly affects available tooling, runtime compatibility, and reproducibility.
- Allowed values: A valid container image reference

### `flnet.pipeline.rescan.cron`

- Type: `String`
- Default: `0 0 3 ? * MON` (Monday at 03:00 UTC)
- Profile overrides: `%dev=off`, `%test=off`
- Environment variable: `FLNET_PIPELINE_RESCAN_CRON`
- Purpose: Queues `SCAN_ONLY` pipelines for built tool versions through `ToolVulnerabilityRescanScheduler`.
- Runtime effect: The build queue rescans one image at a time and skips versions with active pipelines. Previous source, SAST, and malware metadata are preserved.
- Allowed values: A Quarkus scheduler cron expression, or `off` to disable the trigger.

See [Pipeline integration and local testing](../tool-build-pipeline.md) for the local registry,
builder configuration, scheduler packages, and a five-minute development schedule.

## Issue Reporting

Issue reporting needs no configuration. *Report an issue* in the frontend opens a prefilled issue on
[FedLearnNet/.github](https://github.com/FedLearnNet/.github/issues/new), which the user submits with their own GitHub account.
The former `flnet.gitlab.issue.*` properties, the GitLab token, and the `/issue` endpoints have been removed.

## Federated Learning Policy

### `flnet.federated-learning.participants.minamount`

- Type: `int`
- Default: `3`
- Profile overrides: `%dev=0`, `%test=0`, `%staging=0`
- Required: no
- Purpose: Defines the minimum number of participating clinics required by federated experiment logic.
- Runtime effect: The value gates experiment progress and approval logic. Lower values make development easier; higher values enforce stricter production readiness.
- Allowed values: Any integer greater than or equal to `0`

## Audit And Certification

### `flnet.audit.min-acceptance-amount`

- Type: `long`
- Default: `1`
- Required: no
- Purpose: Sets the threshold of accepted audit decisions required before a version can gain certification progress.
- Runtime effect: Increasing this threshold makes certification harder to reach and reduces the likelihood of early promotion based on too few approvals.
- Allowed values: Any integer greater than or equal to `0`

## Research Tooling

### `flnet.tools.semantic-scholar.api-key`

- Type: `String`
- Default: none
- Required: no
- Purpose: Optional API key for Semantic Scholar requests.
- Runtime effect: If present and non-blank, requests are sent with authenticated access. If absent, the service falls back to unauthenticated requests.
- Allowed values: A valid Semantic Scholar API key

### `flnet.tools.semantic-scholar.limit`

- Type: `int`
- Default: `100`
- Required: no
- Purpose: Upper bound for search result count requested from Semantic Scholar.
- Runtime effect: Higher values return more data but also increase response size and downstream processing cost.
- Allowed values: Any integer greater than or equal to `0`

## Guardrails

### `flnet.guardtrails.prompt-injection.enabled`

- Type: `boolean`
- Default: `true`
- Required: no
- Purpose: Enables prompt injection detection for analysis/chat inputs.
- Runtime effect: If disabled, prompt injection validation is bypassed completely for this guardrail.
- Allowed values: `true`, `false`

### `flnet.guardtrails.prompt-injection.agent.enabled`

- Type: `boolean`
- Default: `true`
- Required: no
- Purpose: Enables the model-based prompt injection check in addition to the static pattern blocklist.
- Runtime effect: When disabled, only the static pattern detection remains active. This reduces cost and latency but also lowers detection depth.
- Allowed values: `true`, `false`

### `flnet.guardtrails.prompt-injection.score.threshold`

- Type: `double`
- Default: `0.7`
- Required: no
- Purpose: Threshold above which the prompt injection score is treated as a failure.
- Runtime effect: Lower values make the system more conservative and may increase false positives. Higher values reduce sensitivity.
- Allowed values: A numeric score, typically between `0.0` and `1.0`

### `flnet.guardtrails.grounding.enabled`

- Type: `boolean`
- Default: `true`
- Required: no
- Purpose: Enables grounding validation features.
- Runtime effect: This flag is intended to gate grounding-related checks and scoring in the analysis pipeline.
- Allowed values: `true`, `false`

### `flnet.guardtrails.grounding.score.threshold`

- Type: `double`
- Default: `0.7`
- Required: no
- Purpose: Threshold used by grounding validation logic.
- Runtime effect: Lower thresholds make the system stricter; higher thresholds tolerate weaker grounding signals.
- Allowed values: A numeric score, typically between `0.0` and `1.0`

## Data Analysis Runtime

### `flnet.data-analysis.inactivity-timeout`

- Type: `Duration`
- Default: `20S`
- Required: no
- Purpose: Maximum tolerated inactivity window for a data analysis run.
- Runtime effect: When wired into monitoring, this timeout is intended to fail or interrupt runs that stop producing progress for too long.
- Allowed values: Any Quarkus/SmallRye-compatible duration value such as `20S`, `2M`, or `1H`

### `flnet.data-analysis.absolute-timeout`

- Type: `Duration`
- Default: `10M`
- Required: no
- Purpose: Hard upper bound for the total runtime of a data analysis run.
- Runtime effect: This protects the system from hanging or excessively long-running analysis jobs.
- Allowed values: Any Quarkus/SmallRye-compatible duration value such as `10M`, `30M`, or `1H`

## Operational Guidance

- Prefer environment-specific overrides for secrets, tokens, image references, and filesystem roots.
- Keep `dev` and `test` overrides explicit when production defaults are intentionally stricter.
- If you add a new `flnet.*` key, update both `FLNetConfig` and this reference in the same change.
