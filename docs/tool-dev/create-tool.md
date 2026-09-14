---
id: create-tool
title: Create a New App - Step by Step
sidebar_position: 0
---

Building a new app for the platform involves two main parts:

1. **Register the app in the platform UI** (via the `/app` page form).
2. **Develop and package your code** (following the app folder structure).

---

## 0) Create an App Entry in the Platform

Navigate to **`/app`** in the frontend and click **"New App"**.  
You will see a form like this:

- **Name** - Human-readable name of your app
- **Image Name** - The Docker image name (later used when publishing)
- **Version** - Semantic version, e.g., `0.0.1`
- **App Type** - Select type (ANALYSIS, PREPROCESSING, etc.)
- **Slug** - Unique short identifier (used in URLs)
- **Source Code URL** - Link to your repo (optional)
- **Short Description** - A one-liner description
- **README** - Extended description (optional)

👉 After submission, the backend assigns an **App ID**.  
This **App ID is crucial**: you’ll need it in your `.env` configuration and when registering models.

---

## 1) Install Dependencies

You need Python libraries to run your app.  
There are two common ways to manage dependencies:

- Ensure you have **Python 3.11+** installed.
- Always use a **virtual environment** to isolate dependencies.

### Option A: Install directly

```bash
python3 -m pip install --upgrade pip
python3 -m pip install --extra-index-url https://test.pypi.org/simple/ pyfedappwrap
```

### Option B: Use a requirements.txt (recommended)

Create a requirements.txt file in your app folder:

```txt
# Core framework (from TestPyPI)
--extra-index-url https://test.pypi.org/simple/
pyfedappwrap>=0.6.40

# Dependencies required by pyfedappwrap (automatically installed, but listed for clarity)
websockets~=15.0.1
pydantic-yaml==1.3.0
PyYAML~=6.0.2
watchdog~=5.0.3
pydantic~=2.9.2
pydantic-settings~=2.6.0
pydantic_yaml~=1.3.0
requests~=2.32.3
validators~=0.35.0
```

Then install everything with:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

✅ Using a requirements.txt makes your setup reproducible and works seamlessly with Docker builds.
You can create a `requirements-dev.txt` for local development and a separate one for Docker builds.
---

## 2) Configure Environment

Create a `.env` file to store environment variables. Replace `YOUR_APP_ID` with the ID you just created in step 0.

```dotenv
APP_ID=YOUR_APP_ID
ENABLE_CONFIG_SYNC=true
TRACE_PERFORMANCE=false
ENABLE_PROJECT_STARTUP=false

MODEL_DIR=./
DATA_DIR=./data/

WS_URL=%%DEPLOYED_PRODUCT_WS_URL%%/api/testembed/
```

Below is an overview of all available configuration options:

| Variable                     | Type   | Default                              | Description                                                                                                                                 |
|------------------------------|--------|--------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| **`APP_ID`**                 | `str`  | *(no default)*                       | Unique identifier of your app (e.g. the App ID from the FeatureCloud App Store).                                                            |
| **`APP_KEY`**                | `str?` | `None`                               | Optional API key or secret for authentication.                                                                                              |
| **`ENABLE_CONFIG_SYNC`**     | `bool` | `false`                              | If `true`, synchronizes configuration between the frontend and the database. Changes made in the UI will also be written back to `app.yml`. |
| **`PRIO_LOCAL_CONFIG`**      | `bool` | `false`                              | If `true`, the local `app.yml` has priority over database settings. Useful for local testing.                                               |
| **`TRACE_PERFORMANCE`**      | `bool` | `true`                               | Enables collection and display of performance metrics in the frontend (e.g. runtime, resource usage).                                       |
| **`ENABLE_PROJECT_STARTUP`** | `bool` | `true`                               | Controls whether the app should start automatically when a project is launched. Set to `false` if startup should be manual.                 |
| **`MODEL_DIR`**              | `str`  | `"./"`                               | Filesystem path where models should be stored.                                                                                              |
| **`DATA_DIR`**               | `str`  | `"./data/"`                          | Filesystem path to the data directory (used for test runs).                                                                                 |
| **`CONFIG_SETTINGS_PATH`**   | `str`  | `"app.yml"`                        | Path to the YAML file containing the default configuration  [page](app-yml.md) for details).                                               |
| **`READ_ME_PATH`**           | `str`  | `"README.md"`                        | Path to the README file shown in the UI as app documentation.                                                                               |
| **`WS_URL`**                 | `str`  | `"ws://localhost:8080/testembed/"`   | WebSocket endpoint for live updates (e.g. logs, status).                                                                                    |
| **`HTTP_URL`**               | `str`  | `"http://localhost:8080/testembed/"` | HTTP endpoint of the app (used for API requests or file uploads).                                                                           |
| **`URL_PREFIX_REMOVE`**      | `str`  | `"api"`                              | Defines which URL prefix should be stripped for internal routing.                                                                           |
| **`USE_DOCKERIZED_CONTROLLER`**  | `bool` | `false`                              | If `true`, when running a federated simulation uses the same service that will be used when the tool gets used in a federated learning scenario. Use the docker compose file given to start these services.

