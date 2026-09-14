---
id: us-130-hackathon
title: "Hackathon: Hospital Readmission with US-130"
sidebar_position: 0
---

# Hackathon Tutorial: Predicting Hospital Readmission with Federated Learning

Welcome to the FL-Net hackathon! In this tutorial you will build and run a **complete federated learning
pipeline** on the **UCI Diabetes 130-US Hospitals dataset** — a real-world clinical dataset collected from 130 US
hospitals covering diabetic patient encounters between 1999 and 2008.

**The challenge:** predict whether a diabetic patient will be **readmitted to hospital within 30 days** of discharge and
do it *without any hospital ever sharing raw patient records*. This is exactly the kind of problem federated learning
was designed for.

By the end of this tutorial you should understand not only how to use the platform, but also why federated learning is
structured this way, which design decisions matter, and how to build a usable app on top of the platform.

---

## Learning Goals

After completing this tutorial, you will be able to:

- Explain the fundamental idea of federated learning and how it differs from centralized training
- Understand the roles of **clients**, **aggregators**, and the **controller** in our federated system
- Set up and run a local FL-Net environment from scratch
- Register, implement, test, build, and deploy a federated learning **app** (tool)
- Interpret training metrics streamed from distributed clinic nodes
- Navigate the platform UI to create datasets, projects, and federated runs
- Apply best practices for structuring app code within our framework

---

## Hackathon Format

This hackathon is structured as a two-day, hands-on tutorial. Each block combines conceptual input with practical
implementation work, so you should expect to switch regularly between short lectures, guided walkthroughs, coding
sessions, and group discussion.

You do not need to be an expert in federated learning before the hackathon. The first sessions introduce the relevant
concepts step by step. The main goal is to understand how distributed, privacy-compliant data science can be implemented
in practice: from data harmonization, through tool development, to the execution of federated algorithms in a shared
network.

During the hackathon, you will work with an existing federated learning software stack, Federated Learning Net, and build on
top of it. Together, the group will create a federated network, harmonize data so it can be queried consistently across
sites, develop federated apps, execute them, and discuss the resulting models and metrics.

---

## Timeline Overview

| Day                       |        Time | Phase     | Topic                                                                                                        | Format                  | Priority            |
|---------------------------|------------:|-----------|--------------------------------------------------------------------------------------------------------------|-------------------------|---------------------|
| **Tuesday, 2026-05-05**   | 10:00–12:00 | **0**     | Introduction to federated learning, distributed data science, privacy, and clinical motivation               | Lecture + discussion    | Required background |
| **Tuesday, 2026-05-05**   | 13:00–15:00 | **A**     | FL-Net Platform setup, first walkthrough, introduction to tool development, and first simple tools | Lecture + guided setup  | Required            |
| **Tuesday, 2026-05-05**   | 15:30–17:30 | **B**     | Tool development for the US-130 readmission scenario                                                         | Hands-on development    | Core focus          |
| **Wednesday, 2026-05-06** | 10:00–12:00 | **C**     | Data harmonization, federated querying, FL project setup, and simulation workflow                            | Lecture + hands-on work | Required            |
| **Wednesday, 2026-05-06** | 13:00–15:00 | **B (2)** | Federated app development, simulation, debugging, and execution                                              | Hands-on development    | Core focus          |
| **Wednesday, 2026-05-06** | 15:30–17:30 | **D**     | Final execution, result discussion, lessons learned, wrap-up, and goodbye                                    | Group discussion        | Reflection          |

---

## Detailed Hackathon Plan

### Day 1 — Tuesday, 2026-05-05

The first day introduces the conceptual foundation and prepares the technical environment. By the end of the day, you
should understand the basic architecture of a federated system and have started developing your own federated tool.

#### 10:00–12:00 — Lecture: Federated Learning, Privacy, and Distributed Data Science

We begin with the motivation for federated learning in biomedical and clinical settings. The session explains why raw
patient-level data is often not allowed to leave institutional boundaries and how federated learning makes collaborative
data science possible without centralizing sensitive records.

Topics include:

- Centralized vs. federated data science
- Privacy-compliant collaboration across hospitals or institutions
- Clients, aggregators, controllers, and federated networks

#### 13:00–15:00 — Lecture and Setup: Platform, Tool Development, and First Tools

After the conceptual introduction, the group sets up the local environment and creates a first federated network using
FL-Net. You will learn how the platform represents apps, tools, clients, projects, and runs.

Topics include:

- Setting up the local FL-Net environment
- Starting the required services with Docker Compose
- Navigating the platform UI
- Understanding the lifecycle of a federated app
- Creating and running first minimal tools
- The US-130 hospital readmission prediction scenario
- Understanding how `pyfedappwrap` structures app inputs, outputs, and hyperparameters

#### 15:30–17:30 — Hands-on: Tool Development

The final block of the first day is dedicated to implementation. You will start building the app logic used later for
the US-130 hospital readmission task.

Activities include:

- Creating the app scaffold
- Implementing basic input and output definitions
- Adding preprocessing logic for tabular clinical data
- Running the app locally
- Inspecting logs, outputs, and errors
- Preparing the app for federated execution

