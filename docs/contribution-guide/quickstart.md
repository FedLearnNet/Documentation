---
title: Quickstart
sidebar_position: 2
---

# Quickstart
This page walks you through a contribution from start to finish: from the issue to the pull request. It describes the overall workflow only. How to set up, run, and test a specific repository is described in the documentation of that repository, which this page links to.

## 1. Find or create an issue
Every change starts with an issue.

- **Find an existing issue:** search the issues of the repository you think is affected, for example in [Frontends](https://github.com/FedLearnNet/Frontends/issues).
- **Create a new issue** if none exists, using the *Bug report* or *Feature request* template. An issue that affects several repositories belongs in [FedLearnNet/.github](https://github.com/FedLearnNet/.github).

Security vulnerabilities must not be reported as public issues. See [Development workflow](development-workflow.md#issues) for how to report them privately.

## 2. Identify which repository needs to be changed
FL-Net is split over several repositories, and an issue is usually solved in one of them. To find the responsible repository, simply check the **Fast path** list of the [Repository map](repository-map.md#fast-path-where-should-i-change-what) for guidance on which repository to change.

## 3. Go to the documentation of that repository
Each repository has its own README, and the larger components have a section in this guide. Together they describe the prerequisites, the development setup, how to start the service, and how to test it:

| Repository | Guide in this documentation | README |
|---|---|---|
| `Frontends` | [Frontend](frontend/overview.md) | [README](https://github.com/FedLearnNet/Frontends#readme) |
| `Learning-APIs`, `Orchestration-API` | [Backend](backend/overview.md) | [Learning-APIs](https://github.com/FedLearnNet/Learning-APIs#readme), [Orchestration-API](https://github.com/FedLearnNet/Orchestration-API#readme) |
| `Federated-Learning-Communication-API` | [Federated communication layer](federated-communication/overview.md) | [README](https://github.com/FedLearnNet/Federated-Learning-Communication-API#readme) |
| `Python-Tool-API`, `Tool-Build-Pipeline` | – (how Tools use them: [Tool development](../tool-dev/create-tool.md)) | [Python-Tool-API](https://github.com/FedLearnNet/Python-Tool-API#readme), [Tool-Build-Pipeline](https://github.com/FedLearnNet/Tool-Build-Pipeline#readme) |
| `FL-Net-CLI` | – (how to use the CLI: [Deployment](../deployment/overview.md)) | [README](https://github.com/FedLearnNet/FL-Net-CLI#readme) |
| `Documentation` | [Documentation workflow](documentation-workflow.md) | [README](https://github.com/FedLearnNet/Documentation#readme) |

Set up and start the repository as described there before you change anything, so you know it works on your machine.

## 4. Create your branch from `develop`
All repositories use `develop` as the integration branch. Always start your work from the latest `develop`, never from `main`:

```bash
git checkout develop
git pull                                  # get the latest develop
git checkout -b 5-fix-date-to-iso8601     # create your own branch from it
```

Name the branch after the issue: its number followed by a short description, as in the example above. Make all your changes on this branch.

## 5. Make and check your change
1. Make the smallest change that solves the issue.
2. Run the checks of the repository before you push. They are described in its documentation (step 3), and the checks run by CI are defined in `.github/workflows/ci.yml` of each repository.

**IMPORTANT:** update the documentation together with your change if it affects user-facing behavior or anything that is already documented. See [When do I have to change the documentation?](documentation-workflow.md#when-do-i-have-to-change-the-documentation) for details. This helps keep the system usable over time!

## 6. Open a pull request
Push your branch and open a pull request against `develop`, referencing the issue it solves (e.g. `Fixes #5`). The [Development workflow](development-workflow.md#pull-requests) describes the pull request rules and the CI checks.

## Where to go next
Continue with the [Development workflow](development-workflow.md), or go back to the [Welcome page](welcome.md) for the recommended reading order.
