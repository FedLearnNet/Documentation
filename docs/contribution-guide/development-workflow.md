---
title: Development Workflow
sidebar_position: 4
---

# Development workflow
This page describes how a change travels from an issue to a published FL-Net version.

## Issues
Every repository with code provides two issue templates:
- **Bug report**: something does not work as expected
- **Feature request**: an idea or improvement

**Security vulnerabilities must not be reported as public issues.** Use the private *Report a security vulnerability* link offered when creating an issue, which opens a GitHub security advisory.

For any issue over multiple repositories you can use the meta repository [FedLearnNet/.github](https://github.com/FedLearnNet/.github).

## Branches
All repositories use two long-lived branches:

| Branch | Purpose | Published Docker image tag |
|---|---|---|
| `main` | Production state | `latest` |
| `develop` | Integration and staging state | `staging` |

Work happens on short-lived branches created from the **develop** branch. 
Existing branches are usually named after the issue they solve, 
for example `137-global-frontend-show-unknown-vulnerabilities-pr`.

**Never merge to `main` or `develop` directly.** 
Always open a pull request and let the CI checks run.

## Pull requests
1. Merge the current `develop` state into your branch and solve any conflicts.
2. Push your branch and open a pull request against the **develop** branch.
3. Reference the issue(s) it solves in the pull request description, e.g. `Fixes #137`.
4. Make sure the CI checks pass (see below).
5. Keep the pull request focused on one issue. Unrelated refactorings make review harder.
6. If your change affects user facing behavior or anything that is documented here, update the [documentation](documentation-workflow.md) as well. You do the same steps of creating a pull request as described here for the documentation repository, and you can link the two pull requests as a comment in the ticket.

For frontend changes, the [Testing and review](frontend/testing-and-review.md) page contains a review checklist.

## Continuous integration
Repositories with code use GitHub Actions workflows found in `.github/workflows/` of each repository. 
These generally focus on 
- unit tests and linting
- static security analysis of the code
- building docker images
- scanning the built images for vulnerabilities
- publishing the images to the GitHub Container Registry (if the previous steps pass)

Dependabot (`.github/dependabot.yml`) opens pull requests for dependency updates.

`Python-Tool-API` additionally publishes the Python package (`publish.yml`) in PyPI.

## Where to go next
Go back to the [Welcome page](welcome.md) for the recommended reading order, or continue with the detailed section for your change.
