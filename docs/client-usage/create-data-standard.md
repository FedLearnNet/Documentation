---
title: Create a data standard to inform the network about your data
sidebar_position: 3
---

# Create a data standard to inform the network about your data

Before data can be discovered or used consistently across the %%DEPLOYED_PRODUCT_NAME%% network, it needs a shared description. That is the role of the **data standard**.

## Why the data standard matters

The data standard is how your Client explains:

- which entities exist
- which fields are available
- how values should be interpreted
- which variables can be matched across sites

Without that layer, discovery becomes unreliable and federated analysis becomes difficult to reproduce.

## What a good data standard should capture

At minimum, define:

- the main entities you want others to reason about
- the important variables for discovery and analysis
- expected types and units
- naming conventions that remain stable over time

Think of it as the contract between your local data reality and the shared network vocabulary.

## Practical design advice

### Start from real use cases

Do not model everything at once. Start from the questions the network should actually be able to answer.

Examples:

- Can others discover whether your site has a cohort with a certain diagnosis?
- Can a federated workflow expect the same lab values or outcome fields across participants?

### Prefer stable semantics over local shortcuts

Local abbreviations may make sense internally, but they become confusing in a shared environment. Use names and definitions that remain understandable outside your institution.

### Capture units and value expectations

Differences in units, coded values, or timestamp conventions are a common source of downstream errors. Write them down early.

### Expect iteration

The first version of a standard is rarely the last one. Treat it as a maintained artifact rather than a one-time task.

## After the standard is defined

Once the data standard is in place, the next steps are usually:

1. configure connectors around that standard
2. import representative datasets
3. validate that discovery and mapping behave as expected

Continue with [Add data to your Client](add-data/index.md).