---

## 3) Define Configuration Schemas

Use `pydantic.dataclasses` to describe your app config, inputs, and outputs.
See the [page](app-yml.md) for a full explanation of the schema and supported types.

```python
from pathlib import Path
from typing import Any, Optional

import pandas as pd
from pydantic.dataclasses import dataclass
from pyfedappwrap.learning.run_runfig import AppConfig, AppInputConfig, AppOutputConfig


@dataclass
class MyAppConfig(AppConfig):
    normalize: bool = True


@dataclass
class MyAppInputConfig(AppInputConfig):
    # Will be parsed as Path
    input_file: Path

    # Will be parsed as pd.DataFrame if possible
    table: pd.DataFrame

    # Will prefer pd.DataFrame, otherwise fall back to Path
    raw_input: Any

    # Will be parsed from JSON if possible
    metadata: Optional[dict[str, Any]] = None


@dataclass
class MyAppOutputConfig(AppOutputConfig):
    result_file: Path
```

Assume your `app.yml` declares the following inputs:

- `input_file` with type `PATH`
- `table` with type `CSV`
- `raw_input` with type `CSV`
- `metadata` with type `JSON`

At runtime, the mapper will typically produce:

- `input_file` → `Path`
- `table` → `pd.DataFrame`
- `raw_input` → `pd.DataFrame` if the file can be loaded tabularly, otherwise `Path`
- `metadata` → `dict[str, Any]`

So even when two fields use the same `app.yml` type, they may be mapped differently depending on the Python field type.
---
### How input type mapping works

The runtime does not only parse inputs based on the `app.yml` input type such as `CSV`, `JSON`, `TEXT`, or `PATH`.  
It also inspects the **expected Python type** from your `AppInputConfig` Pydantic dataclass and combines both sources of information during mapping.

This means the final parsed object depends on:

1. the declared input type in `app.yml`
2. the expected target field type in your input DTO
3. whether the provided value is a local file path, remote URL, or inline value

#### Resolution strategy

For each configured input field, the runtime:

1. sanitizes the configured field name into a valid Python field name
2. looks up the corresponding field in your `AppInputConfig`
3. reads the expected Python type from the dataclass
4. parses the incoming value accordingly

#### Important behavior

- `Path` → always resolved as a filesystem path
- `pd.DataFrame` → tries to load structured tabular data as a DataFrame
- `Any` → prefers `pd.DataFrame` if possible, otherwise falls back to a `Path`
- `dict[...]` / `list[...]` → parsed as JSON structures when possible
- `str` → parsed as text
- `bytes` → parsed as binary content, e.g. images
- `int`, `float`, `bool` → parsed as scalar values
- `Optional[T]` → treated like `T`

This allows you to keep `app.yml` focused on transport and storage format, while your Python DTO controls the in-memory type used by your app logic.

## 4) Implement Your App Logic

Each app must inherit from `BaseApp` and implement training, prediction, save, and load.


```python
from pyfedappwrap.learning.base_app import BaseApp

class MyAPP(BaseApp[MyAppConfig, MyAppInputConfig, MyAppOutputConfig]):

    def __init__(self):
        super().__init__()

    def run_train(self, data: MyAppInputConfig) -> MyAppOutputConfig:
        # training logic here
        pass

    def run_prediction(self, data: MyAppInputConfig) -> MyAppOutputConfig:
        # prediction logic here
        pass

    def _save(self) -> str:
        # persist your model to disk
        pass

    def _load(self, path: str):
        # restore model from disk
        pass
```
App Type Variants (What you implement)

