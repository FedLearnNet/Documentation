---
id: deploy-global
title: Global Server Deployment
sidebar_position: 3
---

This page covers how to deploy the %%DEPLOYED_PRODUCT_NAME%% network **Platform** — the central instance that all clinic clients connect to. It hosts the global learning APIs, the data modeler, the federated controller, the relay server, the frontend, and authentication.

---

## Architecture Overview

The global server is a Docker Compose stack. All services share an internal Docker network (`global-learning-network`) and are exposed to the outside world through a single **Nginx reverse proxy**.

```
Internet
   │
   ▼
Nginx (port 443 or 80)
   ├── /                  → Frontend
   ├── /api/              → Global Learning API
   ├── /data-modeler/     → Data Modeler API
   ├── /auth/             → Keycloak (Identity & Access Management)
   ├── /relay/            → Relay Server (HTTP gateway for clients)
   └── /documentation/    → User Documentation
                                         │
                  ┌──────────────────────┼────────────────────────┐
                  ▼                      ▼                         ▼
         Global Learning API       Datamodeler API            Orch API
                  │                      │                         │
          PostgreSQL DB             Neo4j DB                 PostgreSQL DB
```

**Relay Server** also exposes a **TCP port** (default `9150`) directly for clinic controller connections — this is outside of Nginx.

### Services at a glance

| Service | Image                       | Purpose |
|---|-----------------------------|---|
| `global-learning-api` | `global-learning-api`       | Core REST + WebSocket API for federated learning management |
| `global-learning-db` | `pgvector/pgvector:pg18`    | PostgreSQL database for the global learning API |
| `datamodeler-api` | `datamodeler-api`           | API for the data model graph (schema browsing, UMLS, SapBERT) |
| `datamodeler-db` | `neo4j:5.18.1-enterprise`   | Neo4j graph database for the data modeler |
| `orch-api` | `orch-api`                  | Orchestration API — spawns and manages tool containers |
| `orch-db` | `pgvector/pgvector:pg18`    | PostgreSQL database for the orchestration API |
| `controller` | `controller`                | FLNet federated learning controller |
| `relay-server` | `controller-relay`          | Relay server — bridges clinic controllers to the global controller |
| `frontend` | `global-frontent`           | Web frontend |
| `keycloak` | `quay.io/keycloak/keycloak` | Identity provider (authentication & authorization) |
| `keycloak-postgres` | `postgres`                  | PostgreSQL database for Keycloak |
| `documentation` | `user-doc`                  | This documentation, served under `/documentation/` |
| `reverse-proxy-*` | `nginx`                     | Nginx reverse proxy (HTTP or HTTPS profile) |

---

## Prerequisites

- A Linux server with:
  - **Docker** and **Docker Compose** installed
  - Port **80** or **443** reachable from the internet (for clinic clients)
  - Port **9150** (or your chosen relay TCP port) open for FLNet controller connections from clinics
- A domain name pointing to the server (required for SSL and for Keycloak to work correctly)
- SSL certificates if using HTTPS (recommended for production)

---

## Step 1: Prepare Files

Create a directory for the deployment and place the following files inside it:

```
deployment/
    docker-compose.yml
    .env
    nginx_server.conf
    nginx.conf
    nginx_conf_HTTP.conf       # for HTTP (no-ssl profile)
    nginx_conf_HTTPS.conf      # for HTTPS (ssl profile)
    nginx_conf_ssl.conf        # shared SSL directives (ssl profile only)
    keycloak-realms/
        realm-export.json      # pre-configured Keycloak realm
    env/
        datamodeler-secrets.env
        global-learning-secrets.env
        keycloak-secrets.env
        orch-secrets.env
    umls/                      # optional: UMLS data for the data modeler
    sapbert/                   # optional: SapBERT model data for the data modeler
```

---

## Step 2: Configure the Environment

### `.env` — main settings

This is the primary configuration file. All values here are injected into the Docker Compose services.

```dotenv
# Docker image tag used for all platform services
IMAGE_TAG=latest

# Frontend image (can differ from the backend IMAGE_TAG)
FRONTEND_IMAGE=gitlab.cosy.bio:5050/cosybio/federated-learning/federated_db/frontend-shared/global-fl-net:latest

# Full URL of this deployment (used for CORS, Keycloak redirect URLs)
DEPLOYED_ON_DOMAIN=https://your-domain.com

# Hostname without protocol (used by Nginx server_name)
HOSTNAME=your-domain.com

# Where Nginx binds (use 127.0.0.1:80 if behind another proxy, or 0.0.0.0:443 for direct HTTPS)
NGINX_PORT=0.0.0.0:443

# TCP port for global relay — clinic controllers connect here directly
RELAY_TCP_PORT=0.0.0.0:9150

# Minimum number of clinic clients required to start a federated learning run
MIN_CLIENTS_NEEDED_FOR_LEARNING=2

# Active Nginx profile: "no-ssl" for HTTP only, "ssl" for HTTPS
COMPOSE_PROFILES=ssl

# SSL certificate files (only needed for COMPOSE_PROFILES=ssl)
SSL_CERT_PUBLIC_KEY=/etc/ssl/certs/your-domain.crt
SSL_CERT_PRIVATE_KEY=/etc/ssl/private/your-domain.key
```

