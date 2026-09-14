---
id: data-analysis
title: Data Analysis
description: Manage data, build DAG workflows, run tools asynchronously, analyze results (including LLM-assisted interpretation), and generate shareable PDF reports for reproducibility.
---

# The %%DEPLOYED_PRODUCT_NAME%% network Data Analysis

The %%DEPLOYED_PRODUCT_NAME%% network **Data Analysis** is an easy to use environment for running **reproducible, tool-based (federated)analyses** on structured and semi-structured data. It combines:

- **Data management** (upload, preview, organize inputs and outputs)
- A **workflow canvas** to build **DAG pipelines**
- A **Tool-Store** for algorithms, transformations, and trainable models
- **Asynchronous execution** with persisted results
- **LLM-assisted result analysis** (on-demand)
- **PDF reporting** for sharing and reproducibility
- **Strict user isolation** (each user sees only their own assets)

This documentation explains the platform end-to-end so you can use it without external guidance.

---

## Mental model: how it works

In the %%DEPLOYED_PRODUCT_NAME%% network, everything follows the same lifecycle:

1. **Upload or select data** (inputs)
2. **Build a workflow** (DAG of tool nodes)
3. **Configure** inputs, features, and hyperparameters
4. **Run** (asynchronous job execution)
5. **Inspect outputs** (files, plots, reports, artifacts)
6. **Optional: Analyze results with LLM**
7. **Export a PDF report** for sharing and reproducibility

---

## Core concepts

### User isolation (enterprise baseline)
The %%DEPLOYED_PRODUCT_NAME%% network enforces strict separation between users:
- You can access **only your own** files, workflows, runs, and reports.
- Sharing is done through **exported artifacts** (e.g., PDF report), not by exposing your workspace to others.

### Workflows (DAG pipelines)
A **workflow** is a graph-based pipeline (a **DAG**) composed of tool nodes.
- Nodes represent tools/models/transformations.
- Edges represent execution order and dependencies.
- Workflows are **saved** and **reusable**.
- The platform currently executes the **latest workflow version**.

Execution mode depends on deployment:
- **Local**: executed in a local environment
- **Global**: executed in a shared/global environment (e.g., centralized compute)

> Note: The UI presents workflows as a graph. Internally, the %%DEPLOYED_PRODUCT_NAME%% network resolves the DAG into a valid execution order.

### Tools and tool types
Tools come from the **Tool-Store** and can include:
- **Trainable models** (produce model artifacts)
- **Clustering tools** (produce reports and visualizations)
- **File transformation tools** (reshape, filter, convert data)
- Custom tools specific to your deployment

Each tool defines:
- required/optional **inputs**
- typed **outputs**
- typed **hyperparameters** (configuration)
- accepted file types (may be fixed or mixed, depending on tool implementation)

---

## UI layout and navigation

The %%DEPLOYED_PRODUCT_NAME%% network Data Analysis is typically split into three working areas:

1. **Left panel: Data Management**
    - Upload files
    - Browse inputs
    - Browse outputs created by runs

2. **Center: Workflow area**
    - Build and configure workflows (DAG)
    - Open Tool-Store and add tools/models
    - Start executions and access results

3. **Top-right toolbar**
    - Export a **PDF report** documenting the full analysis (inputs, parameters, outputs)

---

## Data Management

### Uploading files
In the **Data Management** section you can upload new files for analysis.

What you can upload depends on your deployment, but typically includes:
- CSV and other tabular formats
- PDFs
- Images (PNG/JPG)
- Tool-specific formats (custom)

> Mixed/advanced types are supported when a tool explicitly implements them.

### Opening file details
Click any file to open its **file detail view**. This is the main place to:
- validate that inputs look correct
- understand structure and columns
- preview outputs created by tools

### File previews by type
The %%DEPLOYED_PRODUCT_NAME%% network shows specialized previews depending on file type:

- **CSV**: Table preview + configurable diagrams
- **PDF**: PDF viewer
- **Images**: image viewer
- **Other formats**: preview depends on what the tool provides (may be download-only)

---

## CSV detail view (Table + Diagram)

When opening a CSV (e.g., `iris.csv`), you typically see:

### Table tab
- Column headers and rows in a spreadsheet-like preview
- Fast verification of schema and values (e.g., numeric features, label columns)

Common usage:
- Confirm required columns exist
- Check missing values / obvious data issues
- Identify which columns are features vs. labels/metadata

### Diagram tab
The Diagram view is **configurable** and designed for lightweight EDA.
Typical actions (depending on enabled diagram types):
- Select columns for x/y axes
- Choose aggregation/grouping
- Compare distributions or relationships

> Use Diagram to validate assumptions before running a workflow (e.g., scale, outliers, separability).

---

## Outputs: where results appear

Every tool run can produce **output artifacts**. These show up in:
- the **Output** section in the left panel
- the result view for the executed tool/workflow (depending on UI configuration)

Outputs can include:
- plots (e.g., `dendrogram.png`)
- text reports
- transformed datasets
- trained model artifacts
- additional intermediate artifacts (tool-dependent)

Opening outputs works exactly like opening inputs: click the file to open its detail view.

---

## Tool-Store: add capabilities to workflows

### What the Store contains
The Store is your catalog of runnable building blocks:
- tools (algorithms, transformations)
- trainable models
- prebuilt workflows (if provided by deployment)

### Adding a tool/model to the canvas
From the workflow area:
1. Open the Store
2. Select a tool/model
3. Add it to the workflow canvas
4. Connect nodes if required (DAG dependencies)

---

## Configure a tool node (inputs, features, hyperparameters)

When selecting a tool node (example: **AgglomerativeClustering**), you configure:

### 1) Inputs
- Choose one or more input files (e.g., a CSV dataset)

### 2) Features
- Select which columns should be used as model features
- Feature selection is typically provided as a dropdown or multi-select

Best practice:
- Exclude label columns (e.g., `VARIETY`) unless the tool explicitly expects them.
- Prefer numeric columns for most ML algorithms unless categorical support is explicitly stated.

### 3) Hyperparameters (typed)
The %%DEPLOYED_PRODUCT_NAME%% network tools expose hyperparameters in a typed form.
- Values are validated against the tool specification.
- Tools may show a compact summary (e.g., “10 Hyperparams”) with a dedicated editor.

Examples of typed inputs:
- number fields (int/float)
- enum selections
- booleans
- structured configs (tool-dependent)

> If a tool supports mixed/custom file types, it is responsible for correctly interpreting them.

---

## Running analyses (asynchronous execution)

The %%DEPLOYED_PRODUCT_NAME%% network runs tools and workflows **asynchronously**:
- You start an execution.
- The platform schedules and runs it in the configured environment.
- Outputs appear once the run completes.

This is essential for enterprise scenarios:
- long-running jobs do not block the UI
- results are persisted as artifacts
- reproducibility is supported through stored configurations and reports

If a run fails:
- the tool/run status reflects the failure (deployment dependent)
- the output may contain logs or error artifacts (tool dependent)

---

## Result review: reports and visualizations

After completion, review:
- **Text reports** (high-level outcome summaries)
- **Plots and figures** (e.g., dendrograms, metrics charts)
- **Generated datasets** (transformed data, predictions)
- **Model artifacts** (trained models, weights, configs)

Example: Agglomerative Clustering
- A run may produce:
    - a short report (e.g., number of clusters)
    - a dendrogram image

---

## LLM-assisted result analysis (on-demand)

You can use the %%DEPLOYED_PRODUCT_NAME%% network to analyze result artifacts with an LLM.

### How it works
LLM analysis is **manual**:
- You open a result file (e.g., `dendrogram.png`)
- You click **Analyze**
- The %%DEPLOYED_PRODUCT_NAME%% network generates a textual analysis

