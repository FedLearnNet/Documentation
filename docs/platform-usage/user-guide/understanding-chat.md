---
id: understanding-chat
title: Understanding LLM integration
---

## LLM integration in the %%DEPLOYED_PRODUCT_NAME%% network

The %%DEPLOYED_PRODUCT_NAME%% network integrates large language models (LLMs) not as freely operating systems, but as a controlled,
scientifically embedded assistance layer within a reproducible analysis platform. The key
difference to classic chatbots or generative agent systems is that the LLM does not independently
tools or process data on its own, but rather supports the user in navigating, planning, and interpreting complex
analysis processes.

For the user, this means that the interaction feels like a dialogue-based scientific assistant, but
in the background, the actual analysis remains completely structured, traceable, and reproducible. The LLM
translates natural language into well-defined steps, which are then checked, executed, and
documented by the platform.

Many current LLM systems generate workflows or tool calls directly from prompts. While this increases flexibility,
it often leads to problems such as hallucinations, unclear decisions, or analysis chains that are difficult to trace.
In scientific or clinical contexts, this is problematic because results must remain reproducible, verifiable, and
auditable.

The %%DEPLOYED_PRODUCT_NAME%% network therefore takes a different approach:

- The LLM makes planning decisions, but not execution decisions.
- Every action is checked against formal rules.
- Tools have fixed contracts (input, output, semantics).
- The platform decides whether an action is permitted.

The user continues to benefit from natural interaction without losing scientific control.

## Background

What happens in the background when a user submits a request?

When a user asks a question or wants to start an analysis, the request goes through several logically separate
steps.

### 1. Interpretation of user intent

The LLM first analyzes the goal of the request. It tries to understand:
- What does the user want to achieve?
- Are there any existing analysis results?
- Is a tool required or just an interpretation?


### 2. Planning instead of direct execution


Instead of executing something directly, the LLM generates the next atomic step, for example:
- load existing data,
- summarize the workflow to date,
- select a suitable tool,
- analyze a file,
- or ask a question.

This step is stored and validated as a structured decision.
Only then does the system decide whether the action is technically and semantically permissible.


## What does this mean in practice?

The interaction remains deliberately simple:

The user describes goals in natural language, for example:
- “Analyze my file for diabetes-related patterns.”
- “Which tool should I use next?”
- “Summarize my workflow.”

The platform takes care of:
- Selecting suitable tools
- Validating the analysis chain.

The user does not need to know any pipeline syntax.

## Tool-Auswahl und Empfehlungen

Wenn mehrere Optionen existieren, schlägt das System passende Tools vor.
Der Nutzer kann dann:
• ein Tool bestätigen,
• Details anzeigen,
• oder den Vorschlag ablehnen.

Wichtig: Das LLM entscheidet nicht endgültig - der Nutzer behält immer Kontrolle.


## Human-in-the-Loop (HITL)

If information is missing or a decision is critical, the system automatically pauses and asks for clarification.

Typical cases:
- Unclear data source
- Missing input parameters
- Multiple valid analysis paths

The user answers the question in the UI, after which planning continues.

## Summary


The LLM integration in the %%DEPLOYED_PRODUCT_NAME%% network combines natural interaction with scientific rigor. For the user, this results in
intuitive, dialogue-based operation, while a strictly controlled pipeline works in the background.

In short:
- The user talks to an intelligent assistant.
- The LLM plans.
- The platform checks and decides.
- Results remain reproducible and traceable.

The %%DEPLOYED_PRODUCT_NAME%% network thus combines the user-friendliness of modern AI interfaces with the requirements of scientific and
clinical analysis systems.
