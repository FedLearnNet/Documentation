---
id: example-app
title: Create a New Tool - Example
sidebar_position: 1
---

Building a new tool for the platform involves two main parts (this page uses the AgglomerativeClustering tool as an example):

1. **Register the tool in the platform UI** (via the `/app` page form).
2. **Develop and package your code** (following the tool folder structure).

---

## 0) Create an Tool Entry in the Platform

Navigate to **`/app`** in the frontend and click **"New Tool"**.  
You will see a form like this:

- **Name** - AgglomerativeClustering
- **Image Name** - gitlab.cosy.bio:5050/cosybio/federated-learning/federated_db/apps/agglomerative-clustering/model:latest
- **Tool Type** - ANALYSIS
- **Slug** - agglomerativeclustering
- **Short Description** - A AgglomerativeClustering

<video width="100%" controls>
  <source src="/documentation/video/step1.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

---

## 1) Install Dependencies

You need Python libraries to run your tool.  
There are two common ways to manage dependencies:

- Ensure you have **Python 3.11+** installed.
- Always use a **virtual environment** to isolate dependencies.

Create a requirements.txt file in your app folder:

```txt
# Core framework (from TestPyPI)
--extra-index-url https://test.pypi.org/simple/
pyfedappwrap>=0.1.0

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

scikit-learn
matplotlib
```

Then install everything with:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

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

HTTP_URL=%%DEPLOYED_PRODUCT_URL%%/api/testembed/
WS_URL=%%DEPLOYED_PRODUCT_WS_URL%%/api/testembed/
```

<video width="100%" controls>
  <source src="/documentation/video/step2.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
---

## 3) App Folder Structure

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
    - name: linkage
      variableName: linkage
      mode: BOTH
      type: CATEGORICAL
      default: ward
      options: [ward, complete, average, single]
      description: >
        Linkage strategy for hierarchical merges. Note: 'ward' requires metric='euclidean'.

    - name: metric
      variableName: metric
      mode: BOTH
      type: CATEGORICAL
      default: euclidean
      options: [euclidean, manhattan, cosine]
      description: >
        Distance metric for clustering (ignored when linkage='ward', which always uses euclidean).

    - name: use_distance_threshold
      variableName: use_distance_threshold
      mode: BOTH
      type: BOOLEAN
      default: true
      description: >
        If true, build the full tree with distance_threshold=0 and n_clusters=None to enable a dendrogram.

    - name: n_clusters
      variableName: n_clusters
      mode: BOTH
      type: INTEGER
      default: 2
      minValue: 2
      maxValue: 200
      description: >
        Number of clusters to cut the tree into (used only if use_distance_threshold=false).

    - name: distance_threshold
      variableName: distance_threshold
      mode: BOTH
      type: FLOAT
      default: 0.0
      minValue: 0.0
      description: >
        Height at which to cut the dendrogram to form clusters (used only if use_distance_threshold=true).
        Set to 0.0 to compute the full tree like in the scikit-learn example.

    - name: compute_full_tree
      variableName: compute_full_tree
      mode: BOTH
      type: BOOLEAN
      default: true
      description: >
        Force computation of the full tree. Recommended when using distance thresholds / dendrograms.

    - name: compute_distances
      variableName: compute_distances
      mode: BOTH
      type: BOOLEAN
      default: true
      description: >
        Store distances between merged clusters (needed for plotting an accurate dendrogram in some settings).

    - name: standardize
      variableName: standardize
      mode: BOTH
      type: BOOLEAN
      default: true
      description: >
        Standardize features to zero mean / unit variance before clustering (recommended).

    # Dendrogram rendering options (scipy.dendrogram)
    - name: dendrogram_truncate_mode
      variableName: dendrogram_truncate_mode
      mode: BOTH
      type: CATEGORICAL
      default: none
      options: [none, lastp, level]
      description: >
        Truncation mode for the dendrogram plot. 'none' shows the full tree; 'lastp' keeps the last P leaves; 'level' shows the last P merging levels.

    - name: dendrogram_p
      variableName: dendrogram_p
      mode: BOTH
      type: INTEGER
      default: 30
      minValue: 1
      maxValue: 10000
      description: >
        Parameter P for truncate_mode 'lastp' or 'level' (ignored when truncate_mode='none').

    - name: plot_title
      variableName: plot_title
      mode: BOTH
      type: STRING
      default: "Agglomerative Clustering Dendrogram"
      pattern: "^.{0,120}$"
      description: Title text for the dendrogram.

  input:
    - name: features
      variableName: features
      mode: BOTH
      type: CSV
      required: true
      hasHeader: true
      delimiter: ","
      shape: "N x M"
      description: >
        Tabular feature matrix. Rows = samples, columns = numeric features.
        If you have an ID column, place it as the first column named 'id'; otherwise sample indices will be used.

  output:
    - name: labels
      variableName: labels
      mode: BOTH
      type: CSV
      hasHeader: true
      delimiter: ","
      description: >
        Cluster assignments per sample. Columns: [id?, label]. If no 'id' column was provided, 'index' is used.

    - name: linkage_matrix
      variableName: linkage_matrix
      mode: BOTH
      type: JSON
      description: >
        SciPy-compatible linkage matrix derived from AgglomerativeClustering (children_, distances_, counts_).

    - name: dendrogram_png
      variableName: dendrogram_png
      mode: BOTH
      type: STRING
      description: >
        Base64-encoded PNG image of the dendrogram plot.

    - name: report
      variableName: report
      mode: BOTH
      type: HTML
      description: >
        Lightweight HTML summary with params, cluster counts, and an embedded dendrogram image.

info:
  name: Agglomerative Clustering + Dendrogram
  slug: agglomerative-dendrogram
  shortDescription: Hierarchical (Agglomerative) clustering with a publication-ready dendrogram.
  longDescription: |
    This app runs scikit-learn's AgglomerativeClustering and renders a SciPy dendrogram.
    By default it computes the full tree (distance_threshold=0, n_clusters=None) to mirror the official example,
    then optionally cuts the tree by distance or to a fixed number of clusters. Outputs include cluster labels,
    a SciPy-compatible linkage matrix, a base64 PNG dendrogram, and a compact HTML report.
  imageName: agglomerative_dendrogram.png
  sourceUrl: https://scikit-learn.org/stable/auto_examples/cluster/plot_agglomerative_dendrogram.html
  type: ANALYSIS
```