---

### Day 2 — Wednesday, 2026-05-06

The second day focuses on making the federated network usable for real federated data science. Participants harmonize
data, develop federated algorithms as apps, execute them in the network created on Day 1, and discuss the resulting
metrics.

#### 10:00–12:00 — Lecture and Hands-on: Harmonization, Querying, and FL Projects

The day starts with the data layer. Federated learning only works reliably if participating sites describe and expose
their data in a compatible way. This session introduces the basics of data harmonization and shows how harmonized data
can be queried and used inside FL projects.

Topics include:

- Data harmonization and shared schemas
- Mapping local clinical data to a common representation
- Querying harmonized distributed data
- Creating a federated learning project
- Connecting harmonized data to app execution
- Simulating federated execution with multiple clients

#### 13:00–15:00 — Hands-on: Federated Tool Development and Simulation

Participants continue developing their federated apps and test them in simulated federated settings. The focus is on
making the app robust enough to run across multiple clients.

Activities include:

- Implementing training logic for the readmission prediction task
- Handling local training data at each client
- Returning model updates or metrics to the aggregation workflow
- Running simulations
- Debugging common app, data, and configuration issues
- Comparing local and federated execution behavior

#### 15:30–17:30 — Final Execution, Results, and Discussion

The final block brings the individual parts together. The federated algorithms are executed, the results are reviewed,
and the group discusses what worked, what failed, and what would be required for production use.

Activities include:

- Running the final federated workflow
- Inspecting training metrics and outputs
- Discussing model behavior and possible limitations
- Reflecting on privacy, harmonization, and reproducibility
- Collecting lessons learned
- Wrap-up and goodbye

---

## Suggested Hackathon Mindset

This tutorial is intentionally practical. Some parts may fail on the first attempt: containers may need to be restarted,
app definitions may need to be adjusted, and data mappings may require debugging. That is part of the exercise. The goal
is not only to run a successful workflow, but to understand the moving parts of a federated learning system well enough
to diagnose and improve it.

Recommended approach:

- Ask questions early, especially when platform concepts are unclear
- Work incrementally and test each change before moving on
- Keep an eye on logs; most errors are easier to understand there than in the UI alone
- Treat harmonization as part of the machine-learning workflow, not as a separate preprocessing detail
- Discuss results critically instead of only checking whether the run completed

---

## Prerequisites

- Python 3.11+ installed
- Docker and Docker Compose installed
- Basic Python and pandas knowledge
- A code editor (VS Code, PyCharm, etc.)
- Git installed

---

## Download Material

Before the hackathon starts, download the prepared material. These ZIP files are meant to save setup time and give you a
known working baseline if your own implementation gets stuck.

### Project setup ZIP

Download these first. They contain the server startup files, Docker Compose configuration, and environment templates used
by the tutorial.

<a href="/documentation/resources/hackaton-rom/global_deplyoment.zip">Download global_deplyoment.zip</a>

<a href="/documentation/resources/hackaton-rom/local_deployment.zip">Download local_deployment.zip</a>

:::note
The global folder is currently named `global_deplyoment` in the prepared material. The spelling is wrong, but the ZIP and
folder name are intentional for this hackathon package.
:::

### Dataset helper ZIP

Use this ZIP if you need to download the original UCI file and split it into simulated clinic CSV files.

<a href="/documentation/resources/hackaton-rom/data.zip">Download data.zip</a>

### Example central app ZIPs

The central examples run the US-130 readmission task on one local dataset. They are useful as a first step because they
show the app structure without federated communication or aggregation. The version without a suffix is the **linear
baseline**.

<a href="/documentation/resources/hackaton-rom/example_app_central.zip">Download example_app_central.zip — central linear baseline</a>

<a href="/documentation/resources/hackaton-rom/example_app_central_rf.zip">Download example_app_central_rf.zip — central random forest example</a>

<a href="/documentation/resources/hackaton-rom/example_app_central_svm.zip">Download example_app_central_svm.zip — central SVM example</a>

<a href="/documentation/resources/hackaton-rom/example_app_central_dl.zip">Download example_app_central_dl.zip — central deep learning example</a>


### Example federated app ZIPs

The federated examples use the same US-130 prediction task, but split the work across simulated clinic clients. Use them
after you understand the central app structure. They demonstrate client-side training, communication with the federated
runtime, and aggregation behavior. The version without a suffix is the **linear federated baseline**.

<a href="/documentation/resources/hackaton-rom/example_app_federated.zip">Download example_app_federated.zip — federated linear baseline</a>

<a href="/documentation/resources/hackaton-rom/example_app_federated_rf.zip">Download example_app_federated_rf.zip — federated random forest example</a>

<a href="/documentation/resources/hackaton-rom/example_app_federated_svm.zip">Download example_app_federated_svm.zip — federated SVM example</a>

<a href="/documentation/resources/hackaton-rom/example_app_federated_dl.zip">Download example_app_federated_dl.zip — federated deep learning example</a>
