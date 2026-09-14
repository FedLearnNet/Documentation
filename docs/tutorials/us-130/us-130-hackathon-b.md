---
id: us-130-hackathon-b
title: "Hackathon B: App development"
sidebar_position: 4
---

# Phase B — Develop Your Federated Learning App

This is the core development phase of the hackathon. You will build an app that can be executed by the platform and later
used in a federated learning run.

The goal of this chapter is **not** to give you a complete solution that you copy and paste. Instead, it guides you
through the design decisions that every app developer has to make:

1. What data does the app need?
2. Which hyperparameters should the user be able to configure?
3. What should happen during training?
4. What should happen during prediction?
5. Which outputs should be written back to the platform?
6. How can the app be tested before it is packaged as a container?

You will work with the **US-130 diabetes hospital readmission dataset** and implement a readmission prediction app. A
simple baseline can use logistic regression, but you are free to improve the approach if your team has time.

:::tip
In Phase B, you are no longer only operating the platform. You are designing a reproducible scientific computation that
the platform can run.
:::

---

## B0. Deep Dive: The US-130 Diabetes Readmission Dataset

The US-130 dataset is a widely used clinical machine learning dataset derived from ten years of care data from 130 US
hospitals and integrated delivery networks. It contains inpatient encounters of patients diagnosed with diabetes. The
usual prediction task is to estimate whether a patient will be readmitted soon after discharge.

The original dataset is known as:

> **Diabetes 130-US hospitals for years 1999–2008**

Official dataset page:

- [UCI Machine Learning Repository: Diabetes 130-US Hospitals for Years 1999–2008](https://archive.ics.uci.edu/dataset/296/diabetes+130-us+hospitals+for+years+1999-2008)

Additional useful dataset documentation:

- [Fairlearn documentation: Diabetes 130-Hospitals Dataset](https://fairlearn.org/main/user_guide/datasets/diabetes_hospital_data.html)

### Download and Prepare the Dataset

The dataset is the **UCI Diabetes 130-US Hospitals** dataset: 101,766 diabetic inpatient encounters collected across 130
US hospitals and integrated delivery networks between 1999 and 2008. It is publicly available and free to use for
research.

**Download it manually from UCI:**

Go to [https://archive.uci.edu/dataset/296/diabetes+130-us+hospitals+for+years+1999-2008](https://archive.uci.edu/dataset/296/diabetes+130-us+hospitals+for+years+1999-2008) and click **Download**. You get a ZIP file (~3 MB). Extract it — the file you need is `diabetic_data.csv` inside the archive.

**Or let the script handle it:**

Download the prepared helper package:

<a href="/documentation/resources/hackaton-rom/data.zip">Download data.zip</a>

The ZIP contains a small Python script and a short README. The script downloads the original UCI dataset, stores the full
CSV as `data/diabetic_data.csv`, and creates one CSV file per simulated clinic in `data/clinics/`.

```bash
cd data/
python download_and_split.py
```

The generated structure looks like this:

```text
data/
├── diabetic_data.csv
└── clinics/
    ├── clinic_001.csv
    ├── clinic_002.csv
    ├── ...
    └── clinic_130.csv
```

The clinic split is deterministic and uses a round-robin assignment, so every simulated clinic receives a similar number
of rows. This is useful for a hackathon because every team gets data with roughly the same class balance. It does **not**
recover the original hospital identities and should not be interpreted as a realistic non-IID hospital split.

For the detailed script description, usage notes, and expected output, read the README included in the ZIP.


### Which CSV are you looking at?

Before checking column names, make sure you know which file you have open:

| File or table | Column naming style | Example diagnosis column |
|---|---|---|
| Raw UCI / clinic CSV | Original UCI names | `diag_1` |
| Connector/schema mapping | Clinical schema labels | `Diagnoses.Diag 1` |
| Dataset preview / app input export | Platform export names used by the reference app | `primary_diagnosis` |

So if you open `clinic_125.csv`, you should find `diag_1`, `diag_2`, and `diag_3`. If you open an exported dataset
preview from the platform, you may instead see renamed fields such as `primary_diagnosis`, `secondary_diagnosis`, and
`tertiary_diagnosis`. The example app uses the exported names.

The [official UCI dataset entry](https://archive.ics.uci.edu/dataset/296/diabetes+130-us+hospitals+for+years+1999-2008)
also lists `diag_1`, `diag_2`, `diag_3`, `A1Cresult`, and `readmitted` as variables.

### Raw clinic CSV columns

These are selected columns that are actually present in the raw clinic CSV files, including `clinic_125.csv`. This is not
the full 50-column header; it only lists the fields you need to recognize for the hackathon.

| Column | Description | Type |
|---|---|---|
| `encounter_id` | Unique encounter identifier | Integer |
| `patient_nbr` | Patient identifier | Integer |
| `race` | Patient race | Categorical |
| `gender` | Patient gender | Categorical |
| `age` | Age bracket e.g. `[60-70)` | Categorical |
| `time_in_hospital` | Length of stay (days) | Integer |
| `num_lab_procedures` | Lab tests during encounter | Integer |
| `num_medications` | Distinct medications administered | Integer |
| `number_diagnoses` | Number of diagnoses entered | Integer |
| `diag_1`, `diag_2`, `diag_3` | Primary/secondary/tertiary ICD-9 codes | String |
| `max_glu_serum` | Maximum glucose serum test result | Categorical: `None/>200/>300/Norm` |
| `A1Cresult` | HbA1c test result | Categorical: `None/>7/>8/Norm` |
| `insulin` | Insulin dosage change | Categorical: `No/Steady/Up/Down` |
| `metformin` | Metformin dosage change | Categorical: `No/Steady/Up/Down` |
| `readmitted` | Readmission outcome | Categorical: `<30 / >30 / NO` |

The raw **target** for this task is `readmitted == "<30"`: readmitted within 30 days. Across the full prepared split,
about 11.2% of encounters are positive, making this a class-imbalanced classification problem. That is why
`class_weight="balanced"` is the default in the example app: it upweights the minority class during training.

As a concrete check, `clinic_125.csv` contains 782 encounters and 50 columns. Its target distribution is 424 `NO`, 271
`>30`, and 87 `<30` encounters. Missing values are encoded as `?`; in that clinic, for example, `weight` is missing in
758 rows, `medical_specialty` in 382 rows, `payer_code` in 298 rows, and `race` in 22 rows.

### The target variable

The original readmission target typically has three values:

| Value | Meaning | Common binary mapping |
|---|---|---|
| `<30` | Patient was readmitted within 30 days | Positive class, `1` |
| `>30` | Patient was readmitted after more than 30 days | Negative class, `0` |
| `NO` | Patient was not readmitted | Negative class, `0` |

For this hackathon, the default task is usually:

> Predict whether a patient is readmitted within 30 days.

That means `<30` becomes the positive class. This is clinically meaningful because early readmission is often used as an
indicator for care quality, disease management, discharge planning, and risk of complications.

:::tip
Always define the prediction target explicitly. A model trained to predict “any readmission” is not the same as a model
trained to predict “readmission within 30 days.”
:::


### Important preprocessing issues

The US-130 dataset is not ready for modeling without preprocessing. You should think through at least these issues:

| Issue | What to consider |
|---|---|
| Missing values | The dataset may encode missing values as `?`, `None`, empty strings, or category-specific placeholders. |
| Identifiers | Do not train directly on `encounter_id` or `patient_nbr`. They are identifiers, not clinical features. |
| Repeated patients | Multiple encounters per patient can cause leakage if train/test splitting is done naively. |
| Categorical columns | Many columns need one-hot encoding or another categorical encoding. |
| Age brackets | Age is often stored as intervals such as `[60-70)`, not as numeric years. |
| Diagnosis codes | ICD codes may need grouping into broader disease categories. |
| Class imbalance | Early readmission is usually a minority class, so accuracy alone can be misleading. |
| Fairness | Race, gender, and age can influence performance differences across groups. |

For a first baseline, it is acceptable to keep preprocessing simple. For a stronger solution, consider grouping diagnosis
codes, handling repeated patients, reporting class-aware metrics, and checking performance across demographic groups.

### Recommended metrics

Do not rely only on accuracy. If the positive class is rare, a model can achieve acceptable-looking accuracy while missing
many readmitted patients.

Useful metrics:

| Metric | Why useful |
|---|---|
| ROC-AUC | Measures ranking quality across thresholds. |
| Precision | Of predicted readmissions, how many were correct? |
| Recall / sensitivity | Of true early readmissions, how many did we find? |
| F1-score | Balances precision and recall. |
| Confusion matrix | Makes false positives and false negatives visible. |
| Calibration | Important if probabilities are used for risk stratification. |

:::tip
The dataset is small enough to understand, but realistic enough to expose real clinical ML problems: missingness,
heterogeneity, leakage, class imbalance, and fairness.
:::

---

## B1. Register Your App in the Platform UI

Before implementing the app, register it in the platform so the platform knows that the app exists.

Log in to the global server frontend and open **Tool Development**. Create a new tool with a meaningful name, for example
`Hospital Readmission Prediction` or `Federated Hospital Readmission Prediction`.

:::tip
Look into the [Register & Configure an App — Walkthrough](../walkthroughs/wt-app-ui.md)
:::

---

## B2. Understand the App Development Contract

Before writing code, understand the contract between your app and the platform.

A platform app usually has four parts:

| File | Responsibility |
|---|---|
| `config.py` | Defines hyperparameters, inputs, and outputs as typed Python classes. |
| `app.py` | Contains the actual training and prediction logic. |
| `app.yml` | Declares the external app interface for the platform. |
| `main.py` | Starts the runtime engine and registers your app. |

You should now read the general app development documentation instead of copying a complete implementation from this
hackathon page:

- [Create an App](../../tool-dev/create-tool.md)
- [Create a federated App](../../tool-dev/create-federated-tool.md)
- [App YAML reference](../../tool-dev/app-yml.md)
- [Input mapping documentation](../../tool-dev/create-tool.md#how-input-type-mapping-works)
- [Testing apps locally](../../tool-dev/create-tool.md#9-test-locally)
- [Build pipeline guide](../../tool-dev/building-pipeline.md)

The most important idea is the split between configuration, input, and output:

| Concept | Meaning |
|---|---|
| App config | Values chosen by the user before a run, for example `max_iter` or `test_size`. |
| App input | Data provided to the app at runtime, for example the exported US-130 CSV file. |
| App output | Files, tables, reports, metrics, or models produced by the app. |

:::tip
The framework handles platform communication. Your job is to define the contract and implement the scientific logic.
:::

---

## B3. Set Up Your Project Skeleton

Create a new folder for your app. Your team should create the code files yourselves, but the structure will usually look
like this:

```text
my-readmission-app/
    app.py
    config.py
    main.py
    test.py
    app.yml
    requirements.txt
    Dockerfile
    .env
    data/
        test_data.csv
    model/
```

Recommended workflow:

1. Create the virtual environment.
2. Install the framework and your direct dependencies.
3. Create the empty files.
4. Start with `config.py` and `app.yml`.
5. Implement a minimal `run_train`.
6. Add metrics and outputs.
7. Add prediction only after training works.
8. Build the Docker image only after local tests pass.

:::tip
The prepared ZIPs include `example_app_central` and `example_app_federated`. Use them as reference implementations when
you are stuck, but try to build the first version yourself before opening the complete solution.
:::

---

## B4. Design the App Interface

Before writing the model code, decide what the app should expose to the platform.

### Hyperparameters

For a logistic regression baseline, useful hyperparameters include:

| Hyperparameter | Why it matters |
|---|---|
| `target_column` | Lets the app find the label column in the exported data. For the example app, use `hospital_readmission`. |
| `test_size` | Controls the validation split. |
| `random_state` | Makes the split and model behavior reproducible. |
| `standardize` | Enables or disables feature scaling. |
| `max_iter` | Controls solver iterations. |
| `C` | Controls inverse regularization strength. |
| `solver` | Selects the optimization algorithm. |
| `class_weight` | Helps with class imbalance when set to `balanced`. |

For a more advanced app, you may add:

- feature selection options,
- diagnosis-code grouping options,
- fairness-report toggles,
- probability-threshold configuration,
- model type selection.

### Inputs

The first version should usually have one input:

```text
data: CSV file containing the exported US-130 run data
```

The app should not connect directly to the local database. It receives exported run data from the platform.

### Outputs

Useful outputs include:

| Output | Suggested type | Purpose |
|---|---|---|
| `predictions` | CSV | Row-level predicted label and probability. |
| `coefficients` | CSV | Logistic regression coefficients or feature importance table. |
| `explanation` | HTML | Interactive report with metrics, confusion matrix, ROC curve, and feature importance. |
| `report` | TEXT | Human-readable summary. |



:::tip
The app interface is part of the scientific method. It defines what a run means, what can be configured, and what evidence
is produced.
:::

---


### What is important in the implementation?

#### 1. Keep preprocessing deterministic

The same input should produce the same feature matrix. This is especially important for prediction, because prediction
data must be aligned to the same feature columns used during training.

#### 2. Do not train on identifiers

Columns such as `encounter_id` and `patient_nbr` should usually be removed. They can create leakage or meaningless
memorization.

#### 3. Store feature-column order

If you one-hot encode categorical features, store the training feature columns. During prediction, reindex the prediction
matrix to the same columns and fill missing categories with zero.

#### 4. Use class-aware metrics

Early readmission is usually not balanced. Report ROC-AUC, precision, recall, F1-score, or a confusion matrix in addition
to accuracy.

#### 5. Log useful information

Use the framework logger for data shape, selected target, number of features, validation metrics, and saved artifacts.
Logs help participants and instructors debug failures quickly.

#### 6. Stream metrics

Use the framework's metric-sending mechanism to report values during the run. For iterative models, send one value per
step or epoch. For non-iterative models, send at least the final validation metrics.

:::tip
A good app is not just a model. It is a reproducible pipeline: validate, preprocess, train, evaluate, save, and report.
:::

---

## B5. Test Locally Before Building a Container

Before using Docker, test the app locally. 

Your test should answer these questions:

| Question | Why it matters |
|---|---|
| Does the app start? | Confirms the entrypoint and runtime engine are configured. |
| Does the app load test data? | Confirms the input mapping and test data path. |
| Does preprocessing work? | Catches missing columns and type issues. |
| Does training finish? | Confirms dependencies and model logic. |
| Are outputs written? | Confirms output contract and serialization. |
| Is the model saved? | Required for prediction mode. |
| Can prediction reload the model? | Confirms persistence works. |

Use a small sample first. Do not debug on the full dataset if the app cannot handle 200 rows.


:::tip
Local testing is where you should find most bugs. Docker and the platform should not be your first debugging environment.
:::

---

## B6. Build the Docker Image

After local tests pass, package the app as a Docker image.

Read:

- [Build and publish Docker images](../../tool-dev/create-tool.md#7-build--publish-docker-image)
- [Building Pipeline guide](../../tool-dev/building-pipeline.md)

---

# Appendix: Best Practices and Common Mistakes

## Best Practices

**Keep the three files separate.** Put config schemas in `config.py`, preprocessing in `helper.py` (or similar), and the app class in `app.py`. This makes each file easier to read and test independently.

**Use `self.logger`, not `print()`.** Log messages from `self.logger` appear in the platform's run log view. `print()` statements may or may not reach the platform depending on how the container is run.

**Always call `self._save()` at the end of `run_train`.** The platform may request prediction immediately after training in the same container lifecycle. If you don't save, `_load()` will fail.

**Guard `_load()` against double-loading.** Check `if self.model is not None: return` at the top of `_load()`. This prevents unnecessary disk reads when `run_prediction` is called multiple times.

**Use `MODEL_DIR` from the environment, not a hardcoded path.** The platform injects this variable to point to a writable directory inside the container. Hardcoded relative paths will break in Docker.

**Version your Docker images.** Increment the version in `app.yml` whenever you change the app interface (new hyperparameters, changed input/output names). The platform uses the version to track what app code was used for each run.

**Test locally before building Docker.** A full `docker build` + `docker compose up` cycle takes 2–5 minutes. Running `python test.py` takes seconds. Find bugs locally first.

## Common Mistakes

**Forgetting `PRIO_LOCAL_CONFIG=true` during development.** Without it, the platform's database version of your config overrides your local `app.yml`. You change the file, restart, and nothing changes — very confusing.

**Mismatching field names between `AppInputConfig` and `app.yml`.** If your `AppInputConfig` has `data: Any = None` but your `app.yml` names the input `input_data`, the framework cannot map the value. Names must match exactly (case-sensitive, spaces become underscores).

**Not handling the class imbalance.** With ~11% positive rate, a model that predicts "never readmitted" for everyone achieves 89% accuracy. Always check AUC-ROC alongside accuracy. Set `class_weight="balanced"` or use appropriate resampling.

**Hardcoding number of features.** If you fit on clinic A's data (some categories may be absent) and predict on clinic B's data (different categories), your feature matrix shape will differ. Always use `reindex(columns=self.feature_columns, fill_value=0)` after one-hot encoding.

**Not running at least 2 clinics.** With a single clinic, federated learning is just local training with extra steps. You need at least 2 connected clinics to observe the federated aggregation.
