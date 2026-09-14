---
id: Store
title: Tool-Store
---

# Tool-Store

The **Tool-Store** is the central registry for discovering, evaluating, and managing reusable computational assets in the %%DEPLOYED_PRODUCT_NAME%% network.  
It provides access to **global tools**, **user-private tools**, **trained models**, and **workflows**, enabling users to compose and execute data-driven analyses in a consistent and reproducible manner.

This page serves as a **reference overview** of the Tool-Store and its core concepts.

---

## Conceptual Overview

The Tool-Store aggregates different types of executable artifacts under a unified interface:

- **Tools**  
  Executable, containerized applications that perform a specific computation (e.g. data transformation, model training, inference).

- **Models**  
  Pre-trained tools. Conceptually, models are tools whose primary artifact is a trained model that can be reused without retraining.

- **Workflows**  
  Pipelines composed of multiple tools, defining a structured sequence of execution steps.

All tools available in the Tool-Store are either:
- **Global tools**, accessible to all users, or
- **Private tools**, visible only to the owning user.

---

## Browsing the Tool-Store

The Tool-Store presents all available entries as **cards** in a searchable and filterable list.

Each tool card displays:
- Name
- Short description
- Rating
- Tags
- Tool type (Tool, Model, or Workflow)
- Version information

### Search and Filtering

Users can efficiently explore the Tool-Store using:
- A **search field** to query by name, description, or tag
- **Filter panels** to refine results by:
    - Tool type (Tool, Model, Workflow)
    - Rating
    - Tags
    - Visibility (global or private)

Sorting options allow ordering by relevance, name, or rating.

{/* Screenshot placeholder: Tool-Store overview with search and filter panel */}

---

## Ratings and Tags

### Ratings

- Any user can rate a tool.
- Ratings are visible on tool cards and can be used as a filter criterion.
- Ratings provide a lightweight signal for tool quality and community adoption.

### Tags

- Tags are assigned based on tool metadata and export-related classifications.
- They provide contextual information such as:
    - Intended usage
    - Data compatibility
    - Execution characteristics

Tags can be combined with search and rating filters to narrow down relevant tools.

---

## Managing Tools

The Tool-Store allows users to:
- Browse all available tools and workflows
- Distinguish between global and private tools
- Compare tools based on metadata, ratings, and tags

Actions such as installing tools into projects or starting executions are accessible from the Tool-Store interface, but are documented in the respective project and experiment sections.

{/* Screenshot placeholder: Tool card with actions */}

---

## Scope and Limitations

This page focuses exclusively on the **Tool-Store** itself:
- It does **not** describe individual tool detail pages.
- It does **not** cover execution, monitoring, or configuration workflows in detail.

For related topics, see:
- `docs/frontend/experiments.md`
- `docs/frontend/connectors.md`

---

## Summary

The Tool-Store acts as the discovery and entry point for reusable computational assets in the %%DEPLOYED_PRODUCT_NAME%% network.  
By unifying tools, trained models, and workflows under a single interface with rich metadata, ratings, and filtering, it enables users to efficiently identify suitable building blocks for their analytical tasks.