Depending on what kind of app you build, you don’t always implement run_train + run_prediction yourself. 
Most specialized app types already handle that for you.

- If your app exports something → implement export(df)
- If your app transforms values → implement transform(...)
- If your app is a pipeline processing step → implement run_process(...)
- If your app evaluates → implement run_evaluate(...)
- If your app is a single algorithm run → implement run_algorithm(...)
- If your app produces data from nothing/external source → implement run_adopter()

### How `BaseApp` mapping works internally

When a task body is received, `BaseApp.map(...)` performs the following steps:

1. reads `hyperParams`
2. loads raw input values from `inputData` and/or `inputFilePaths`
3. resolves the expected input field types from your `AppInputConfig`
4. parses each input into the best matching Python type
5. validates the resulting dictionary
6. converts both config and input into typed Pydantic dataclass instances

In practice, this means your `run_train(...)`, `run_prediction(...)`, `run_process(...)`, or other app methods already receive strongly typed Python objects instead of raw strings or raw file references.


### Extractor / Adopter App (data source → output)
Use this if your app fetches/produces data (e.g., download dataset, query DB, call API) and returns it as output.

You implement:
- run_adopter() → do the actual extraction/adoption and return your output config


```python
class MyExtractorApp(BaseExtractorAdopterAPP[MyExtractorConfig, ExportInputConfig, MyExtractorOutput]):

    def run_adopter(self) -> MyExtractorOutput:
        # 1) fetch / generate data
        # 2) write it to a Path or build the output DTO
        # 3) return output DTO
        ...
```


### Exporter App (DataFrame → exported artifact)
Use this if your app takes an input DataFrame and exports it (CSV/TSV/JSON/HTML, files, reports, etc.).

You implement:
- export(df: pd.DataFrame) → return output config (usually with a produced file path)


```python
class MyExporterApp(BaseExporterAPP[MyExportConfig, MyExportOutput]):

    def export(self, df: pd.DataFrame) -> MyExportOutput:
        # 1) create file(s) from df
        # 2) return output DTO referencing produced artifacts
        ...
```

###  Transformer App (row/cell transform on a DataFrame)
Use this if your app transforms data values (feature engineering, normalization, mapping, enrichment, cleaning).

You implement:
- transform(...) → the function applied either
- per-row (mapped args), or
- per-cell (single value)
- You configure whether it runs row-wise or cell-wise via the transformer config.

You do not implement train/predict; the base calls your transform() accordingly.

```python
class MyTransformerApp(BaseTransformerAPP[MyTransformerConfig]):

    def transform(self, data: Union[dict[str, object], object]):
        # if row-wise: `data` is dict of mapped args
        # if cell-wise: `data` is the cell value
        # return either a value or a dict (depending on your return mapping)
        ...
```


### Pre-/Post-Processing App (generic “process” step)
Use this if your app is a pipeline step that prepares inputs or post-processes outputs (e.g., filtering rows, joining tables, formatting outputs).

You implement:
- run_process(data) → return output

```python
class MyPrePostApp(BasePrePostProcessApp[MyCfg, MyInput, MyOutput]):

    def run_process(self, data: MyInput) -> MyOutput:
        # do preprocessing or postprocessing
        ...

```

### Evaluation App (compute metrics / validation)
Use this if your app evaluates something (metrics, scores, validation reports).

You implement:
run_evaluate(data) → return evaluation output (metrics, files, report path, etc.)

```python
class MyEvaluationApp(BaseEvaluationApp[MyCfg, MyInput, MyOutput]):

    def run_evaluate(self, data: MyInput) -> MyOutput:
        # compute metrics / generate evaluation results
        ...
```


###  Self-Learned / Algorithm App 
Use this if your app runs an algorithm that doesn’t meaningfully separate training vs prediction (common for clustering, dimensionality reduction, rule-based methods).

You implement:
- run_algorithm(data) → return output

```python
class MyAlgoApp(BaseSelfLearnedApp[MyCfg, MyInput, MyOutput]):

    def run_algorithm(self, data: MyInput) -> MyOutput:
        # run algorithm (clustering, embedding, etc.)
        ...
```