---

### Understanding the Dendrogram

When `distance_threshold` is set to 0 and `n_clusters` is set to None, the clustering algorithm computes the full hierarchical tree. This means that all possible merges between clusters are performed until only one cluster remains. The dendrogram visualizes this hierarchy by showing:

- **Merges:** Each node represents a merge of two clusters.
- **Heights:** The vertical position of each merge corresponds to the distance between the clusters being merged.

This full tree provides a comprehensive view of the clustering structure, allowing you to explore cluster relationships at different levels of granularity.

---

### How to Read & Customize the Dendrogram Plot

- **Truncate Mode:** Controls how much of the dendrogram is shown. Options like `none` show the full tree, while `lastp` or `level` limit the view to the last P merges or levels.
- **Standardization:** Standardizing features to zero mean and unit variance before clustering is recommended to ensure that all features contribute equally.
- **Linkage and Metric Choice:** The linkage method (e.g., ward, complete) and distance metric (e.g., euclidean, manhattan) influence how clusters are formed.
- **Distance Threshold vs. Number of Clusters:** You can cut the dendrogram either by specifying a maximum distance (distance_threshold) or a fixed number of clusters (n_clusters), depending on your analysis needs.

---

### Example Walk‑through (Iris dataset, as in scikit‑learn)

1. **Load the dataset:** Import the Iris dataset and extract features.
2. **Fit AgglomerativeClustering:** Run the clustering with `distance_threshold=0` and `n_clusters=None` to build the full hierarchy.
3. **Plot the dendrogram:** Use the linkage matrix derived from the clustering to create the dendrogram plot.
4. **Cut the tree:** Optionally cut the dendrogram at a specified distance or number of clusters to obtain cluster labels.
5. **Visualize and interpret:** Examine the dendrogram to understand cluster relationships and decide on the number of clusters.

---

### Why This Matters for Your App

Providing a dendrogram visualization helps users intuitively understand the hierarchical clustering results, making complex relationships easier to interpret. Additionally, outputting the linkage matrix enables further analysis or custom visualizations downstream. These features enhance the usability and transparency of your app's clustering capabilities.

---

<video width="100%" controls>
  <source src="/documentation/video/step3.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