| Variable | Description |
|---|---|
| `IMAGE_TAG` | Docker image tag for all backend services (`latest`, `staging`, or a specific version). |
| `FRONTEND_IMAGE` | Full image reference for the frontend container. |
| `DEPLOYED_ON_DOMAIN` | The public URL of the deployment (with protocol). Used for CORS and Keycloak redirect URLs. |
| `HOSTNAME` | Domain name without protocol. Used by Nginx `server_name`. |
| `NGINX_PORT` | `IP:port` Nginx binds on. Use `0.0.0.0:443` for public HTTPS or `127.0.0.1:80` if behind another proxy. |
| `RELAY_TCP_PORT` | `IP:port` for the %%DEPLOYED_PRODUCT_NAME%% relay TCP port. Clinic controllers connect here directly. |
| `MIN_CLIENTS_NEEDED_FOR_LEARNING` | Minimum number of active client participants required before a federated learning run can start. |
| `COMPOSE_PROFILES` | Set to `ssl` to use HTTPS, or `no-ssl` for HTTP. Only the matching reverse proxy service is started. |
| `SSL_CERT_PUBLIC_KEY` | Absolute path to the TLS certificate file (PEM format). Only required for `ssl` profile. |
| `SSL_CERT_PRIVATE_KEY` | Absolute path to the TLS private key file (PEM format). Only required for `ssl` profile. |

### `env/` — secrets files

Each secret file is mounted by specific services. Create them with the following content and **replace all passwords with strong, random values**:

**`env/keycloak-secrets.env`**
```dotenv
POSTGRES_PASSWORD=change-me
KC_DB_PASSWORD=change-me
KC_BOOTSTRAP_ADMIN_USERNAME=admin
KC_BOOTSTRAP_ADMIN_PASSWORD=change-me-immediately
```

**`env/global-learning-secrets.env`**
```dotenv
POSTGRES_PASSWORD=change-me
QUARKUS_DATASOURCE_PASSWORD=change-me
QUARKUS_OIDC_CREDENTIALS_SECRET=change-me
```

**`env/datamodeler-secrets.env`**
```dotenv
NEO4J_AUTH=neo4j/change-me
QUARKUS_DATASOURCE_PASSWORD=change-me
QUARKUS_OIDC_CREDENTIALS_SECRET=change-me
```

**`env/orch-secrets.env`**
```dotenv
POSTGRES_PASSWORD=change-me
QUARKUS_DATASOURCE_PASSWORD=change-me
ORCH_DOCKER__GITLAB__REGISTRY_PASSWORD=your-registry-pat
PIPELINE_DOCKER_PASSWORD=your-registry-pat
PIPELINE_REPO_TOKEN=your-repo-token
```

> **Security note:** Never commit these files to version control. The `.gitignore` in the deployment folder excludes the `env/` directory.

---

## Step 3: Configure SSL (HTTPS profile)

For production, always use the `ssl` profile. You need a valid TLS certificate for your domain.

### Option A: Let's Encrypt (internet-accessible server)

```bash
sudo certbot certonly --standalone -d your-domain.com \
  --deploy-hook "docker compose -f /path/to/docker-compose.yml exec reverse-proxy-encrypted nginx -s reload"
```

After certificates are issued, set in `.env`:
```dotenv
SSL_CERT_PUBLIC_KEY=/etc/letsencrypt/live/your-domain.com/fullchain.pem
SSL_CERT_PRIVATE_KEY=/etc/letsencrypt/live/your-domain.com/privkey.pem
COMPOSE_PROFILES=ssl
NGINX_PORT=0.0.0.0:443
```

### Option B: Self-signed certificate (non-internet server)

```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/flnet.key \
  -out /etc/ssl/certs/flnet.crt
```

Then set in `.env`:
```dotenv
SSL_CERT_PUBLIC_KEY=/etc/ssl/certs/flnet.crt
SSL_CERT_PRIVATE_KEY=/etc/ssl/private/flnet.key
COMPOSE_PROFILES=ssl
```

