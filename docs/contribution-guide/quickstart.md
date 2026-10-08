---
title: Quickstart
sidebar_position: 2
---

# Quickstart
This page gets you from zero to a locally running, tested change. The commands below are taken from the README of each repository; if they disagree, the README of the repository is the source of truth.

If you do not know yet which repository you need, read the [Repository map](repository-map.md) first.

## 1. Prerequisites
You only need the tools for the repositories you work on:

| Repository | Requirements |
|---|---|
| `Frontends` | Node.js 22 LTS (or another version supported by the Angular version used) and npm |
| `Learning-APIs` | Java 25 and Docker (Quarkus Dev Services start the databases and the Orchestration API). The Maven wrapper is included |
| `Orchestration-API` | Java 25 and a running Docker daemon |
| `Federated-Learning-Communication-API` | Go (version in `go.mod`), Docker for the images, Python 3 for the end-to-end tests |
| `Tool-Build-Pipeline` | Docker (the container needs access to the Docker socket), Python for the tests |
| `Python-Tool-API` | Python |
| `Documentation` | Node.js LTS and [Git LFS](https://git-lfs.com/) |

## 2. Getting the repositories
All repositories are in the [FedLearnNet GitHub organization](https://github.com/FedLearnNet). Clone the ones you need, for example:

```bash
git clone https://github.com/FedLearnNet/Learning-APIs.git
git clone https://github.com/FedLearnNet/Frontends.git
```

## 3. Setting up the development environment

### Frontends
```bash
npm install
npm run start-local-fl-net     # local (Client) frontend on http://localhost:4200
npm run start-global-fl-net    # global (Platform) frontend on http://localhost:4201
```
See [Frontend local setup](frontend/local-setup.md) for brands, environment files, and required backend services.

### Learning-APIs
```bash
./mvnw clean install                # build all modules and run the tests

cd local-learning-api
cp .env.example .env                # fill in the secrets
cp orch_secrets.env.example orch_secrets.env
./mvnw compile quarkus:dev          # live reload, Dev UI at /q/dev/
```
The same applies to `global-learning-api`. Development ports: `global-learning-api` 8080, `local-learning-api` 8081, `datamodeler-api` 8086. The secrets are described in [Environment secrets](backend/env-secrets.md).

### Orchestration-API
```bash
cp .env.example .env          # fill in the secrets
./mvnw compile quarkus:dev    # http://localhost:8082 · Dev UI /q/dev/ · Swagger UI /q/swagger-ui
```
Alternatively, `docker compose up --build` runs the API together with PostgreSQL (API on port 8093).

### Federated-Learning-Communication-API
```bash
go build -o relay ./cmd/relay
go build -o controller ./cmd/controller

./relay --mode dev --tls-mode self-signed --domain localhost
./controller --address-tcp localhost:9141 --mode dev --tls-mode self-signed
```
Alternatively, `docker compose up` starts a relay and a controller from the published staging images.

### Tool-Build-Pipeline
```bash
cp .env.example .env          # fill in the values
docker compose up --build
```

### Documentation
See [Documentation workflow](documentation-workflow.md).

## 4. Making a change
1. Find or open an issue in the repository you are changing.
2. Create a branch from the develop branch of that repository. If the develop branch does not exist, create a branch from main. Use a descriptive name for the branch, if you work based on an image you can get the branch name from the issue, e.g. `5-fix-date-to-iso8601`.
3. Make the smallest change that solves the issue. The documentation of each repository has further information on this.
4. Run the checks below, then open a pull request.

The full process is described in [Development workflow](development-workflow.md).

**IMPORTANT**

If you contribute also update the documentation if your change affects:
- user-facing behavior, e.g. a new feature, a changed UI flow, or a changed API changing how the frontend behaves
- If your change is internal please check the documentation of the service you changed. If your changes affect whats documented there, update the documentation accordingly. For example, if you change the learning flow in the `local-learning-api`, update the [federated learning flow](backend/federated-learning-flow.md) page.

This helps keep the system usable over time!

## 5. Testing and building
Run at least the checks that the CI of the repository runs:

| Repository | Commands | Run by CI |
|---|---|---|
| `Frontends` | `npm run lint`, `npm test`, `npm run cy:local` / `npm run cy:global` | `npm run lint` |
| `Learning-APIs` | `./mvnw verify` (or `mvn test` inside one module) | `mvnw verify` including Checkstyle and SpotBugs |
| `Orchestration-API` | `./mvnw verify` | `mvnw verify` |
| `Federated-Learning-Communication-API` | `gofmt -l .` (must print nothing), `go test ./...`, `bash e2etests/e2e_test.sh` after `pip install -r e2etests/requirements.txt` | formatting, unit tests, end-to-end tests, golangci-lint, govulncheck |
| `Tool-Build-Pipeline` | `pip install -r requirements.test.txt`, then `pytest -q` | `pytest` |
| `Python-Tool-API` | `pip install -r requirements.txt pytest`, then `pytest tests/` | `pytest`, package build |
| `Documentation` | `npm run typecheck`, `npm run build` | typecheck and build |

For frontend-specific guidance on which checks to run, see [Testing and review](frontend/testing-and-review.md).

## Where to go next
Continue with the [Development workflow](development-workflow.md), or go back to the [Welcome page](welcome.md) for the recommended reading order.
