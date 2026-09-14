---
id: ui-guide
title: UI Guide - Patterns & Tips
---


# UI guide

The %%DEPLOYED_PRODUCT_NAME%% network is designed around the lifecycle of controlled analysis. The interface is easiest to understand when you read it as a sequence of decisions rather than as a generic dashboard.

## The main UI patterns

### 1. Discovery views

Discovery views help you answer: *What is available and relevant?*

Typical elements:

- cards for tools, models, or workflows
- searchable lists
- metadata summaries
- explicit entry actions such as opening details or starting configuration

### 2. Configuration views

Configuration views help you answer: *Am I about to run the right thing with the right inputs?*

Typical elements:

- step-by-step forms or wizards
- typed parameter fields
- file and feature selection
- validation feedback before execution

### 3. Execution and result views

Execution views help you answer: *What is happening right now, and what came out of it?*

Typical elements:

- run statuses
- streamed logs or progress indicators
- output previews
- artifact download or inspection actions

## How to read the interface

### Prefer explicit actions over assumptions

If the UI shows a button such as **Run**, **Analyze**, or **View details**, use that instead of assuming the surrounding card or row is fully interactive.

### Treat forms as contracts

Parameter panels and input selectors are not just convenience UI. They reflect the formal tool contract, which is why fields may be typed, restricted, or validated before execution.

### Read results together with logs

An output file alone may not tell the full story. For reproducibility, always read the produced artifact together with:

- the selected inputs
- the chosen parameters
- the run status and logs

## Accessibility and usability expectations

The interface should support:

- keyboard navigation
- readable contrast
- explicit labels for important actions
- clear empty states that point to the next useful step

If the UI feels ambiguous, it is usually worth checking whether you are still in a discovery step, a configuration step, or an execution step.
