---
title: Pipeline Integration and Local Testing
sidebar_position: 4
---

This page covers the tool build pipeline across the Learning APIs, Orchestration API, and frontend.
For run modes, step order, SAST policy, and the rescan user flow, start with the
[Tool Build Pipeline](../../tool-dev/building-pipeline.md) guide.

## Responsibilities and code locations

| Repository | Location | Responsibility |
| --- | --- | --- |
| `Tool-Build-Pipeline` | `src/config.py`, `src/pipeline.py`, `src/steps/` | Parse `RUN_MODE`, select the steps, execute scanner/build commands, and report progress and results. |
| `Tool-Build-Pipeline` | `Dockerfile`, `src/sast/r.yml` | Install the scanners and bundle the standard Python rules and R security policy in the pipeline image. |
| `Learning-APIs` | `core-learning-api/.../core/api/pipeline/` | Share the run-mode enum and dedicated SAST DTOs. |
| `Learning-APIs` | `global-learning-api/.../api/build/pipeline/` | Persist modes, create matching steps, start runs, stream updates, and apply publish summaries. |
| `Learning-APIs` | `global-learning-api/.../scheduler/`, `local-learning-api/.../scheduler/` | Own Quarkus scheduled triggers. |
| `Orchestration-API` | `api/orchestration/container/ContainerPipelineBO.java`, `config/PipelineConfig.java` | Pass mode and registry settings to the pipeline container and prepare its network. |
| `Orchestration-API` | `listener/`, `events/DockerEvents.java`, `service/DockerCleanupService.java` | Subscribe to Docker lifecycle events and clean up finished pipeline containers. |
| `Frontends` | `projects/global-app/src/app/modules/pipeline/` | Select modes and display pipeline steps and security results. |
| `Frontends` | `projects/shared-lib/src/lib/modules/store/dto/publish-info.ts` | Define the shared frontend SAST result types. |

## Local setup

Keep these repositories beside each other:

```text
workspace/
  Learning-APIs/
  Orchestration-API/
  Tool-Build-Pipeline/
  Frontends/               # for UI testing
  Documentation/
```

Use Java 25 and a running Docker daemon. On macOS with Homebrew, select the JDK before starting:

```bash
export JAVA_HOME="$(brew --prefix openjdk@25)/libexec/openjdk.jdk/Contents/Home"
```

Fill in the Global API's `.env` and `orch_secrets.env` from their examples as described in
[Environment secrets](env-secrets.md). From `Learning-APIs`, prepare the local artifacts:

```bash
./mvnw -Dmaven.test.skip=true install
cd ../Orchestration-API
./mvnw -Dmaven.test.skip=true package
cd ../Tool-Build-Pipeline
docker build -t localhost:5001/flnet/tool-build-pipeline:dev .
cd ../Learning-APIs/global-learning-api
../mvnw quarkus:dev
```

Quarkus starts the Compose dependencies and builds the Orchestration API image from its local
packaged artifacts. The pipeline image is already available in the host Docker daemon; once the
registry is running, publish it locally from another terminal:

```bash
docker push localhost:5001/flnet/tool-build-pipeline:dev
```

For later starts, run from `Learning-APIs`:

```bash
cd global-learning-api
../mvnw quarkus:dev
```

| Component | Address or image |
| --- | --- |
| Global API | `http://localhost:8080` |
| Orchestration API | `http://localhost:8191`, built from the sibling repository |
| Registry | `localhost:5001` |
| Pipeline image | `localhost:5001/flnet/tool-build-pipeline:dev` |
| Published tool images | `localhost:5001/flnet/tools/<slug>:<commit>` |
| Global API database | `localhost:5433` |
| Controller | `http://localhost:8192` |

The development file does not override the Compose project name. Quarkus defaults to
`quarkus-devservices-global-learning-api`; a manually prepared stack can use that same name
with `docker compose -p quarkus-devservices-global-learning-api ...` and is discovered on the
next `quarkus:dev` start. Both APIs share
the existing PostgreSQL service and database. The Orchestration API uses the `orch` schema for
Flyway and Hibernate, so no extra database container is needed. The controller has the stable
container name `global-learning-controller`. The shared Docker network is `global-learning-network`.

### Registry and builder configuration

The development Compose file uses anonymous registry access and host-native builds:

| Setting | Local value | Purpose |
| --- | --- | --- |
| `%dev.flnet.pipeline.builder.image` | `localhost:5001/flnet/tool-build-pipeline:dev` | Select the locally built pipeline. |
| `PIPELINE_IMAGE_PREFIX` | `localhost:5001/flnet/tool-build-pipeline` | Allow the Orchestration API to pull this builder repository. |
| `ORCH_DOCKER__PRIVATE__REGISTRY_URL` | `localhost:5001` | Configure the local registry in the Orchestration API. |
| `ORCH_DOCKER__PRIVATE__REGISTRY_API_URL` | `http://registry:5000` | Reach the registry's HTTP API from inside the Orchestration API container for the admin inventory. |
| `PIPELINE_DOCKER_REGISTRY` | `localhost:5001` | Registry for built tool images. |
| `PIPELINE_DOCKER_GROUP` | `flnet/tools` | Repository namespace for built tools. |
| `PIPELINE_DOCKER_LOGIN` | `false` | Use the anonymous local registry. |
| `PIPELINE_DOCKER_USERNAME` | `pipeline` | Nonempty configuration value; unused while login is disabled. |
| `PIPELINE_USE_BUILDX` | `false` | Build on the host architecture through its Docker daemon. |
| `PIPELINE_COSIGN_SIGN` | `false` | Leave local test images unsigned. |
| `PIPELINE_HOST_REMOVE` | `false` | Disable Docker's automatic container removal; lifecycle cleanup still runs. |

The local Compose configuration overrides registry credentials with empty values. The
`orch_secrets.env` file can supply `PIPELINE_REPO_TOKEN` for private tool repositories.

Use `localhost:5001` in image references because pull/push operations use the Docker host through
the mounted socket. The Compose service name `registry` is only resolvable inside the Compose
network. The registry's container port 5000 is exposed on host loopback port 5001.

