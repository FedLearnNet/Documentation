---
id: building-pipeline
title: Tool Build Pipeline
sidebar_position: 4
---

The tool build pipeline builds, scans, tests, and publishes tool images for %%DEPLOYED_PRODUCT_NAME%%.
The Learning API creates the run, the Orchestration API starts its container, and the pipeline reports
step progress, logs, and scan results back to the Learning API.

For the local development stack and implementation details, see
[Pipeline integration and local testing](../contribution-guide/backend/tool-build-pipeline.md).

## Run modes

Choose **Run mode** when starting a build in the global frontend. The list and detail views show
the selected mode. Manual vulnerability rescans start from the scan-results dialog.

| Mode | Frontend label | Purpose |
| --- | --- | --- |
| `ALL` | Build and publish | Clone the tool repository, build and validate an image, then push it to the configured registry. This is the default. |
| `LOCAL_BUILD` | Local build from uploaded files | Build from the API-provided ZIP and keep the image on the Docker host. Available for model pipelines with uploaded files. |
| `SCAN_ONLY` | Rescan vulnerabilities (scan-results dialog) | Pull a previously built image and check it for newly disclosed vulnerabilities. Requires an existing image. |

`LOCAL_BUILD` replaces the former `local_only` flag. The API and orchestrator use the enum values
above, and the pipeline receives them through `RUN_MODE`.

Running `ALL` against the local development registry is still **Build and publish**. Use
`LOCAL_BUILD` for uploaded build contexts that should stay on the Docker host.

## Steps and execution order

The Learning API also records a `PREFLIGHT` step for orchestration. The pipeline container runs the
following steps in order:

| Step | ALL | LOCAL_BUILD | SCAN_ONLY | Behavior |
| --- | :---: | :---: | :---: | --- |
| `FETCH_CONFIG` | Yes | Yes | Yes | Fetch repository and image metadata from the Learning API. |
| `CLONE_REPO` | Yes | — | — | Clone the repository's `main` branch and record the commit hash. |
| `FETCH_FILES` | Yes | Yes | — | Fetch the API-provided ZIP. Inject files into the cloned context, or use the ZIP as the complete local context. |
| `SAST` | Yes | Yes | — | Scan the prepared source with OpenGrep. |
| `BUILD_IMAGE` | Yes | Yes | — | Build the tool image. |
| `PULL_IMAGE` | — | — | Yes | Pull the stored image reference before scanning. |
| `SCAN_IMAGE` | Yes | Yes | Yes | Scan the Docker image for HIGH and CRITICAL vulnerabilities with Trivy. |
| `MALWARE_CHECK` | Yes | Yes | — | Scan the source workspace with ClamAV. |
| `RUN_PYTEST` | Yes | Yes | — | Run `python -m main` in the tool image with `TEST_MODE=true`. |
| `PUSH_IMAGE` | Yes | — | — | Publish the image to the configured registry. |
| `COLLECT_SUMMARY` | Yes | Yes | Yes | Upload the image reference and available scan results. |

`ALL` tags the image with the cloned commit hash. `LOCAL_BUILD` uses
`imageName:dockerTag` without a registry prefix, skips registry login and publishing, and runs the
test container with `--network none`. Its Trivy scan uses the database baked into the pipeline image.

SAST, vulnerability scans, and container tests can report `WARNING` while the remaining steps
continue. Mandatory-step failures, including malware detection, stop the run. A successful pipeline
can therefore still have security findings or test warnings; inspect the step and scan reports.

## SAST with OpenGrep

The `SAST` step uses [OpenGrep](https://github.com/opengrep/opengrep) after source files have been
prepared and before the Docker image is built.
It uses the platform-owned rules bundled in `Tool-Build-Pipeline/src/sast/fl-net.yml`, without
downloading rules at runtime.

The policy contains 12 targeted rules for Python tools, Dockerfiles, and YAML:

| Area | Checks |
| --- | --- |
| Code execution | `eval`/`exec`, shell commands and subprocess calls with `shell=True`. |
| Deserialization | Unsafe YAML loaders, pickle/dill/joblib loading, and explicit `torch.load(weights_only=False)`. |
| Connections and files | Disabled TLS verification, insecure temporary files, and unsafe TAR extraction. |
| Deployment and secrets | Flask debug mode, hardcoded credentials, remote Docker `ADD`, and Python object constructors in YAML. |

Model deserialization findings are advisory because trusted ML artifacts commonly use these formats.
The policy is a focused set of checks rather than complete coverage of every language or vulnerability.

Repository ignore files and `nosem` comments cannot suppress the platform policy. The scanner excludes
`.git`, virtual environments, dependency/cache directories, notebooks, and listed data/model formats.
Python source in `models/` and tests remains in scope. The default limits are 30 seconds per rule/file
and 1,000,000 bytes per target file.

Findings appear in step logs with the file, line, rule, and remediation message. Open the Docker
image's publish information to inspect the SAST report alongside vulnerability and malware results.
The SAST view shows native `ERROR`, `WARNING`, and `INFO` counts, findings, scanner version, scanned
file count, scan errors, and the raw report.

A complete scan with findings differs from an incomplete scan. Parse errors, timeouts, or a scan
that examined no source files produce warnings. Missing reports are shown as unavailable.
See the [SAST result contract](../contribution-guide/backend/tool-build-pipeline.md#sast-result-contract)
for the DTO fields and the meaning of `complete` and `success`.

## Rescan an existing tool image

In the tool overview, click the Docker image badge to open its scan-results dialog, then select
**Rescan vulnerabilities** in the **Vulnerability scan** panel header. This is the only manual
rescan action in the frontend. It opens the
new run's live pipeline details. The overview and pipeline mode selector do not offer a rescan action.

Image badges shorten commit hashes to eight characters. Hover over the badge for the full image
reference; the stored reference and scan target remain unchanged.

A rescan:

1. Fetches the image reference stored for the tool version.
2. Pulls that exact tag or digest from the registry.
3. Runs Trivy against the pulled Docker image with its current vulnerability database.
4. Uploads the vulnerability result.

It does not rebuild or republish the tool, fetch its source, repeat SAST or malware checks, or run the
tool container. A failed pull stops the run. The previous commit, source file links, SAST result, and
malware result are preserved when the Learning API applies the new vulnerability report.

If a direct pipeline caller does not provide `imageReference`, the pipeline constructs the reference
from the registry, group, image name, and the API's `dockerTag` or an explicitly configured
`DOCKER_TAG`. A missing tag fails rather than silently choosing `latest`; explicitly selecting
`latest` is supported.

## Weekly vulnerability rescans

The Global Learning API queues `SCAN_ONLY` runs for built tool versions every Monday at 03:00 UTC.
It skips versions with active pipelines and processes its build/rescan queue one image at a time.
Automatic rescans are disabled in development and test profiles.

Operators can change or disable the schedule through `flnet.pipeline.rescan.cron`.
See [Schedules and their packages](../contribution-guide/backend/tool-build-pipeline.md#schedules-and-their-packages)
for configuration and a local schedule example.
