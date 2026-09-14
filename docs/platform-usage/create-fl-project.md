---
title: Use found data for federated data analysis
sidebar_position: 2
---

# Use found data for federated data analysis

Once you have identified relevant datasets across the network, the next task is to turn that discovery into a concrete, governed analysis project.

## What a project should define

A good federated project is explicit about:

- the scientific question
- the participating sites or cohorts
- the tool or workflow to be used
- what outputs are expected
- what approvals or access settings are required

If those points are vague, execution usually becomes difficult later.

## Recommended project setup flow

### 1. Define the analysis goal

Write the question in operational terms, for example:

- estimate a distribution
- compare cohorts
- train a predictive model
- run a harmonization or quality-control workflow first

### 2. Match the goal to an available tool

Before creating the project in detail, confirm that a suitable tool or workflow exists and that it accepts the right inputs.

Check:

- input format
- expected features or schema
- parameter requirements
- whether the tool supports federated execution

### 3. Select the participating data sources

Use discovery results to decide:

- which sites are needed
- which cohorts are relevant
- whether all participants use a sufficiently aligned data standard

### 4. Confirm governance and access constraints

A project may still depend on:

- site-specific approval
- client-side access policies
- local user permissions
- technical readiness of the participating clients

Federated analysis is only as smooth as its least-ready participant.

### 5. Run a small first iteration

Start with the smallest useful run:

- fewer sites if possible
- narrower variable set
- conservative parameters
- validation-oriented outputs

This helps you verify the workflow before scaling up.

## What success looks like

A well-prepared project gives you:

- a clear execution scope
- reproducible parameters
- understandable outputs
- a path to rerun or compare later

## Common failure modes

Projects often stall because:

- the discovery question was too broad
- schema differences were underestimated
- the tool was chosen before input constraints were checked
- governance was treated as an afterthought

## Recommended follow-up reading

- [Find data across the network](find-data.md)
- [User workflow guide](user-guide/workflow.md)
- [Tool-Store](user-guide/tool-store.md)
