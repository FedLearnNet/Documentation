---
id: us-130-hackathon-a
title: "Hackathon A: Global platform setup"
sidebar_position: 3
---

# Phase A — Start the Environment

In this phase, you start the infrastructure that is required before any federated learning app can run.

The goal is not yet to train a model. The goal is to get three things working:

1. a **global server** that coordinates the hackathon,
2. at least one **local clinic node** that represents a participating institution,
3. a **user account** that can access the local clinic frontend.

For a meaningful federated learning run, you need at least two local clinic nodes. With only one clinic, the setup is still
useful for testing, but the learning process is effectively local rather than federated.

:::tip
Phase A prepares the playground. The global server coordinates; each local clinic node owns its local data and execution
environment.
:::

---

## A0. Short Deep Dive: Docker and Docker Compose

The hackathon environment is based on Docker. This allows every team to run the same platform components without manually
installing each service, database, backend, frontend, and runtime dependency on the host machine.

### What is Docker?

Docker is a platform for building, shipping, and running applications in **containers**. A container packages an
application together with the libraries, runtime dependencies, and operating-system-level environment it needs. The result
is more reproducible than “it works on my machine” development.

A useful mental model:

| Concept | Meaning in this hackathon |
|---|---|
| **Image** | A packaged blueprint, for example a backend image or local clinic image. |
| **Container** | A running instance of an image. |
| **Volume** | Persistent storage that survives container restarts. |
| **Network** | A Docker-internal communication layer between containers. |
| **Port mapping** | Makes a service inside a container reachable from your browser or host machine. |

Official Docker references:

