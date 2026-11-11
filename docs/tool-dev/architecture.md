---
id: architecture
title: Engine Architecture
---

`pyfedappwrap` runs inside the Tool container. The Learning API owns the [run, steps, and attempts](../contribution-guide/backend/execution-model/index.md); Orch API manages Docker.

For managed executions:

1. The launcher injects `APP_ID` (attempt ID), `APP_API_KEY`, `WS_URL`, and `HTTP_URL`.
2. The engine connects to `/execution/APP/{APP_ID}/app` with `X-API-Key` and receives parameters, inputs, and optional federation config.
3. Tool code runs through the registered app entrypoint. The engine sends progress, logs, and metrics over the socket; files use HTTP uploads or the attempt's volume.
4. A finish message ends the attempt. The backend keeps required outputs, revokes its key, stops the container, and advances the step.

For federated Tools, model updates use the Controller and Relay; the attempt socket carries lifecycle messages. See [Federated learning flow](../contribution-guide/backend/federated-learning-flow.md).

Development engines use `/testembed/` with the registered Tool ID as `APP_ID`. Authenticate to bootstrap an `APP_API_KEY`, or use the key provided by the Platform.