### What you get (standard structure)
The analysis is returned as **text** and typically includes:

1. **What the file shows**
    - objective description of the artifact (plot type, axes, structure)

2. **Interpretation in context**
    - ties results back to the selected tool, features, and goal

3. **Quality / plausibility assessment**
    - sanity checks and consistency notes
    - highlights if the result is plausible for the given setup

4. **Notable patterns / anomalies**
    - potential artifacts, limitations, suspicious patterns

### When to use it
- To speed up interpretation of visual outputs
- To produce a first-pass scientific explanation
- To document results consistently across teams

> The LLM is an assistant, not a replacement for domain validation. Use it for guidance and structured review.

---

## Chat interface (multi-agent assistant)

The %%DEPLOYED_PRODUCT_NAME%% network includes a chat assistant designed for end-to-end workflow support.

### Capabilities
The assistant can do **everything the user can do in the UI**, including:
- recommend suitable tools/models
- explain features and parameters
- guide workflow construction (DAG)
- help troubleshoot configurations
- provide result interpretation guidance

### Context access (within your workspace)
The assistant can reference:
- your uploaded files
- your workflows
- your runs and output artifacts
- your generated reports

Because of strict user isolation, it only operates on **your own** data and assets.

---

## PDF reporting (shareable reproducibility artifact)

The **PDF button** in the top-right toolbar creates a shareable report that documents your analysis.

### Purpose
- Share with colleagues
- Provide a reproducible record of what was run
- Support internal review, validation, and handover

### What the report includes
The PDF report typically captures:
- tools used (and their order if workflow-based)
- hyperparameter settings (typed values)
- selected input files
- generated output files
- run metadata (timestamps and other identifiers, deployment dependent)

Depending on configuration, it may also include:
- thumbnails/previews of figures
- summary text outputs
- references to result artifacts

> Treat the PDF report as the canonical “analysis snapshot” for collaboration.

---

## Recommended workflow (practical checklist)

1. **Upload inputs**
    - Verify in file detail view (CSV Table, PDF/image preview)

2. **Explore (optional)**
    - Use CSV Diagram tab for quick EDA

3. **Build workflow**
    - Add tools/models from the Store
    - Connect nodes into a DAG

4. **Configure**
    - Select inputs
    - Select features
    - Set hyperparameters

5. **Run**
    - Start execution (async)

6. **Review outputs**
    - Open result artifacts (reports, plots, datasets)

7. **Analyze results (optional)**
    - Click Analyze on key artifacts

8. **Export PDF**
    - Generate a report for sharing and reproducibility

---

## FAQ

### Which users can see my files and results?
Only you. %%DEPLOYED_PRODUCT_NAME%% enforces strict isolation: users see only their own assets.

### Does the platform run workflows synchronously?
No. Executions are asynchronous.

### Are tool parameters validated?
Yes. Hyperparameters are typed and validated per tool definition.

### Are LLM analyses generated automatically?
No. LLM analysis is created only when you click **Analyze** on a result artifact.

### Can apps handle custom/mixed file types?
Yes, if the tool supports them. Tools define how they interpret and validate such inputs, Files can be set as Path

### Can I run locally and globally?
Yes—depending on deployment configuration. The same workflow concept applies in both modes.

---

## Glossary

- **DAG**: Directed Acyclic Graph; a pipeline graph without cycles.
- **Tool-Store**: Catalog of tools/models/workflows available to add to the canvas.
- **Tool Node**: A runnable unit within a workflow (algorithm/model/transformation).
- **Hyperparameters**: Typed configuration values controlling tool execution behavior.
- **Run**: One asynchronous execution of a tool/workflow that produces outputs.
- **Artifact**: Any produced output file (plots, datasets, reports, model files).
- **LLM Analysis**: On-demand textual interpretation of a selected result artifact.
- **PDF Report**: Shareable reproducibility document capturing tools, parameters, inputs, and outputs.