- [Docker overview](https://docs.docker.com/get-started/docker-overview/)
- [Docker documentation](https://docs.docker.com/)
- [Get started with Docker](https://docs.docker.com/get-started/)

### What is Docker Compose?

Docker Compose is used when an application consists of multiple containers. Instead of starting every container manually,
a `docker-compose.yml` file defines services, networks, volumes, ports, and environment variables in one
place. Then one command can start the full application stack.

In this project, Compose is useful because the platform is not one process. It contains multiple cooperating services such
as APIs, databases, authentication, frontend services, relay components, and orchestration-related containers.

Common commands:

```bash
# Start all services defined in the compose file
docker compose up -d

# Show running containers
docker compose ps

# Follow logs of all services
docker compose logs -f

# Follow logs of one service, for example keycloak
docker compose logs -f keycloak

# Stop the stack but keep volumes
docker compose down

# Stop the stack and remove volumes as well
# Be careful: this can delete local databases and generated state.
docker compose down -v
```

Official Docker Compose references:

- [Docker Compose overview](https://docs.docker.com/compose/)
- [How Compose works](https://docs.docker.com/compose/intro/compose-application-model/)
- [Compose file reference](https://docs.docker.com/reference/compose-file/)
- [Docker Compose quickstart](https://docs.docker.com/compose/gettingstarted/)

:::tip
Docker runs the individual containers. Docker Compose describes and starts a multi-container application as one stack.
:::

---

## A1. Check the Prerequisites

Before starting the global server or local clinic node, check that your machine can run the required containers.

You should have:

- Docker installed and running.
- Docker Compose available through the `docker compose` command.
- Enough free disk space for images, volumes, and local datasets.
- A stable network connection to the shared global server if you are not running the global server locally.
- Access to the required project repository and environment files.

Run:

```bash
docker --version
docker compose version
```

If both commands return a version, Docker and Docker Compose are available.

:::info
The hackathon material has been tested with a recent Docker Desktop / Docker Engine setup. If Docker commands fail, check
that Docker is running before debugging the platform itself.
:::

:::tip
Most setup problems are easier to solve before the platform starts. First verify Docker, Compose, ports, and environment
files.
:::

---

## A2. Start the Global Server

The global server is the central coordination layer. It hosts the frontend, the global learning API, and the global relay
server that local controllers use for federated app communication.

→ Follow the [Global Server Deployment guide](../../deployment/deploy-global.md).


:::info
A shared global server is also running, in case your local deployment fails. Ask your instructor for the URL.
:::

:::warning
Confirm which exact global URLs should be distributed to participants: frontend URL, API URL, WebSocket URL, relay host,
relay port, and whether these are already preconfigured in the provided `.env` files.
If you run the global server locally for the first time, wait until all services are healthy before starting clinic nodes.
:::

## A3. Start Your Local Clinic Node

Each team gets one or more clinic nodes. A clinic node represents a local institution. It contains the local platform
services and local patient data. It connects to the global server but keeps data access under local control.

→ Follow the [Local Clinic Deployment (DinD) guide](../../deployment/deploy-local-dind.md).

Quick start, assuming the `feddb-dind` image is already built:

```bash
cd local_deployment/clinic-dind

HOST_PORT=4601 \
CLINIC_DATASET_PATH=/path/to/clinic_001.csv \
./run-local-dind.sh
```

Your clinic frontend will be available at:

```text
http://localhost:4601
```

The clinic connects to the global services specified in the `GLOBAL_*` environment variables. In the prepared
`run-local-dind.sh` script, the relevant variables are:

| Variable | Purpose |
|---|---|
| `GLOBAL_LEARNING_API_URL` | HTTP endpoint of the global learning API. |
| `GLOBAL_LEARNING_API_WEBSOCKET_URL` | WebSocket endpoint of the global learning API. |
| `GLOBAL_SCHEMA_API_URL` | Data modeler / schema API endpoint. |
| `GLOBAL_RELAY_HTTP_URL` | HTTP endpoint of the relay service. |
| `GLOBAL_RELAY_TCP_ADDRESS` | TCP address used by local controllers for federated communication. |

:::tip
Ask the instructor which global server is used during the hackathon. If you run the global server locally, the learning
API and WebSocket URLs usually point to `host.docker.internal`; if you use a shared server, these values must point to the
shared deployment.
:::

### What happens when the local node starts?

At a high level, the local clinic node starts the services needed for local participation:

1. the local frontend,
2. the local learning API,
3. the local orchestration API,
4. the local authentication setup,
5. the local controller when a federated app run requires it,
6. local app containers when a run is started,
7. local data export before training or query execution.

The app container does **not** directly connect to the local database. Before training starts, the Local Learning API
exports the selected run data. The app then receives this prepared input data.

:::tip
The local clinic node is the owner of local execution. It exports the selected run data for the app, but the app itself
should not access the local database directly.
:::

### Running multiple clinics on one machine

For a real federated learning exercise, start at least two clinic nodes. Each clinic needs a different host port, Compose
project name, Docker container name, Docker volume, and clinic CSV.

The one-clinic `run-local-dind.sh` script is useful for participant setup, but it uses a fixed outer container name
(`clinic-dind`). Do not start it twice unchanged in two terminals. For multi-clinic simulation, use a helper script that
assigns unique container names, or adapt the `docker run` command accordingly.

At minimum, the per-clinic settings should differ like this:

```bash
HOST_PORT=4601 \
COMPOSE_PROJECT_NAME=clinic-001 \
CLINIC_DATASET_PATH=/path/to/clinic_001.csv \
./run-local-dind.sh

HOST_PORT=4602 \
COMPOSE_PROJECT_NAME=clinic-002 \
CLINIC_DATASET_PATH=/path/to/clinic_002.csv \
./run-local-dind.sh
```

If your script still contains `--name clinic-dind`, add a clinic-specific container name before using this pattern for
parallel clinics.

The two local frontends would then be available at:

```text
http://localhost:4601
http://localhost:4602
```

:::warning
The clinic CSV path must point to an existing file. If you use `data.zip`, run `python download_and_split.py` first and
then use a file such as `data/clinics/clinic_001.csv` from the generated output.
:::

---

## A4. Check That the Local Clinic Node Is Running

After starting the local clinic node, open:

```text
http://localhost:4601
```

You should see the clinic frontend. If the page does not load, check the container status and logs.

Useful commands:

```bash
# Show running containers on the host
docker ps

# Show recent logs for the local DinD container
# Replace the container name with the actual name shown by docker ps.
docker logs -f <local-dind-container-name>
```
---

## A5. Create Your User Account

Open your clinic frontend:

```text
http://localhost:4601
```

Then navigate to Keycloak:

```text
http://localhost:4601/auth/
```

Create a local user:

1. Log in with the admin credentials from `env/keycloak-secrets.env`:
   - `KC_BOOTSTRAP_ADMIN_USERNAME`
   - `KC_BOOTSTRAP_ADMIN_PASSWORD`
2. Switch to the **FLNet-Client** realm.
3. Go to **Users** → **Add User**.
4. Fill in username and email.
5. Enable **Email verified**.
6. Save the user.
7. Open **Credentials** and set a password.
8. Open **Groups** and assign the user to **Admin**.
9. Log out.
10. Log back in with the new user.

For hackathon/testing setups, a default user may already exist:

```text
username: test
password: test
```

You should now see the clinic dashboard at:

```text
http://localhost:4601
```

:::tip
A user without the correct group membership may authenticate successfully but still see no useful clinic functionality.
For the hackathon, the **Admin** group gives full local access.
:::

---

## A6. Final Checklist

Before continuing to the next phase, verify:

- The global server URL is known and reachable.
- The local clinic frontend opens in the browser.
- You can log in to the local clinic frontend.
- Your user is assigned to the **Admin** group.
- The local clinic is configured to connect to the correct global server.
- At least two clinic nodes are running if you want to perform a real federated run.
- Each clinic uses a different `HOST_PORT`.
- Each clinic uses the intended local dataset path.

:::tip
When Phase A is complete, the platform is ready for data setup, project creation, and federated app execution.
:::
