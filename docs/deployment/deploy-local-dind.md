---
id: deploy-local-dind
title: Local Clinic Deployment (Docker-in-Docker)
sidebar_position: 4
---

This page explains how to deploy a **%%DEPLOYED_PRODUCT_NAME%% Client** locally using Docker-in-Docker (DinD). This approach packages the entire clinic stack — all services, configuration, and pre-pulled Docker images — into a **single self-contained Docker container**. It is designed for clinic environments where:

- A simple, portable deployment is required (one container, one command).
- FL-Net first needs to be tested in an isolated environment before a production deployment.

---

## How DinD Works

The clinic stack runs inside a Docker container that itself runs a Docker daemon (Docker-in-Docker). The inner daemon starts a `docker compose` stack with all the clinic services. This means:

- All clinic service images are **bundled into the DinD image** at build time — no internet needed at runtime.
- The inner compose stack creates its own isolated Docker network inside the DinD container.
- Only port `80` is exposed from the DinD container to the host.

```
Host machine
└── DinD container (clinic-dind)
    ├── dockerd (inner Docker daemon)
    └── docker compose stack (inner)
        ├── local-learning-api
        ├── local-learning-api-db  (PostgreSQL)
        ├── orch-api
        ├── controller  ──────────────────────────▶ Global Relay Server (TCP 9150)
        ├── instance-manager-frontend
        ├── keycloak
        ├── keycloak-postgres
        └── reverse-proxy (Nginx :80)  ◀──── Host port
```

---

## Services at a Glance

| Service | Image | Purpose |
|---|---|---|
| `local-learning-api` | `local-learning-api` | REST API for the clinic node — manages local data, connects to global server |
| `local-learning-api-db` | `postgres:17.5` | PostgreSQL database for the local learning API |
| `orch-api` | `orch-api` | Orchestration API — spawns federated learning tool containers |
| `controller` | `controller` | FLNet controller — connects to the global relay server and manages federated runs |
| `instance-manager-frontend` | `local-fl-net` | Web frontend for the clinic node |
| `keycloak` | `quay.io/keycloak/keycloak:26.5` | Identity provider (authentication) |
| `keycloak-postgres` | `postgres:17.5` | PostgreSQL database for Keycloak |
| `reverse-proxy-unencrypted` | `nginx` | Nginx reverse proxy, binds on `:80` |

---

## Prerequisites

On the **build machine** (internet access required):

- Docker installed and running
- Access to the GitLab container registry (`gitlab.cosy.bio:5050`) — you need valid credentials
- The `clinic-dind/` directory from the deployment repository

On the **clinic machine** (target deployment):

- Docker installed
- No internet access required at runtime
- Port `80` (or a custom port) available for the clinic frontend

---

## Step 1: Build the DinD Image

The build process pulls all required images, saves them into a `.tar` archive, and bundles everything into a single Docker image.

From the `clinic-dind/` directory, run:

```bash
./build-local-dind.sh
```

This script does the following:
1. Reads all `image:` entries from `docker-compose.yml`
2. Pulls each image (`docker pull`)
3. Saves them all into `images.tar` (`docker save`)
4. Builds the DinD Docker image tagged `feddb-dind`
5. Removes the temporary `images.tar`

The resulting image `feddb-dind` contains everything needed to run the clinic stack offline.

> **Tip:** If `images.tar` already exists, the pull and save steps are skipped. Delete it to force a fresh image pull.

To only prepare the image archive (without building the DinD image):

```bash
./prepare-local-dind.sh
```

---

## Step 2: Prepare Clinic Data Files

The clinic node requires two data files that are mounted into the DinD container at runtime:

| File | Purpose |
|---|---|
| `clinic.csv` | The clinic's patient/measurement dataset in the expected CSV format |
| `us-130-clinics.json` | Connector configuration describing how the ETL process should read the CSV |

These are mounted read-only into `/connectors/` inside the DinD container. The inner `local-learning-api` service reads them from there.

---

## Step 3: Run the DinD Container

Use the provided run script:

```bash
./run-local-dind.sh
```

By default this exposes the clinic frontend on **port `4601`** of the host.

### Configurable environment variables

You can override any of these before running:

```bash
HOST_PORT=4601 \
DEPLOYED_ON_ADDRESS=http://localhost:4601 \
COMPOSE_PROJECT_NAME=fl-net-clinic1 \
CLINIC_DATASET_PATH=/path/to/your/clinic.csv \
CLINIC_CONNECTOR_PATH=/path/to/us-130-clinics.json \
./run-local-dind.sh
```

