---
id: workflow
title: Workflow guide
---

# Workflow guide

Most work in the %%DEPLOYED_PRODUCT_NAME%% network follows a repeatable sequence. Understanding that sequence makes the UI much easier to navigate.

## The basic workflow

1. **Identify the question**
2. **Find or prepare the right data**
3. **Choose a tool or workflow**
4. **Configure inputs and parameters**
5. **Run the analysis**
6. **Review outputs and iterate**

That may sound obvious, but the platform is deliberately structured around those stages.

## Stage 1: Identify the question

Start with a concrete objective, not with a tool.

Good examples:

- compare two cohorts
- train a classifier on a known feature set
- harmonize local data before sharing metadata

Weak starting point:

- "let's try some tools and see"

## Stage 2: Find or prepare data

Depending on your role, this can mean:

- discovering available datasets across the network
- uploading your own local input data
- validating connector output on a client deployment

At this stage, focus on fit and readiness rather than execution.

## Stage 3: Choose the right tool

Use the Tool-Store or a known workflow to confirm that:

- the tool matches the task
- the required inputs are available
- the outputs are actually the ones you need

Selecting the tool too early often leads to rework later.

## Stage 4: Configure carefully

Before execution, review:

- selected inputs
- feature columns
- hyperparameters
- expected runtime behavior

This is where most avoidable errors enter the process.

## Stage 5: Run and monitor

Execution is asynchronous. Once a run starts:

- the platform tracks status
- outputs appear when available
- logs help explain failures or unexpected results

For larger or federated analyses, start with a small validation run first.

## Stage 6: Review outputs

When a run finishes, inspect:

- generated files
- reports and plots
- logs or warnings
- whether the result is good enough to compare, publish, or rerun

The goal is not just to get an output, but to get an output you can explain.

## When to iterate

Rerun when:

- inputs were correct but parameters need tuning
- results need comparison against a baseline
- the first run was only meant to validate the pipeline

## Related pages

- [Running apps](running-apps.md)
- [Data analysis](data-analysis.md)
- [Troubleshooting](troubleshooting.md)
