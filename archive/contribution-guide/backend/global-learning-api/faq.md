---
id: faq
title: FAQ
sidebar_position: 7
---

# FAQ

## Do tools run in containers?
**In production: yes, always.**  
Containerized execution provides a homogeneous, verifiable runtime and enables security controls. In development, %%DEPLOYED_PRODUCT_NAME%% may support a non-containerized connect mode for faster iteration.

## Why does we use WebSockets?
%%DEPLOYED_PRODUCT_NAME%% uses a persistent, bidirectional WS channel to:
- stream **status/logs/metrics** in real time
- send **execution control signals** (start, cancel, terminate)
- support interactive development workflows (config updates, test runs)

## What is the difference between control plane and runtime?
- **Control plane:** %%DEPLOYED_PRODUCT_NAME%% API + DB + orchestration logic; enforces governance and stores provenance.
- **Runtime (data plane):** tool container; executes domain logic and emits telemetry/outputs.

## What exactly is a “run”?
A run is a concrete execution instance defined by:
- tool (and tool version)
- configuration + hyperparameters
- input references (files/data)
- runtime environment (container image/digest)
- timestamps + user/tenant context (deployment-dependent)

Runs are stored as provenance so they can be inspected and reproduced.

## How are inputs delivered to tools?
Inputs can be:
- staged in the container
- uploaded by Orch-API
- sent via WS (small payloads)
- fetched via controlled download references

All inputs are validated (platform + tool defense-in-depth).

## What outputs can a tool produce?
Outputs are declared artifacts such as:
- result files (CSV/JSON/TSV)
- reports/visualizations
- model artifacts (for trainable Analysis tools)

%%DEPLOYED_PRODUCT_NAME%% transfers outputs back to the platform and links them to the run provenance.

## What are the lifecycle states and why do they matter?
Typical states are:
**Pending → Initialized → Started → Running → Finished/Error**

They matter because:
- users get consistent, semantic progress signals
- telemetry is aligned with stable phases
- errors are traceable and reproducible (inputs/config preserved)

## How does cancellation/termination work?
Cancellation is sent as a control signal (WS). The platform initiates a controlled stop/cleanup via the orchestrator. Exact behavior (grace period, forced kill) depends on deployment policy.

## What is the difference between Analysis and Self-learned?
- **Analysis:** produces persistent, versioned model artifacts (trainable ML).
- **Self-learned:** computes results directly from inputs/params without persistent model formation (e.g., clustering).

## Why does %%DEPLOYED_PRODUCT_NAME%% type tools?
Tool types express scientific roles to improve:
- interpretability and reuse in pipelines
- transparency and reproducibility
- correctness (e.g., not treating clustering as a trainable model)

## Where is provenance stored?
Provenance is persisted by the platform, typically as:
- database records (configs, parameters, status timeline, errors)
- artifact references (output files, model artifacts)
