---
id: tutorial-overview
title: Tutorials
sidebar_position: 0
---

# Tutorials

This section walks you through working with FL-Net from end to end — from setting up a local environment to training a federated model and running predictions. The tutorials are written for people who learn best by doing, not just reading.

---

## What is in here

### Hackathon: Hospital Readmission with US-130

A full hands-on tutorial built around the [UCI Diabetes 130-US Hospitals dataset](https://archive.uci.edu/dataset/296/diabetes+130-us+hospitals+for+years+1999-2008) — 100,000 patient encounters from 130 hospitals, split to simulate a real multi-clinic federated learning scenario.

The goal: predict 30-day hospital readmission without any hospital sharing raw patient data.

The tutorial is split into four phases:

| Phase | What you do | Time |
|---|---|---|
| **0 — Theory** | Federated learning concepts, FedAvg, platform architecture, terminology | 30 min |
| **A — Environment** | Start the global server, start a local clinic node (DinD), create a user account | 30–60 min |
| **B — App development** | Register your app, implement training and prediction, test locally, build Docker | 2–4 hours |
| **C — Platform usage** | Connect data, create a query and dataset, run federated training, review metrics, run prediction | 1–2 hours |

Phase B is the core focus. Read phase 0 first, then work through A and B. Phase C can run in parallel with B once you have data available.

→ [Start the hackathon tutorial](us-130/us-130-hackathon.md)

---

### Walkthroughs

Step-by-step UI walkthroughs with annotated screenshots for every major platform action. Each page covers a single workflow from start to finish so you can jump to exactly what you need without reading the full tutorial.

| Walkthrough | What it covers |
|---|---|
| [Register & Configure an App](walkthroughs/wt-app-ui.md) | Create a tool entry, get the App ID, define hyperparameters, inputs, and outputs via the UI |
| [Create a Connector](walkthroughs/wt-connector.md) | Create a cohort, set up the ETL connector wizard, map CSV columns to the schema, run import |
| [Create a Query](walkthroughs/wt-query.md) | Build a semantic cohort query in the Find Data workspace, understand privacy-filtered results |
| [Create a Dataset](walkthroughs/wt-dataset.md) | Configure the feature export inside a training project, set export mode, preview the table |
| [Create a Project](walkthroughs/wt-project.md) | Set up a training project, build the workflow canvas, connect the data input to the app |
| [Start a Federated Run](walkthroughs/wt-run.md) | Request training, wait for clinic approval, start the run, read status and participant info |
| [View Metrics & Build the Model](walkthroughs/wt-metrics.md) | Request local metrics, inspect per-clinic results, run the build pipeline, register the model |
| [Run a Prediction](walkthroughs/wt-prediction.md) | Upload data to the analysis workspace, select the trained model tool, review prediction outputs |

---

## Who these tutorials are for

The hackathon tutorial is written for students and Data Scientists who are new to federated learning and want a concrete, working example. It assumes basic Python and pandas knowledge and familiarity with Docker, but no prior experience with the platform.

The walkthroughs are useful regardless of experience level. They are written as quick references — if you already know *what* you want to do but are not sure *where* in the UI to do it, a walkthrough will get you there faster than reading the full tutorial.

---

## Before you start

Make sure you have:

- A running global server instance (or access to a shared one — ask your instructor)
- Docker and Docker Compose installed locally
- Python 3.11+
- Git

If you are running the full hackathon setup locally, follow the environment setup steps in [Phase A of the hackathon tutorial](us-130/us-130-hackathon-a.md) before anything else.
