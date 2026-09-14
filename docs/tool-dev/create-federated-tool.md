---
id: create-federated-tool
title: Create a Federated Learning Tool
sidebar_position: 1
---

Federated learning in the %%DEPLOYED_PRODUCT_NAME%% network allows multiple participants (clients) to collaboratively train or compute results without sharing their raw data. Each client processes its local data independently, sends only computed values (e.g. gradients, statistics) to a central aggregator, and receives the aggregated result back.

This guide walks through building a federated tool from scratch: the **client tool** that runs on each participant and the **aggregator** that combines their results.

---

## Architecture Overview

A federated run in the %%DEPLOYED_PRODUCT_NAME%% network involves three components:

1. **Client Tool** — runs on each participant node. It processes local data, sends intermediate results to the aggregator, and receives the aggregated response.
2. **Aggregator** — a lightweight function that combines the payloads from all clients into a single result (e.g. averaging, summing, voting).
3. **FLNet Controller** — the backend communication layer that routes messages between clients and aggregator. You do not implement this; it is provided by the platform.

```
┌──────────┐       send_data        ┌────────────┐       broadcast       ┌──────────┐
│ Client A │ ───────────────────▶   │ Aggregator │   ◀─────────────────  │ Client B │
│          │                        │  (server)  │                       │          │
│          │ ◀──── aggregated ───── │            │ ──── aggregated ────▶ │          │
└──────────┘        result          └────────────┘       result          └──────────┘
```

All communication is handled automatically through the `communicator` object that each client tool receives at startup.

---

## Prerequisites

Before starting, make sure you have:

- Completed the basic [Create a New Tool](create-tool.md) guide (tool registration, environment setup, folder structure).
- **Python 3.11+** with `pyfedappwrap>=0.6.40` installed.
- A registered **App ID** from the platform.

---

## Step 1: Define Configuration and Data Schemas

Just like a central tool, you define your config, input, and output using Pydantic dataclasses.

```python
from typing import Any
from pydantic.dataclasses import dataclass
from pyfedappwrap.learning.run_runfig import AppConfig, AppInputConfig, AppOutputConfig


@dataclass
class MyFederatedConfig(AppConfig):
    communication_id: str = "round-1"
    output_filename: str = "result.csv"


@dataclass
class MyFederatedInput(AppInputConfig):
    input: Any = None


@dataclass
class MyFederatedOutput(AppOutputConfig):
    output: Any = None
```

