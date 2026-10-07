---
title: Federated Communication Layer
sidebar_position: 1
---

# Federated communication layer
This section is for contributors working on the federated communication layer of FL-Net. It lives in the [Federated-Learning-Communication-API](https://github.com/FedLearnNet/Federated-Learning-Communication-API) repository and consists of two Go services:

- **Controller:** one per federated learning node (Client). It relays the data of a running federated Tool into the network and applies end-to-end encryption, SMPC, and DP.
- **Relay server:** one per network, deployed with the Platform. All controllers connect to it, and it relays messages between them.

Neither service orchestrates federated learning: the Learning APIs register and start runs. How the controller and relay server are used during a run is described step by step in the [Federated learning flow](../backend/federated-learning-flow.md).

## Getting started
The [README](https://github.com/FedLearnNet/Federated-Learning-Communication-API#readme) of the repository is the source of truth for the commands below. It also describes all configuration options and the internal architecture of both services.

**Prerequisites:** Go (version in `go.mod`), Docker for the images, and Python 3 for the end-to-end tests.

**Build and start** a relay server and a controller in development mode:
```bash
go build -o relay ./cmd/relay
go build -o controller ./cmd/controller

./relay --mode dev --tls-mode self-signed --domain localhost
./controller --address-tcp localhost:9141 --mode dev --tls-mode self-signed
```
Alternatively, `docker compose up` starts a relay and a controller from the published staging images.

**Testing:**
```bash
gofmt -l .                                   # must print nothing
go test ./...                                # unit tests
pip install -r e2etests/requirements.txt
bash e2etests/e2e_test.sh                    # end-to-end tests (plain, DP and SMPC message flows)
```
CI additionally runs golangci-lint and govulncheck.
