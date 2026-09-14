---
title: Find data across the network
sidebar_position: 1
---

# Find data across the network

In the %%DEPLOYED_PRODUCT_NAME%% network, discovery is designed to help you identify relevant datasets without assuming that raw data is centrally pooled or immediately accessible.

## What discovery usually means

When you search the network, you are typically exploring:

- which sites have relevant data
- how that data is structured
- which cohorts or variables appear to be available
- what level of access or participation may be possible

This is a metadata-driven process first, not an unrestricted data export flow.

## Typical discovery workflow

### 1. Start from the scientific question

Before searching, define:

- what population you need
- which variables matter
- whether you need one site or several
- whether the analysis is descriptive, predictive, or federated

Discovery works much better when the question is specific.

### 2. Search and filter available metadata

Use the platform to narrow down datasets by:

- domain or disease area
- available variables
- cohort characteristics
- site participation

At this stage, you are trying to answer: *Which sites are likely relevant?*

### 3. Review quality and fit

Once you find candidate datasets, review:

- whether the schema matches your expected inputs
- whether enough sites appear relevant
- whether the data standard aligns with your planned tool or workflow

### 4. Decide what kind of project you need

After discovery, the next step is usually one of these:

- create a centralized analysis project on data you are allowed to upload or access
- create a federated analysis project spanning multiple sites
- contact the relevant data holders for further governance or approval steps

## Important expectation: discovery is not permission

Seeing that data exists does not automatically mean you can run anything against it.

A discovered dataset may still require:

- project-level approval
- client-side access configuration
- specific tool support
- additional coordination with participating sites

This is a feature of the system, not a limitation. It keeps discovery useful without eroding local control.

## Good practice when evaluating candidate data

Ask these questions early:

- Is the question answerable with metadata-guided discovery alone?
- Do I need local variables to be harmonized first?
- Is the analysis tool compatible with the expected input structure?
- Will this be a centralized or federated workflow?

## Next step

Once you have identified relevant datasets, continue with [Use found data for federated data analysis](create-fl-project.md).