### Supported input mapping patterns

The following patterns are especially important when designing your `AppInputConfig`:

| Python field type | Preferred runtime mapping |
|---|---|
| `Path` | local path object |
| `pd.DataFrame` | parsed DataFrame |
| `Any` | DataFrame if possible, otherwise `Path` |
| `dict[...]` | JSON object |
| `list[...]` | JSON array |
| `str` | text content |
| `bytes` | binary content |
| `int`, `float`, `bool` | scalar value |
| `Optional[T]` | same as `T` if value is present |

Use `Path` when your app should handle the file manually.  
Use `pd.DataFrame` when your app expects tabular data directly.  
Use `Any` only when you intentionally want flexible input behavior.


## 5) Create `main.py`

The entrypoint registers your app with the execution engine.

```python
from pyfedappwrap.engine.runtime import FedDBEngine

engine = FedDBEngine()
engine.register(MyAPP())

if __name__ == '__main__':
    engine.start()
    engine.wait_until_stop()
```

---

## 6) App Folder Structure

Your project should look like this:

```
my-app/
    app.yml
    training.py
    validation.py
    prediction.py
    requirements.txt
    Dockerfile
```

- **`app.yml`** - Defines hyperparams, input/output types, and metadata
- **`training.py`** - Training logic
- **`validation.py`** - Validation logic
- **`prediction.py`** - Inference logic
- **`requirements.txt`** - Python dependencies
- **`Dockerfile`** - Build instructions

Example `app.yml` snippet:

```yaml
config:
  hyperparams:
    - name: model
      type: CATEGORICAL
      options: [ bicon, scanet, spycone ]
      default: bicon
  input:
    - name: input_config_2
      type: CSV
      required: false
  output:
    - name: image
      type: STRING
      description: image base 64 encoded
info:
  name: Random Forest Classifier
  slug: random-forest-classifier
  type: ANALYSIS
  imageName: random_forest_v2.png
  shortDescription: Random Forest Classifier
  sourceUrl: https://github.com/FeatureCloud/fc-random-forest
```


## 7) Build & Publish Docker Image

Once you have your app code, `app.yml`, and `requirements.txt` ready, you can build a Docker image for your app and push it to the container registry.

To do this, use the pipeline available on your tool development page. Push your code to your repository and start the pipeline run there.

See the [page](building-pipeline.md) for more details.

### Example: Dockerfile for Python Apps

If you are writing your app in R, use the R base image instead:

```dockerfile
# Use the base Python wrapper image
FROM gitlab.cosy.bio:5050/cosybio/federated-learning/federated_db/pyfedappwrap/base-python:0.6.40

# Become Root for installing
USER 0
# Copy all project files into the container
COPY app-development .
# Install dependencies from requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY app-development .
# Security settings
RUN chown -R nonroot:nonroot /app /opt/venv \
 && chmod -R u+rwX,g+rwX /app

USER nonroot:nonroot
# Start the app
CMD ["python", "main.py"]
```

### Example: Dockerfile for R Apps

If you are writing your app in R, use the R base image instead:

```dockerfile
# Use the base R wrapper image
FROM gitlab.cosy.bio:5050/cosybio/federated-learning/federated_db/pyfedappwrap/base-r:latest

# SAME as python
```

### Test your image

You can test you image easily in test mode with a compose file.

```yml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      TEST_MODE: "true"
      PYTHONUNBUFFERED: "1"

```
## 8) Dynamic Diagrams
FL-Net apps can ship **dynamic, interactive diagrams** as part of their outputs via the `visualisations` field.
This is only accessible via the Frontend; other apps or workflows cannot access it.

### What you return

`visualisations` is a **Pydantic field without validation** (`Any`), so you can pass through raw chart configs.  
It must be a **list** of visualisation objects. Each entry has:

- `name`: Title shown in the UI
- `description`: Short explanation for users
- `visualisation`: **raw Apache ECharts option object** (the exact JSON you’d pass to `echarts.setOption()`)

### Minimal example (Python)