The frontend's **Admin → Docker & orchestration → Registry** tab lists repositories and tags from
the private registry. The Orchestration API reads the [Registry V2 catalogue and tags endpoints](https://distribution.github.io/distribution/spec/api/#listing-repositories),
following pagination links. The registry must expose these endpoints to the configured account;
registries that disable catalogue access produce an error in the view.

`DockerRegistryService` injects `DockerRegistryRestClient` using `@Inject @RestClient`. The client
declares the Registry V2 endpoints `GET /v2/_catalog` and `GET /v2/{repository}/tags/list`. There is no
standard endpoint that returns every tagged image in one response, so the client combines the
catalogue with each repository's tags and follows pagination links. Image-existence checks use the
Docker Engine's `GET /distribution/{name}/json` through docker-java, keeping full image references
intact without parsing their tags or digests. The REST client owns pagination and its URI
handling; the service combines repositories with their tags. Quarkus manages the client lifecycle
through `@RegisterRestClient(configKey = "docker-registry")`, with standard
`quarkus.rest-client.docker-registry.*` configuration and no custom builder.

`orch.docker."private".registry-api-url` is optional and defaults to HTTPS at the `registry-url`
host and port. Set the complete API URL explicitly for HTTP registries or when the Orchestration API
needs an internal address. Image references still use `registry-url`. The local registry allows
anonymous access. For authenticated catalogue access, configure the REST client's standard
`quarkus.rest-client.docker-registry.headers.*` settings. Registry credentials stay in the API.

The Orchestration API accepts a builder from its configured GHCR or private registry only when its
repository matches `pipeline.image-prefix`; tags and digests are allowed. Keep this setting aligned
with `flnet.pipeline.builder.image` when changing the builder repository.

### Exercise a build and rescan

Start the frontend using [Frontend local setup](../frontend/local-setup.md). In the tool's pipelines,
choose **Build and publish** and start a run. Inspect the SAST, vulnerability, and malware reports
through the Docker image's publish information. After a tool image exists, click its image badge
in the tool overview and use **Rescan vulnerabilities** in the dialog's **Vulnerability scan** header. The rescan
should have only configuration, pull, vulnerability scan, and summary steps after preflight.

For API checks without starting imported builds automatically, start from `global-learning-api` with:

```bash
../mvnw quarkus:dev -Dflnet.tool-imports.build-on-import=NEVER
```

Check the registry and the Orchestration API's view of the builder image:

```bash
curl --fail http://localhost:5001/v2/
curl --fail --get \
  --data-urlencode 'name=localhost:5001/flnet/tool-build-pipeline:dev' \
  http://localhost:8191/docker/image/exists
```

The image lookup should return `true`. For startup or pull errors, inspect:

```bash
docker compose -f global-learning-api/compose-devservices.yml --profile dev logs orch-api registry
```

Run this Compose command from `Learning-APIs`, or supply an absolute Compose file path. If the
stack was started by Quarkus, pass its generated Compose project name with `-p`.
After Orchestration API source changes, stop dev mode, package that API again, and rebuild its
Compose service with `docker compose ... up -d --build orch-api` using that same project name.

## Startup imports and the official registry

Startup imports resolve portable `slug:commit` references against the Orchestration API's configured
pipeline registry and namespace. An imported image is retained only after a registry lookup confirms
that the resolved image exists in that official registry. A missing, forbidden, or unverifiable
image is removed together with its publish information and scan reports; the tool definition is
still imported.

`flnet.tool-imports.build-on-import` controls the next action:

| Policy | Image and reports at import | Automatic build |
| --- | --- | --- |
| `ALWAYS` | Clear the imported image and all previous reports. | Rebuild every imported version. |
| `IF_NOT_EXISTS_IN_STORE` | Clear build information for new versions. Existing versions retain only verified official images. | Build new versions; existing versions without a usable image remain definitions without build information. |
| `IF_NOT_EXISTS_IN_REGISTRY` (default) | Retain a verified official image; otherwise clear the image and reports. | Rebuild when the official image is unavailable. |
| `NEVER` | Retain a verified official image; otherwise import only the definition. | No automatic build. |

For example, a JSON file can refer to an old GitLab image while local development uses
`localhost:5001`. The importer resolves the expected image in the local registry and checks it there.
It does not mark the old GitLab vulnerability report as a scan of the local image. Reports whose
vulnerability target differs from the retained image are discarded. When the same image is already
stored locally, its current publish information takes precedence over the JSON's older reports.

Queued rebuilds also clear the image and publish information when the build actually starts.
Successful builds replace them with fresh results. `SCAN_ONLY` runs keep their existing metadata
and update only the vulnerability report.

Builds still require a configured pipeline image and a source repository. These import policies
do not override the existing checks for an active pipeline or a version already rebuilding.

## API contract and persistence

`PipelineCreateDTO.runMode` defaults to `ALL`. The Global API stores it on the pipeline and returns
it in pipeline DTOs. `StartPipelineDTO` carries the same enum to the Orchestration API, which sets
`RUN_MODE=ALL`, `RUN_MODE=LOCAL_BUILD`, or `RUN_MODE=SCAN_ONLY` in the builder container.

The pipeline record and its mode-specific steps are persisted together in the creation transaction
before an automatically started run is sent to the Orchestration API.
After container startup, the API reloads the pipeline with a write lock in a transaction, records its
container ID, and returns the current state. It updates the managed entity instead of persisting the
earlier detached instance, preserving status and summary updates that arrived during startup.

`LOCAL_BUILD` requires a model pipeline with uploaded files. `SCAN_ONLY` requires an existing
image; app rescans are rejected if the version already has an active pipeline.
For a rescan, `PipelineRunInfoDTO.imageReference` supplies the exact stored tag or digest. The
pipeline pulls it before invoking Trivy.

The Global API creates only the steps required by the mode and completes a run when those steps,
including `COLLECT_SUMMARY`, reach success or warning. On rescan summary updates it preserves the
previous source commit, file links, SAST result, and malware result. The version's publish information
is updated only if the scanned image still matches the version's current image.

Flyway migration `V1.0.4__pipeline_run_mode.sql` adds `pipeline.run_mode`, defaults existing rows to
`ALL`, and updates the pipeline-step constraint to accept `SAST` and `PULL_IMAGE`.

### SAST result contract

`AppPublishInfoDTO.sastScanResult` is optional and uses its own `SastScanResultDTO` in Python, Java,
and TypeScript. It is separate from the Trivy `SecurityScanResultDTO`.

| Field | Meaning |
| --- | --- |
| `tool`, `version`, `target` | Scanner identity, version, and scanned source workspace. |
| `success` | The scan completed successfully with no findings. |
| `complete` | The scan finished without reported scanner errors and did not report an empty scanned-file list. A complete scan may still contain findings. |
| `scannedFiles` | Number of scanned files when reported by OpenGrep. |
| `summary` | Native severity counts: `error`, `warning`, `info`, `unknown`. |
| `findings` | Rule ID, severity, message, relative file path, line/column range, and rule metadata. |
| `errors` | Scanner error type, message, level, code, and affected path when available. |
| `rawReport` | Original OpenGrep report. |

The global frontend displays these fields and distinguishes missing, incomplete, clean, and
finding-bearing scans. A vulnerability-only rescan does not replace this source scan.

### Scanner configuration and checks

The pipeline Dockerfile installs the latest stable OpenGrep release using its official installer
with signature verification for amd64 and arm64. Remote release metadata invalidates the Docker
install cache when a new release appears. The standard `p/python` ruleset is downloaded at image
build time into `/app/src/sast/python.yml`. The bundled `src/sast/r.yml` adds R checks for dynamic
code execution, shell commands, and remote script loading; no standard `p/r` ruleset is available.
The SAST step loads the entire `/app/src/sast` directory and scans Python and R files together offline.
Rebuild the pipeline image to pick up scanner and rule updates. Trivy's database and ClamAV
definitions are also included in the image. The `LOCAL_BUILD` vulnerability scan uses its bundled
database; other modes allow Trivy to refresh it.

`SAST_TIMEOUT` defaults to 30 seconds per rule/file. `SAST_MAX_TARGET_BYTES` defaults to 1,000,000
bytes per file. Both are positive integer pipeline environment settings in `src/config.py`.

Run the existing pipeline checks from `Tool-Build-Pipeline`:

```bash
pip install -r requirements.test.txt
pytest -q
```

The tests mock OpenGrep and Trivy commands and do not require scanner installations, Docker, or
network access. Scanners are installed in the pipeline image rather than in the unit-test CI job.
`python test.py` is a separate development harness that performs a real tool build/run.

### Run the pipeline client directly

Normally the Orchestration API starts the client. For a direct development run from
`Tool-Build-Pipeline`, copy `.env.example` to `.env` and fill in the pipeline identity, API URL,
authentication, and registry settings. The client still needs a matching pipeline in the Learning API
and access to the Docker socket.

For a vulnerability rescan, use:

```bash
RUN_MODE=SCAN_ONLY DOCKER_TAG=your-existing-tag docker compose up --build
```

Here `--build` builds the pipeline client container. The tool image is pulled and scanned, without
being rebuilt or republished. An API-provided `imageReference` takes precedence over the tag fallback.
For private registries, configure `DOCKER_LOGIN=true` with `DOCKER_USERNAME` and `DOCKER_PASSWORD`,
or supply existing Docker credentials. The rescan summary contains `imageName` and
`vulnerabilityScanResult`; the API preserves the other published metadata.

## Schedules and their packages

Quarkus scheduled triggers have dedicated packages. Business operations stay in their BOs.

| API | Package and class | Trigger and delegated operation |
| --- | --- | --- |
| Global | `de.unihamburg.daibetes.scheduler.ToolVulnerabilityRescanScheduler` | Mondays at 03:00 UTC; queues built tool versions through `ToolImportBuildBO.enqueueRescan`. |
| Local | `bio.cosy.feddb.local.scheduler.RelayCertificateScheduler` | Every 30 seconds; calls `RelayCertBO.retryPending()` to retry pending relay certificates. |

Both triggers skip overlapping invocations. Weekly rescans reuse the ordered build queue, process
one image at a time, and skip versions that are already rebuilding or have an active pipeline.
Rescans are independent of the import build policy.

Configure `flnet.pipeline.rescan.cron` or its environment variable `FLNET_PIPELINE_RESCAN_CRON`.
The production default is `0 0 3 ? * MON`; dev/test profiles default to `off`.
Set `off` to disable it. To exercise the schedule every five minutes, start from
`Learning-APIs/global-learning-api`:

```bash
../mvnw quarkus:dev -Dflnet.pipeline.rescan.cron='0 */5 * * * ?'
```

The property is also declared in `FLNetConfig` so it is accepted by the Global API's config mapping.
The local `ClientManager` keeps its connection-specific reconnect/token-refresh timers with its
connection state; these are separate from Quarkus scheduled jobs.

## Container startup and cleanup events

`ContainerPipelineBO` loads the allowed builder image, creates its container, attaches the required
networks, registers the container for shutdown handling, and starts it. Local builds get host API
access; build-and-publish and rescan runs get external network access for registry operations.

`ListenerStartup` owns startup and shutdown of the Docker event subscription. Its startup observer
runs after ownership initialization and subscribes on a Quarkus-managed executor. Mutiny retries
failed streams with backoff; shutdown cancels the subscription and closes the callback.

`DockerEventListener` subscribes to container `die` events filtered by the ownership/pipeline labels
and sends the container ID to the `containerDied` Vert.x event-bus address.
`DockerEvents.containerDied` is a blocking, ordered consumer, so Docker cleanup runs on a worker
thread. It removes the finished container and associated resources, then removes the ID from
`ContainerPipelineBO`'s tracked set. `DockerCleanupService` checks ownership before removing resources.
