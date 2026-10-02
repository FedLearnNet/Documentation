---
title: Development Workflow
sidebar_position: 4
---

# Development workflow
This page describes how a change travels from an issue to a published Docker image. It reflects the configuration currently present in the FedLearnNet repositories. Individual repositories may differ, so check the `.github/` folder of the repository you are working on.

## Issues
Every repository with code (`Documentation`, `Frontends`, `Learning-APIs`, `Orchestration-API`, `Federated-Learning-Communication-API`, `Tool-Build-Pipeline`, `Python-Tool-API`) provides two issue templates:
- **Bug report**: something does not work as expected
- **Feature request**: an idea or improvement

**Security vulnerabilities must not be reported as public issues.** Use the private *Report a security vulnerability* link offered when creating an issue, which opens a GitHub security advisory.

## Branches
Most repositories use two long-lived branches:

| Branch | Purpose | Published Docker image tag |
|---|---|---|
| `main` | Production state | `latest` |
| `develop` | Integration and staging state | `staging` |

Exceptions: `Tool-Build-Pipeline` publishes images from `main` only, and the default branch of `Frontends` is `develop`.

Work happens on short-lived branches created from the relevant branch. Existing branches are usually named after the issue they solve, for example `137-global-frontend-show-unknown-vulnerabilities-pr`.

## Pull requests
1. Push your branch and open a pull request against the target branch.
2. Reference the issue it solves.
3. Make sure the CI checks pass (see below).
4. Keep the pull request focused on one issue. Unrelated refactorings make review harder.
5. If your change affects behavior that is documented here, update the [documentation](documentation-workflow.md) as well.

For frontend changes, the [Testing and review](frontend/testing-and-review.md) page contains a review checklist.

## Continuous integration
Repositories with code share the same set of GitHub Actions workflows in `.github/workflows/`:

| Workflow | What it does |
|---|---|
| `ci.yml` | Builds, lints, and tests the code on pushes to `main`/`develop` and on pull requests. The exact commands per repository are listed in the [Quickstart](quickstart.md#5-testing-and-building). |
| `codeql.yml` | Runs CodeQL security analysis |
| `docker.yml` | Builds and publishes the Docker images to the GitHub Container Registry (`ghcr.io/fedlearnnet/...`) |
| `scan.yml` | Scans the published images for vulnerabilities |

Dependabot (`.github/dependabot.yml`) opens pull requests for dependency updates.

`FL-Net-CLI` uses its own workflows (`e2e.yml`, `release.yml`), and `Python-Tool-API` additionally publishes the Python package (`publish.yml`).

## Where to go next
Go back to the [Welcome page](welcome.md) for the recommended reading order, or continue with the detailed section for your change.