### Option C: HTTP only (development / behind another proxy)

```dotenv
COMPOSE_PROFILES=no-ssl
NGINX_PORT=127.0.0.1:8250
```

The SSL cipher and protocol configuration (applied automatically in the `ssl` profile) enforces TLS 1.2/1.3 only and HSTS.

---

## Step 4: Pull Images and Start

Log into the registry:

```bash
docker login gitlab.cosy.bio:5050
```

Pull all images and start the stack:

```bash
docker compose pull
docker compose up -d
```

Watch the startup logs (Keycloak can take up to 60 seconds on first boot):

```bash
docker compose logs -f keycloak
```

Wait until you see Keycloak report as healthy before accessing the frontend.

---

## Step 5: Initial Keycloak Setup

The realm is imported automatically from `keycloak-realms/realm-export.json` when Keycloak first starts. You still need to:

1. Navigate to `https://your-domain.com/auth/`
2. Log in with the admin credentials from `env/keycloak-secrets.env` (`KC_BOOTSTRAP_ADMIN_USERNAME` / `KC_BOOTSTRAP_ADMIN_PASSWORD`).
3. **Change the admin password immediately** via the upper right → Manage Account.
4. Switch to the **%%DEPLOYED_PRODUCT_NAME%%-Global** realm (left sidebar → Manage Realms).
5. Create user accounts for platform administrators under Users.

---

## Step 6: Automatic Updates with Watchtower

All services have the label `com.centurylinklabs.watchtower.enable=true`. If you run [Watchtower](https://containrrr.dev/watchtower/), it will automatically pull and restart containers when new image versions are published:

```bash
docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower \
  --label-enable \
  --interval 300
```

---

## Nginx Routing Reference

All services are proxied through a single Nginx instance. The routing is:

| Path prefix | Upstream service | Notes |
|---|---|---|
| `/` | `frontend:80` | Web frontend (catch-all) |
| `/api/` | `global-learning-api:8080` | REST + WebSocket API. WebSocket upgrade is passed through. |
| `/api/query/sse` | `global-learning-api:8080` | SSE endpoint — buffering disabled, 24h read timeout. |
| `/data-modeler/` | `datamodeler-api:8080` | Data modeler REST API |
| `/auth/` | `keycloak:8080` | Keycloak authentication |
| `/relay/` | `relay-server:9141` | Relay HTTP gateway (for clinic controller WebSocket handshake) |
| `/documentation/` | `documentation:80` | This documentation site |

The relay server also binds the **TCP port** (`RELAY_TCP_PORT`) directly — this is outside of Nginx and used for persistent TCP connections from clinic %%DEPLOYED_PRODUCT_NAME%% controllers.

---

## Data Volumes

All persistent data is stored in named Docker volumes:

| Volume | Service | Contents |
|---|---|---|
| `global-learning-db-volume` | `global-learning-db` | Federated learning management data |
| `datamodeler-db` | `datamodeler-db` | Neo4j graph database (data model) |
| `keycloak_postgres_volume` | `keycloak-postgres` | Keycloak database |
| `orch-data-volume` | `orch-api` | File transfer data between orch-api and spawned tool containers |
| `orch-db-volume` | `orch-db` | Orchestration management data |

To back up a volume:

```bash
docker run --rm \
  -v <volume-name>:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/<volume-name>.tar.gz -C /data .
```

---

## Firewall Requirements

| Port | Protocol | Purpose |
|---|---|---|
| 80 or 443 | TCP | Nginx reverse proxy (HTTP or HTTPS) |
| `RELAY_TCP_PORT` (default `9150`) | TCP | %%DEPLOYED_PRODUCT_NAME%% relay server — clinic controllers connect here |

All other ports stay internal to the Docker network.

---

## Troubleshooting

**Keycloak fails to start**
```bash
docker compose logs keycloak-postgres
docker compose logs keycloak
```
Ensure `keycloak-postgres` is healthy before Keycloak tries to start. The `depends_on` condition handles this automatically, but on first boot with an empty volume the database initialization can take longer.

**Nginx returns 502 Bad Gateway**

This usually means an upstream service hasn't started yet. Check:
```bash
docker compose ps
docker compose logs <service-name>
```
Nginx is configured to restart automatically — it should recover once all upstreams are healthy.

**Relay TCP port is unreachable from clinics**

Check that your firewall allows inbound TCP on `RELAY_TCP_PORT`. The relay service binds on `0.0.0.0:9150` by default.

**"No aggregated results / federated run never starts"**

Check `MIN_CLIENTS_NEEDED_FOR_LEARNING` in `.env`. If this is set to `2` but only one clinic is connected, runs will not start.