- **`communication_id`** — a shared identifier that links one round of client-sends to the corresponding aggregator-receive. All clients and the aggregator must use the same `communication_id` within a single round.
- **`input`** / **`output`** — your tool-specific data fields. Use `Any`, `pd.DataFrame`, `Path`, or any supported type (see [input type mapping](create-tool.md#how-input-type-mapping-works)).

---

## Step 2: Implement the Client Tool

The client tool extends `BaseFederatedApp` instead of `BaseApp`. This gives you access to `self.communicator`, which handles all network communication with the FLNet controller.

```python
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd

from pyfedappwrap.engine.federated import FLNetMessageMetaDTO
from pyfedappwrap.learning.federated import BaseFederatedApp


class MyFederatedClientApp(
    BaseFederatedApp[MyFederatedConfig, MyFederatedInput, MyFederatedOutput]
):
    def run_train(self, data: MyFederatedInput) -> MyFederatedOutput:
        config = self.config or MyFederatedConfig()

        # --- 1. Process local data ---
        df = data.input
        numeric_df = df.select_dtypes(include="number")
        local_vector = numeric_df.mean().to_numpy(dtype=float)

        # --- 2. Send to aggregator and wait for result ---
        response = self.communicator.aggregate(
            local_vector,
            communication_id=config.communication_id,
            data_type=np.ndarray,
            meta=FLNetMessageMetaDTO(
                communication_id=config.communication_id,
                round=1,
                aggregator="mean",
            ),
        )

        # --- 3. Use aggregated result ---
        aggregated_df = pd.DataFrame([response.data], columns=numeric_df.columns)
        self.save_local_csv(aggregated_df, config.output_filename)
        return MyFederatedOutput(output=aggregated_df)

    def run_prediction(self, data: MyFederatedInput) -> MyFederatedOutput:
        return self.run_train(data)

    def _save(self) -> str:
        return "client"

    def _load(self, path: str):
        return Path(path)
```

### What `BaseFederatedApp` gives you

`BaseFederatedApp` extends `BaseApp` with:

| Feature | Description |
|---|---|
| `self.communicator` | A `FLNetCommunicatorClient` instance, created automatically at startup. Handles sending data to the aggregator, receiving aggregated results, and serialization. |
| `self.configure_federation(...)` | Override federation settings (controller URL, app key, client ID, etc.) programmatically. Usually not needed — defaults are read from `.env`. |
| `self.save_local_csv(df, filename)` | Helper to save a DataFrame to the configured output directory. |
| `self.resolve_local_data_path(filename)` | Resolve a filename relative to the data directory. |
| `self.resolve_local_output_path(filename)` | Resolve a filename relative to the output directory. |

### You must implement

| Method | Purpose |
|---|---|
| `run_train(data)` | Your federated training logic. Process local data, communicate with the aggregator, return output. |
| `run_prediction(data)` | Prediction/inference logic. For many federated apps, this delegates to `run_train`. |
| `_save()` | Persist model state to disk. Return a path or identifier. |
| `_load(path)` | Restore model state from disk. |

---

## Step 3: Understand the Communicator

The `communicator` (`FLNetCommunicatorClient`) is your interface to the FLNet controller. It provides three main operations:

### `communicator.aggregate(data, ...)` — Send + Wait (most common)

This is the all-in-one method: it sends your local data to the aggregator and blocks until the aggregated result comes back.

```python
response = self.communicator.aggregate(
    local_vector,                          # your local payload (any serializable type)
    communication_id="round-1",            # must match across all clients
    data_type=np.ndarray,                  # expected return type (for deserialization)
    meta=FLNetMessageMetaDTO(
        communication_id="round-1",
        round=1,
        aggregator="mean",                 # which aggregator to use (matches the key from registration)
    ),
)

# response is a FLNetDataPackageDTO:
# - response.data     → the aggregated result (deserialized to data_type)
# - response.sender   → who sent it (the aggregator ID)
# - response.meta     → metadata about the communication
```

### `communicator.send_data_to_aggregator(data, ...)` — Send only

If you need more control, you can separate the send and receive steps.

```python
communication_id = self.communicator.send_data_to_aggregator(
    local_vector,
    communication_id="round-1",
    meta=FLNetMessageMetaDTO(
        communication_id="round-1",
        aggregator="mean",
    ),
)
```

### `communicator.await_data_from_aggregator(...)` — Receive only

Wait for the aggregated result from the aggregator.

```python
response = self.communicator.await_data_from_aggregator(
    communication_id="round-1",
    data_type=np.ndarray,
)
```

### Communication metadata (`FLNetMessageMetaDTO`)

Every message can carry metadata:

| Field | Type | Description |
|---|---|---|
| `communication_id` | `str` | Links sends and receives within one round. All clients and the aggregator must share the same ID per round. |
| `epoch` | `int` | Optional epoch number (for multi-epoch training). |
| `round` | `int` | Optional round number within an epoch. |
| `aggregator` | `str` | The registered key of the aggregator to use (default: `"default"`). |
| `extras` | `dict` | Arbitrary key-value pairs for custom metadata. |

---

## Step 4: Implement the Aggregator

The aggregator is a simple class that combines payloads from all clients into one result. It extends `AppAggregator` and implements a single method.

```python
from typing import Any, Optional

import numpy as np

from pyfedappwrap.engine.federated import AppAggregator, FLNetMessageMetaDTO


class MeanVectorAggregator(AppAggregator):
    def aggregate(
        self,
        data: list[Any],
        n_clients: int,
        meta: Optional[FLNetMessageMetaDTO] = None,
    ) -> Any:
        stacked = np.stack(data)
        return np.mean(stacked, axis=0)
```

### The `aggregate` method

| Parameter | Type | Description |
|---|---|---|
| `data` | `list[Any]` | A list of payloads, one per client. The order matches the order in which clients sent their data. Each entry is the deserialized version of what the client passed to `communicator.aggregate(...)`. |
| `n_clients` | `int` | The number of clients that contributed. Equal to `len(data)`. |
| `meta` | `FLNetMessageMetaDTO` | Metadata from the last received package (round, epoch, communication_id, etc.). |
| **Return** | `Any` | The aggregated result. This is serialized and broadcast back to all clients. |

### Common aggregation patterns

| Pattern | Example |
|---|---|
| **Mean** | `np.mean(np.stack(data), axis=0)` |
| **Weighted average** | Weight by sample count sent in metadata |
| **Sum** | `np.sum(np.stack(data), axis=0)` |
| **Majority vote** | `Counter(data).most_common(1)[0][0]` |
| **FedAvg (gradient averaging)** | Average model weight diffs, apply to global model |

### Multiple aggregators

You can register more than one aggregator under different keys. Clients select which aggregator to use via the `aggregator` field in `FLNetMessageMetaDTO`:

```python
engine.register_aggregator(MeanVectorAggregator(), "mean")
engine.register_aggregator(SumAggregator(), "sum")
```

A client targets a specific aggregator like this:

```python
response = self.communicator.aggregate(
    local_data,
    communication_id="round-1",
    meta=FLNetMessageMetaDTO(aggregator="mean"),  # selects the "mean" aggregator
)
```

If no `aggregator` is specified, it defaults to `"default"`.

---

## Step 5: Create the Entrypoint (`main.py`)

The entrypoint registers both the client tool and the aggregator(s) with the engine.

```python
from pyfedappwrap.engine.runtime import FedDBEngine

from my_app import MyFederatedClientApp
from my_aggregator import MeanVectorAggregator

engine = FedDBEngine()

engine.register_aggregator(MeanVectorAggregator(), "mean")
engine.register_federated(MyFederatedClientApp())

if __name__ == '__main__':
    engine.start()
    engine.wait_until_stop()
```

### Registration methods

| Method | Purpose |
|---|---|
| `engine.register_federated(app)` | Registers a `BaseFederatedApp` as the client tool. This also calls `engine.register(app)` internally, so test data and hyperparams are set up automatically. |
| `engine.register_aggregator(aggregator, key)` | Registers an `AppAggregator` under a named key. You can register multiple aggregators with different keys. |

Note the difference from a central tool: use `register_federated()` instead of `register()`.

---

## Step 6: Configure `app.yml`

The `app.yml` for a federated tool follows the same format as a central tool. The key addition is that your hyperparams should include federation-specific parameters like `communication_id`.

```yaml
config:
  hyperparams:
    - name: communication_id
      type: STRING
      default: round-1
      description: Communication id shared between clients and aggregator for one federated round.
    - name: output_filename
      type: STRING
      default: result.csv
      description: CSV file written by each client into its local output directory.
  input:
    - name: input
      type: CSV
      required: false
      description: Local client input table.
      delimiter: ","
      hasHeader: true
  output:
    - name: output
      type: CSV
      required: false
      description: Client-side aggregated response.
      delimiter: ","
      hasHeader: true
info:
  name: My Federated App
  slug: my-federated-app
  type: ANALYSIS
  shortDescription: A federated learning app.
```

---

## Step 7: Configure Environment (`.env`)

In addition to the standard variables from the [central tool guide](create-tool.md#2-configure-environment), federated tools require:

```dotenv
APP_ID=YOUR_APP_ID
APP_KEY=YOUR_APP_KEY
ENABLE_CONFIG_SYNC=true
TRACE_PERFORMANCE=false
ENABLE_PROJECT_STARTUP=false

MODEL_DIR=./
DATA_DIR=./data/

WS_URL=%%DEPLOYED_PRODUCT_WS_URL%%/api/testembed/
```

- **`APP_KEY`** — required for communication with the %%DEPLOYED_PRODUCT_NAME%% networks platform. Each participant authenticates with this key.
- **`APP_ID`** — used as the client ID in federated communication by default.

---

## Step 8: Data Serialization

The %%DEPLOYED_PRODUCT_NAME%% networks communication layer automatically serializes and deserializes data sent between clients and aggregator using `FLNetSerializer`. The following types are supported out of the box:

| Python Type | Serialization |
|---|---|
| `np.ndarray` | Stored as `{"dtype", "shape", "data"}` — fully reconstructed on receive. |
| Pydantic `BaseModel` | Serialized via `model_dump()`, reconstructed via `model_validate()`. |
| `@dataclass` | Serialized via `asdict()`, reconstructed field-by-field with type resolution. |
| `dict`, `list`, `tuple` | Recursively serialized. |
| Scalars (`int`, `float`, `str`, `bool`) | Passed as-is. |

When calling `communicator.aggregate(...)` or `communicator.await_data_from_aggregator(...)`, pass the expected return type via the `data_type` parameter so the deserializer knows how to reconstruct the result:

```python
response = self.communicator.aggregate(
    local_vector,
    communication_id="round-1",
    data_type=np.ndarray,  # tells the deserializer to reconstruct as a NumPy array
)
```

---

## Step 9: Privacy Features (SMPC & Differential Privacy)

The %%DEPLOYED_PRODUCT_NAME%% network supports two privacy-enhancing techniques that can be applied to federated communication.

### Secure Multi-Party Computation (SMPC)

SMPC ensures that the aggregator never sees individual client contributions in plaintext. Instead, each client's data is split into secret shares that are only meaningful when combined.

Enable globally via `.env`:

```dotenv
SMPC__ENABLED=true
SMPC__USE_SMPC=true
SMPC__EXPONENT=8
SMPC__NUM_SHARDS=0
SMPC__OPERATION=add
```

Or pass per-request:

```python
from pyfedappwrap.engine.config.system_config import FLNetSMPCSettings

response = self.communicator.aggregate(
    local_vector,
    communication_id="round-1",
    smpc=FLNetSMPCSettings(
        use_smpc=True,
        exponent=8,
        operation="add",
    ),
)
```

| Setting | Type | Default | Description |
|---|---|---|---|
| `use_smpc` | `bool` | `False` | Whether to use SMPC for this communication. |
| `exponent` | `int` | `8` | Precision exponent for fixed-point encoding. |
| `num_shards` | `int` | `0` | Number of secret shares (0 = auto). |
| `operation` | `str` | `"add"` | Aggregation operation (`"add"`, etc.). |

### Differential Privacy (DP)

DP adds calibrated noise to client data before transmission, providing mathematical privacy guarantees.

Enable globally via `.env`:

```dotenv
DP__ENABLED=true
DP__EPSILON=0.99999
DP__NOISE_TYPE=laplace
```

Or pass per-request:

```python
from pyfedappwrap.engine.config.system_config import FLNetDPSettings

response = self.communicator.aggregate(
    local_vector,
    communication_id="round-1",
    dp=FLNetDPSettings(
        epsilon=1.0,
        delta=1e-5,
        sensitivity=1.0,
        noise_type="laplace",
    ),
)
```

| Setting | Type | Default | Description |
|---|---|---|---|
| `epsilon` | `float` | `0.99999` | Privacy budget. Lower = more private, more noise. |
| `delta` | `float` | `None` | Probability of privacy breach (for Gaussian noise). |
| `sensitivity` | `float` | `None` | Maximum change one record can cause. |
| `clipping_val` | `float` | `None` | Clip values to this magnitude before adding noise. |
| `noise_type` | `str` | `"laplace"` | `"laplace"` or `"gaussian"`. |

---

## Step 10: Multi-Round Federated Training

Many federated algorithms require multiple rounds (e.g. Federated Averaging). To implement this, loop over rounds in your `run_train` method and use a unique `communication_id` per round:

```python
def run_train(self, data: MyFederatedInput) -> MyFederatedOutput:
    df = data.input
    numeric_df = df.select_dtypes(include="number")
    n_rounds = 5

    for round_nr in range(1, n_rounds + 1):
        local_vector = numeric_df.mean().to_numpy(dtype=float)

        response = self.communicator.aggregate(
            local_vector,
            communication_id=f"round-{round_nr}",
            data_type=np.ndarray,
            meta=FLNetMessageMetaDTO(
                communication_id=f"round-{round_nr}",
                round=round_nr,
                aggregator="mean",
            ),
        )

        global_mean = response.data
        # Use global_mean to update local state for next round...

    aggregated_df = pd.DataFrame([global_mean], columns=numeric_df.columns)
    self.save_local_csv(aggregated_df, "result.csv")
    return MyFederatedOutput(output=aggregated_df)
```

All clients must use the same `communication_id` format and round count so that the controller can match sends and receives correctly.

---

## Step 10: Test Locally

You can test your federated app locally in test mode just like a central app:

```python
from pyfedappwrap.engine.config.system_config import system_settings
from pyfedappwrap.engine.runtime import FedDBEngine

from my_app import MyFederatedClientApp
from my_aggregator import MeanVectorAggregator

system_settings.config_settings_path = "app_federated.yml"

engine = FedDBEngine()

engine.register_aggregator(MeanVectorAggregator(), "mean")
engine.register_federated(MyFederatedClientApp())

if __name__ == '__main__':
    engine.start()
    engine.wait_until_stop()
```

### Local federated simulation with `LocalFederatedRunner`

For integration testing with multiple simulated participants, use `LocalFederatedRunner`. This runs the full federated flow in-memory without needing a real FL-Net controller:

```python
from pathlib import Path

from pyfedappwrap.engine.federated import (
    FLNetLocalParticipantConfigDTO,
    FLNetLocalTestConfigDTO,
    LocalFederatedRunner,
)

from my_app import MyFederatedClientApp
from my_aggregator import MeanVectorAggregator

config = FLNetLocalTestConfigDTO(
    participants=[
        FLNetLocalParticipantConfigDTO(
            participant_id="aggregator-1",
            role="AGGREGATOR",
            base_dir=Path("test_data/aggregator"),
            hyper_params={"communication_id": "round-1"},
        ),
        FLNetLocalParticipantConfigDTO(
            participant_id="client-1",
            role="CLIENT",
            base_dir=Path("test_data/client1"),
            data_dir=Path("test_data/client1/data"),
            input_file_paths={"input": "local_data.csv"},
            hyper_params={"communication_id": "round-1", "output_filename": "result.csv"},
        ),
        FLNetLocalParticipantConfigDTO(
            participant_id="client-2",
            role="CLIENT",
            base_dir=Path("test_data/client2"),
            data_dir=Path("test_data/client2/data"),
            input_file_paths={"input": "local_data.csv"},
            hyper_params={"communication_id": "round-1", "output_filename": "result.csv"},
        ),
    ],
    timeout=10.0,
    max_polls=500,
)

runner = LocalFederatedRunner(config, aggregators={"mean": MeanVectorAggregator()})

apps_by_participant = {
    "client-1": MyFederatedClientApp(),
    "client-2": MyFederatedClientApp(),
}

results = runner.run(apps_by_participant)

for participant_id, result in results.items():
    print(f"{participant_id}: success={result.success}, result={result.result}")
```

### `FLNetLocalParticipantConfigDTO` fields

| Field | Type | Description |
|---|---|---|
| `participant_id` | `str` | Unique ID for this participant. |
| `role` | `"CLIENT"` or `"AGGREGATOR"` | Whether this participant is a client or the aggregator. |
| `base_dir` | `Path` | Base directory for this participant's files. |
| `data_dir` | `Path` | Directory containing input data (defaults to `base_dir/data`). |
| `output_dir` | `Path` | Directory for output files (defaults to `base_dir/output`). |
| `hyper_params` | `dict` | Hyperparameters passed to the app's config. |
| `input_file_paths` | `dict[str, str]` | Maps input field names to filenames in the data directory. |

### `FLNetLocalTestConfigDTO` fields

| Field | Type | Default | Description |
|---|---|---|---|
| `participants` | `list` | — | List of participant configurations. |
| `poll_interval` | `float` | `0.01` | Seconds between polls when waiting for data. |
| `timeout` | `float` | `5.0` | Max seconds to wait for data before raising `TimeoutError`. |
| `max_polls` | `int` | `500` | Max polling attempts. |
| `start_aggregator` | `bool` | `True` | Whether the runner should automatically start the aggregator thread. |

---

## Complete Example: Federated Mean

Here is a complete, minimal federated app that computes the mean of numeric columns across distributed participants.

### `aggregator.py`

```python
from typing import Any, Optional

import numpy as np

from pyfedappwrap.engine.federated import AppAggregator, FLNetMessageMetaDTO


class MeanVectorAggregator(AppAggregator):
    def aggregate(self, data: list[Any], n_clients: int,
                  meta: Optional[FLNetMessageMetaDTO] = None) -> Any:
        stacked = np.stack(data)
        return np.mean(stacked, axis=0)
```

### `app.py`

```python
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
from pydantic.dataclasses import dataclass

from pyfedappwrap.engine.federated import FLNetMessageMetaDTO
from pyfedappwrap.learning.federated import BaseFederatedApp
from pyfedappwrap.learning.run_runfig import AppConfig, AppInputConfig, AppOutputConfig


@dataclass
class FederatedMeanConfig(AppConfig):
    communication_id: str = "round-1"
    output_filename: str = "result.csv"


@dataclass
class FederatedMeanInput(AppInputConfig):
    input: Any = None


@dataclass
class FederatedMeanOutput(AppOutputConfig):
    output: Any = None


class FederatedMeanClientApp(
    BaseFederatedApp[FederatedMeanConfig, FederatedMeanInput, FederatedMeanOutput]
):
    def run_train(self, data: FederatedMeanInput) -> FederatedMeanOutput:
        config = self.config or FederatedMeanConfig()
        df = data.input
        numeric_df = df.select_dtypes(include="number")

        local_vector = numeric_df.mean().to_numpy(dtype=float)

        response = self.communicator.aggregate(
            local_vector,
            communication_id=config.communication_id,
            data_type=np.ndarray,
            meta=FLNetMessageMetaDTO(
                communication_id=config.communication_id,
                round=1,
                aggregator="mean",
            ),
        )

        aggregated_df = pd.DataFrame([response.data], columns=numeric_df.columns)
        self.save_local_csv(aggregated_df, config.output_filename)
        return FederatedMeanOutput(output=aggregated_df)

    def run_prediction(self, data: FederatedMeanInput) -> FederatedMeanOutput:
        return self.run_train(data)

    def _save(self) -> str:
        return "client"

    def _load(self, path: str):
        return Path(path)
```

### `main.py`

```python
from pyfedappwrap.engine.config.system_config import system_settings
from pyfedappwrap.engine.runtime import FedDBEngine

from aggregator import MeanVectorAggregator
from app import FederatedMeanClientApp

system_settings.config_settings_path = "app_federated.yml"

engine = FedDBEngine()

engine.register_aggregator(MeanVectorAggregator(), "mean")
engine.register_federated(FederatedMeanClientApp())

if __name__ == '__main__':
    engine.start()
    engine.wait_until_stop()
```

---

## Folder Structure

```
my-federated-app/
    app.py                  # Client app (BaseFederatedApp)
    aggregator.py           # Aggregator (AppAggregator)
    main.py                 # Entrypoint
    app_federated.yml       # App configuration
    requirements.txt        # Dependencies
    Dockerfile              # Container build
    .env                    # Environment variables
    data/                   # Local test data
        local_data.csv
```

---

## Key Differences from Central Tools

| Aspect | Central Tool | Federated Tool |
|---|---|---|
| Base class | `BaseApp` | `BaseFederatedApp` |
| Registration | `engine.register(app)` | `engine.register_federated(app)` + `engine.register_aggregator(agg, key)` |
| Communication | None (local only) | `self.communicator` for sending/receiving data via the %%DEPLOYED_PRODUCT_NAME%% network |
| Aggregator | Not needed | Required — implements `AppAggregator.aggregate()` |
| Privacy | N/A | Optional SMPC and Differential Privacy |
| Testing | `TEST_MODE=true` | `TEST_MODE=true` or `LocalFederatedRunner` for multi-participant simulation |