## 4) Implement Your App Logic

Use `pydantic.dataclasses` to describe your app config, inputs, and outputs.
See the [page](app-yml.md) for a full explanation of the schema and supported types.

```python

Each app must inherit from `BaseApp` and implement training, prediction, save, and load.

```python
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
from matplotlib import pyplot as plt
from pydantic.dataclasses import dataclass
from pyfedappwrap.learning.base_app import BaseApp
from pyfedappwrap.learning.run_runfig import AppConfig, AppInputConfig, AppOutputConfig
from scipy.cluster.hierarchy import dendrogram
from sklearn.cluster import AgglomerativeClustering


@dataclass
class AgglomerativeClusteringAppConfig(AppConfig):
    compute_full_tree: bool = 1
    linkage: str = "ward"
    compute_distances: bool = 1
    standardize: bool = 1
    metric: str = "euclidean"
    use_distance_threshold: bool = 1
    n_clusters: int = 2
    distance_threshold: float = 0.0
    dendrogram_truncate_mode: str = "none"
    dendrogram_p: int = 30
    plot_title: str = "Agglomerative Clustering Dendrogram"


@dataclass
class AgglomerativeClusteringAppInputConfig(AppInputConfig):
    features: Any = None


@dataclass
class AgglomerativeClusteringAppOutputConfig(AppOutputConfig):
    dendrogram_png: Path | None = None
    report: str = None
    labels: str = None
    linkage_matrix: dict = None


class AgglomerativeClusteringAPP(BaseApp[AgglomerativeClusteringAppConfig, AgglomerativeClusteringAppInputConfig, AgglomerativeClusteringAppOutputConfig]):


    def __init__(self):
        super().__init__()

    def run_train(self,
                  data: AgglomerativeClusteringAppInputConfig) -> AgglomerativeClusteringAppOutputConfig:
        return self.run_prediction(data)

    def run_prediction(self,
                       data: AgglomerativeClusteringAppInputConfig) -> AgglomerativeClusteringAppOutputConfig:
        model = AgglomerativeClustering(distance_threshold=self.config.distance_threshold, n_clusters=None)

        self.logger.info("Prediction")

        df: pd.DataFrame = data.features
        X = df.iloc[:, :4].values
        self.logger.info(f"Fitting model to {X.shape[0]} samples with {X.shape[1]} features")
        model = model.fit(X)
        self.logger.info("Model fitting complete")
        plt.title(self.config.plot_title)
        # plot the top three levels of the dendrogram
        self.plot_dendrogram(model, truncate_mode=self.config.dendrogram_truncate_mode,
                             p=self.config.dendrogram_p)
        plt.xlabel("Number of points in node (or index of point if no parenthesis).")
        plt.savefig("dendrogram.png")
        for i in range(10):
            self.send_metric("accuracy", i, i)
            self.send_metric("loss", i, i)

        return AgglomerativeClusteringAppOutputConfig(
            dendrogram_png=Path("dendrogram.png"),
            report=f"Agglomerative Clustering produced {self.config.n_clusters} clusters."
        )

    def plot_dendrogram(self, model, **kwargs):
        # Create linkage matrix and then plot the dendrogram

        # create the counts of samples under each node
        counts = np.zeros(model.children_.shape[0])
        n_samples = len(model.labels_)
        for i, merge in enumerate(model.children_):
            current_count = 0
            for child_idx in merge:
                if child_idx < n_samples:
                    current_count += 1  # leaf node
                else:
                    current_count += counts[child_idx - n_samples]
            counts[i] = current_count

        linkage_matrix = np.column_stack(
            [model.children_, model.distances_, counts]
        ).astype(float)

        # Plot the corresponding dendrogram
        dendrogram(linkage_matrix, **kwargs)


    def _save(self) -> str:
        pass

    def _load(self, path: str):
        pass
```

---

### `main.py`

The entrypoint registers your app with the execution engine.

```python
from pyfedappwrap.engine.runtime import FedDBEngine

from app import AgglomerativeClusteringAPP

engine = FedDBEngine()
engine.register(AgglomerativeClusteringAPP())

if __name__ == '__main__':
    engine.start()
    engine.wait_until_stop()
```

<video width="100%" controls>
  <source src="/documentation/video/step4.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>


<video width="100%" controls>
  <source src="/documentation/video/step4_2.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
---