| Variable | Default | Description |
|---|---|---|
| `HOST_PORT` | `4601` | The port on the host machine that maps to the clinic frontend (`:80` inside DinD). |
| `DEPLOYED_ON_ADDRESS` | `http://localhost:{HOST_PORT}` | The full URL the clinic frontend is reachable at. Used by Keycloak for redirect URLs. |
| `COMPOSE_PROJECT_NAME` | `fl-net-clinic1` | Docker Compose project name for the inner stack. Change this when running multiple clinics on the same host. |
| `CLINIC_DATASET_PATH` | `{repo}/deployment/example-data/us-130/clinics/clinic_001.csv` | Absolute path to the clinic CSV dataset on the host. |
| `CLINIC_CONNECTOR_PATH` | `{script_dir}/us-130-clinics.json` | Absolute path to the connector config JSON on the host. |

### What the run script does

The `run-local-dind.sh` script runs the `feddb-dind` image with:

- `--privileged` — required for the inner Docker daemon
- `--cgroupns host` — required for cgroup management inside DinD
- `-v /sys/fs/cgroup:/sys/fs/cgroup:rw` — cgroup access for the inner daemon
- `-v clinic-dind-docker:/var/lib/docker` — persistent Docker layer cache for the inner daemon (so images survive restarts)
- `-v $CLINIC_DATASET_PATH:/connectors/clinic.csv:ro` — mounts clinic data read-only
- `-v $CLINIC_CONNECTOR_PATH:/connectors/us-130-clinics:ro` — mounts connector config read-only
- `-p $HOST_PORT:80` — exposes the Nginx reverse proxy

The inner Docker daemon, clinic stack, and all networking happen entirely inside this one container.

---

## Step 4: What Happens at Startup

When the DinD container starts, `entrypoint.sh` runs automatically:

1. **Starts the inner Docker daemon** (`dockerd-entrypoint.sh`)
2. **Waits** up to 60 seconds for the daemon to be ready
3. **Loads pre-saved images** from `/compose/images.tar` into the inner Docker daemon (`docker load`)
4. **Logs into the registry** using the `CI_REGISTRY_USER` and `CI_REGISTRY_PASSWORD` environment variables — required so `orch-api` can later pull federated learning tool images on demand
5. **Resolves `host.docker.internal`** — auto-detects the host IP so the inner compose services can reach the host machine if needed
6. **Writes a runtime `.env`** — merges the baked-in `.env` with any environment variables passed to the DinD container
7. **Runs `docker compose up`** with the inner compose file, attaching logs from `controller`, `orch-api`, and `local-learning-api`

---

## Step 5: Configure Global Server Connection

The inner `controller` service connects to the global relay server. These URLs are injected at runtime via environment variables:

| Variable | Description |
|---|---|
| `GLOBAL_LEARNING_API_URL` | HTTP URL of the global learning API (e.g. `https://dev.federated-learning.net/api`) |
| `GLOBAL_LEARNING_API_WEBSOCKET_URL` | WebSocket URL of the global learning API (e.g. `wss://dev.federated-learning.net/api`) |
| `GLOBAL_SCHEMA_API_URL` | URL of the data modeler API on the global server |
| `GLOBAL_RELAY_HTTP_URL` | HTTP URL of the relay server on the global server |
| `GLOBAL_RELAY_TCP_ADDRESS` | TCP address of the relay server (e.g. `dev.federated-learning.net:9150`) |

These are pre-set in `.env` to point at the staging global server. Pass them as environment variables to `docker run` to override:

```bash
docker run -it \
  --name clinic-dind \
  --privileged \
  --cgroupns host \
  --rm \
  -e COMPOSE_PROJECT_NAME=fl-net-clinic1 \
  -e DEPLOYED_ON_ADDRESS=http://localhost:4601 \
  -e GLOBAL_LEARNING_API_URL=https://your-global-server.com/api \
  -e GLOBAL_LEARNING_API_WEBSOCKET_URL=wss://your-global-server.com/api \
  -e GLOBAL_SCHEMA_API_URL=https://your-global-server.com/data-modeler \
  -e GLOBAL_RELAY_HTTP_URL=https://your-global-server.com/relay \
  -e GLOBAL_RELAY_TCP_ADDRESS=your-global-server.com:9150 \
  -e CI_REGISTRY_USER=your-gitlab-username \
  -e CI_REGISTRY_PASSWORD=your-gitlab-pat \
  -v clinic-dind-docker:/var/lib/docker \
  -v /sys/fs/cgroup:/sys/fs/cgroup:rw \
  -v /path/to/clinic.csv:/connectors/clinic.csv:ro \
  -v /path/to/us-130-clinics.json:/connectors/us-130-clinics:ro \
  -p 4601:80 \
  feddb-dind
```

---

## Step 6: Nginx Routing (Clinic Node)

The inner Nginx reverse proxy routes all traffic inside the DinD container:

| Path prefix | Upstream service | Notes |
|---|---|---|
| `/local-learning-api/` | `local-learning-api:8080` | Local learning REST API |
| `/auth/` | `keycloak:8080` | Keycloak authentication |
| `/` | `instance-manager-frontend:80` | Clinic web frontend (catch-all) |

---

## Step 7: Initial Setup

Once the stack is running, access the clinic node at `http://localhost:4601` (or your configured host port).

### First login (Keycloak admin)

1. Navigate to `http://localhost:4601/auth/`
2. Log in with:
   - Username: `admin` (or the value of `KC_BOOTSTRAP_ADMIN_USERNAME` in `env/keycloak-secrets.env`)
   - Password: `password` (or the value of `KC_BOOTSTRAP_ADMIN_PASSWORD`)
3. **Change the admin password immediately.**

### Create clinic users

1. In Keycloak, switch to the **FLNet-Client** realm (left sidebar → Manage Realms).
2. Go to **Users** → **Add User**.
3. Make sure to tick **Email verified** (or configure SMTP, or disable email verification requirement).
4. Assign the user to a group:

| Group | Access level |
|---|---|
| **Admin** | Full access — see and edit everything |
| **Data-Access-Manager** | Read all patient data, control query and federated learning access, view all logs |
| **Data-Admin** | Read, edit, and add patient data; view data-related logs |

---

## Running Multiple Clinics on the Same Host

To simulate multiple clinic nodes on a single host, run the DinD container multiple times with different project names and ports:

```bash
HOST_PORT=4601 COMPOSE_PROJECT_NAME=fl-net-clinic1 ./run-local-dind.sh

# In a second terminal:
HOST_PORT=4602 COMPOSE_PROJECT_NAME=fl-net-clinic2 \
  CLINIC_DATASET_PATH=/path/to/clinic2.csv \
  ./run-local-dind.sh
```

Each DinD container runs a completely isolated inner Docker stack. The `COMPOSE_PROJECT_NAME` ensures Docker volume names do not collide between instances.

---

## Persisting the Inner Docker Layer Cache

The run script mounts a named volume `clinic-dind-docker` at `/var/lib/docker` inside the DinD container:

```bash
-v clinic-dind-docker:/var/lib/docker
```

This volume stores the inner daemon's image and container layers. On subsequent starts, images do not need to be re-loaded from the `.tar` file, making restarts significantly faster.

To start fresh (e.g. after a DinD image update):

```bash
docker volume rm clinic-dind-docker
```

---

## Secrets Reference

The secrets files inside the DinD image contain default development passwords. **For production deployments, rebuild the DinD image with updated secret files** before distributing it.

| File | Key variables |
|---|---|
| `env/keycloak-secrets.env` | `POSTGRES_PASSWORD`, `KC_DB_PASSWORD`, `KC_BOOTSTRAP_ADMIN_PASSWORD`, `LOCAL_LEARNING_SECRET`, `DATA_IMPORTER_SECRET` |
| `env/local-learning-secrets.env` | `POSTGRES_PASSWORD`, `QUARKUS_DATASOURCE_PASSWORD`, `QUARKUS_OIDC_CREDENTIALS_SECRET` |
| `env/orch-secrets.env` | `POSTGRES_PASSWORD`, `QUARKUS_DATASOURCE_PASSWORD`, `ORCH_DOCKER__GITLAB__REGISTRY_PASSWORD`, `PIPELINE_DOCKER_PASSWORD`, `PIPELINE_REPO_TOKEN` |

---

## Troubleshooting

**DinD container starts but frontend is not reachable**

Check that the host port is not already in use and that the inner Nginx started successfully:
```bash
docker exec clinic-dind docker compose logs reverse-proxy-unencrypted
```

**Inner Docker daemon fails to start**

The host kernel must support the cgroup configuration needed by DinD:
- Make sure you pass `--cgroupns host` and `-v /sys/fs/cgroup:/sys/fs/cgroup:rw`
- Make sure `/lib/modules` is readable (`-v /lib/modules:/lib/modules:ro`)

**Clinic does not appear in the global server**

Check that the `controller` service inside DinD can reach the global relay TCP address:
```bash
docker exec clinic-dind docker compose logs controller
```

Verify the `GLOBAL_RELAY_TCP_ADDRESS` is set correctly and that the relay TCP port is reachable from the clinic host.

**Registry login fails / tool images can't be pulled**

The `CI_REGISTRY_USER` and `CI_REGISTRY_PASSWORD` environment variables must be passed to the DinD container. These are used at startup to authenticate the inner Docker daemon with the GitLab registry (so `orch-api` can later pull federated learning tool images).

**Multiple clinics: port or volume conflicts**

Ensure each clinic run uses a unique `HOST_PORT` and `COMPOSE_PROJECT_NAME`. The `COMPOSE_PROJECT_NAME` prefixes all volume names inside Docker to avoid collisions.