```python
return [
    {
        "name": "Clusters (2D embedding)",
        "description": "2D spectral embedding scatter plot (points colored by cluster label).",
        "visualisation": {
            "title": {"text": "Spectral Clustering (2D embedding)"},
            "tooltip": {"trigger": "item"},
            "legend": {"type": "scroll"},
            "grid": {"containLabel": True},
            "xAxis": {"type": "value", "name": "emb-1"},
            "yAxis": {"type": "value", "name": "emb-2"},
            "series": [
                {
                    "name": "Cluster 0",
                    "type": "scatter",
                    "symbolSize": 8,
                    "data": [[0.12, -1.03], [0.55, -0.88]],
                },
                {
                    "name": "Cluster 1",
                    "type": "scatter",
                    "symbolSize": 8,
                    "data": [[-0.42, 0.71], [-0.20, 0.66]],
                },
            ],
        },
    }
]
```

### Recommended conventions

- **Return one chart per list entry** (better UX than cramming many charts into one option).
- Keep `name` short and user-friendly.
- Use `description` to explain what the chart shows and how to interpret it.
- Prefer stable, serializable data types: `dict`, `list`, `str`, `int`, `float`, `bool` (no NumPy types; cast to Python primitives).

### Why both `app.yml` and Python types matter

`app.yml` describes the external interface of your app:

- what inputs exist
- whether they are required
- what storage or transport type they use

Your Python dataclasses define the internal runtime contract:

- whether a field should become a `Path`
- whether it should be loaded as a `pd.DataFrame`
- whether JSON should become a `dict`
- whether a value should remain flexible as `Any`

Both layers are evaluated together during input mapping.

### ECharts reference

The `visualisation` payload is the standard ECharts **option** format. For supported series types and configuration fields, use the official documentation:

- Apache ECharts option docs: https://echarts.apache.org/en/option.html

## 9) Test Locally

Run your app with sample data before deploying:

You can use our dummy data generator to test your tool with random data or you specify where your test data is.
For this you just need to override `get_test_data` where the key is the key in your input and the value can be the value
or a path if you wanna load it.
The data has to be in your data directory.

```python
@override
def get_test_data(self) -> Optional[dict[str, Path]]:
    return {"data": Path("iris_encoded.csv")}
```

Run main with env `TEST_MODE=true` or set it locally in your engine.
You can also create a new test.py with it.
```bash
from pyfedappwrap.engine.runtime import FedDBEngine

from app import SpectralClusteringAPP

engine = FedDBEngine(test_mode=True)
engine.register(SpectralClusteringAPP())

if __name__ == '__main__':
    engine.start()
    engine.wait_until_stop()
```

### Docker Compose (local test run)

You can also run your app in **test mode** via Docker Compose. This is useful if you want to:

- validate that your **Dockerfile builds** successfully,
- verify that **`TEST_MODE=true`** works end-to-end,
- run the container in an isolated environment without installing Python dependencies locally.

#### 1) Create a compose file

Create a file named **`docker-compose.yml`** in the **root of your app repo** (next to your `Dockerfile`).
Docker Compose automatically looks for this filename by default.

> Tip: If you want to use a different filename (e.g. `compose.dev.yml`), you can pass it via `-f` (see below).

```yml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      TEST_MODE: "true"
      PYTHONUNBUFFERED: "1"
```

What this does:

- **`build.context: .`** → builds the image from the current folder.
- **`dockerfile: Dockerfile`** → uses your local Dockerfile.
- **`TEST_MODE=true`** → starts the app in local test mode (uses your `get_test_data()` overrides / dummy data).
- **`PYTHONUNBUFFERED=1`** → ensures logs are flushed immediately (useful for debugging).

#### 2) Start the container

From the folder that contains `docker-compose.yml`, run:

```bash
docker compose up --build
```

- `--build` forces a rebuild of the image (recommended when you changed code or dependencies).
- The logs will stream in your terminal. Stop with **Ctrl+C**.

#### 3) Start in background (detached)

```bash
docker compose up -d --build
```

Then inspect logs with:

```bash
docker compose logs -f
```

#### 4) Stop and clean up

```bash
docker compose down
```

If you also want to remove built images (optional):

```bash
docker compose down --rmi local
```

#### 5) Using a custom compose filename

If your file is not named `docker-compose.yml`, for example `compose.dev.yml`, run:

```bash
docker compose -f compose.dev.yml up --build
```
