---
title: Multi-Agent Analysis System - Developer Guide
description: TODO
---

## Purpose

This guide explains how the multi-agent analysis system is structured, how requests flow through the system, why the
architecture was designed this way, and how contributors should extend it safely.

    The system is built to answer workflow-centric analytical questions in a grounded, stateful, and auditable way. It separates routing, planning, retrieval, analysis, human clarification, and answer generation into distinct components so that each stage can be constrained independently.

---

## Design Goals

The architecture is designed around a few explicit goals:

    1. **Ground answers in evidence**

User-facing answers should be based on uploaded files, workflow state, retrieved tools, or literature, not on
unconstrained model improvisation.

2. **Separate responsibilities**
   Classification, planning, data analysis, tool discovery, next-step selection, and answer synthesis are handled by
   different agents with narrow responsibilities.

3. **Preserve a reusable execution state**
   Intermediate outputs are written into a shared `PlanState` so they can be reused by downstream agents instead of
   being re-derived repeatedly.

4. **Make uncertainty explicit**
   If required information is missing, the system should stop and ask a precise question rather than hallucinate.

5. **Keep the final answer clean**
   The final answer generator should not plan or call tools. It should synthesize only validated state.

6. **Support safe extensibility**
   New agents, tools, and retrieval strategies should be pluggable without collapsing the boundaries between planning
   and execution.

---

## High-Level Architecture

At a high level, the request pipeline looks like this:

1. `ModelWorkflowAgent` receives the request.
2. Previous workflow chat history is summarized into a compact working context.
3. Any pending human-in-the-loop request is resumed if applicable.
    4. `PlanningAgent` enters a bounded planning loop.
5. In each iteration, `DecisionPlannerBot` selects exactly one next atomic action.
6. Specialized components execute that action and write results into `PlanState`.
7. If needed, the system pauses through a HITL step.
8. Once enough evidence has been collected, `FinalizeBot` produces the final user-facing answer.

   This is a **stateful orchestrated multi-agent architecture**, not a free-form agent swarm. That distinction matters:
   the system is intentionally designed so that reasoning is constrained by explicit state transitions.

---

## Entry Point: `ModelWorkflowAgent`

    `ModelWorkflowAgent` is the runtime entry point for a user request.

### Responsibilities

- Accept the current workflow id, message DTO, raw user request, and user id.
- Detect whether the request is answering an outstanding HITL question.
- Build a compact conversation context from prior workflow chat history.
- Start the planning process.
- Stream progress updates and tool traces back to the UI via `Multi<ModelWorkflowChatMessageDTO>`.
- Persist the final message or keep the request open if HITL is required.

### Why it exists

This class centralizes request lifecycle handling so downstream agents can stay focused on domain tasks. It also cleanly
separates:

- transport and streaming concerns,
- chat history summarization,
- HITL resume logic,
- orchestration startup.

### Request flow

When `answer(...)` is called:

    1. It checks for a pending `HumanInTheLoopRequestDTO`.

2. If one exists, the current user message is treated as the answer to that pending question.
3. Otherwise, the system summarizes the prior workflow chat into a compact context string using
   `RequestClassifierBot.summarize(...)`.
4. It emits a status update to the client.
5. It calls `planningAgent.planAnswer(...)`.
6. It streams the final result or marks the request as waiting for user input.

---

## Request Classification and Context Summarization

The `RequestClassifierBot` has two distinct roles.

### 1. Strict request classification

It can classify a user request into one of a small set of route categories:

    - `FILES`
    - `TOOLS`
    - `HELP`
    - `TOOLS_RECOMMEND`
    - `TOOL_DIRECT_SELECT`
    - `TOOL_DATA_FIT`
    - `UNKNOWN`

This classification logic is intentionally narrow and token-constrained. It is useful when the system needs a stable
coarse-grained interpretation of the user’s intent.

### 2. Conversation summarization

It also summarizes prior workflow discussion into a compact context string for downstream planning.

### Why summarization is done here

The planning loop should not consume raw unbounded chat history. Summarization compresses:

- prior decisions,
- tools already used,
- important outputs,
- blockers and unanswered questions.

  This provides continuity while keeping token usage bounded and reducing noise.

### Security note

This summarization entry point is guarded via `PromptInjectionInputGuardrail`. That is important because conversation
history is one of the main attack surfaces for instruction-overriding and prompt-injection attacks. The system therefore
treats history compaction as a guarded preprocessing step, not as a naïve concatenation.

---

## The Shared State: `PlanState`

    `PlanState` is the central working memory of the planning pipeline.

### Typical contents

- `userGoal`
- `previousContext`
- `dataAnalysisReport`
- `dataAnalysisSummary`
- `tools`
- `papers`
- `dataProfiles`
- `fileAnalyzeMap`
- `humanInTheLoop`
- `nextStepDecision`
- `nextStoreItem`
- `feedback`

### Why `PlanState` exists

Without a shared explicit state object, each agent would need to infer the entire prior process from conversation text.
That is fragile and expensive. `PlanState` makes the pipeline:

    - more deterministic,
    - easier to debug,
    - easier to persist,
    - easier to inspect,
    - easier to extend.

    It also enforces a strong architectural rule: **agents should communicate through validated state, not through hidden assumptions**.

---

## Core Orchestrator: `PlanningAgent`

    `PlanningAgent` is the main coordinator of the multi-agent reasoning loop.

### Responsibilities

- Initialize or resume a `PlanState`.
- Reset chat memory for the current planning session.
- Execute a bounded planning loop with at most `MAX_STEPS`.
- Ask `DecisionPlannerBot` for exactly one next action per iteration.
- Dispatch execution to the appropriate subsystem.
- Stream reasoning snapshots back to the UI.
- Return either a final answer or a HITL-required result.

### Why the planner is step-bounded

The planner is explicitly limited to a maximum number of steps. This is done to prevent:

- unbounded agent wandering,
- repetitive loops,
- excessive token consumption,
- delayed user feedback.

  The system therefore prefers **small atomic decisions with explicit termination pressure**.

### Available planning actions

The planner can choose one of these actions:

    - `SUMMARIZE_PREVIOUS_WORK`
    - `PLAN_NEXT_STEP`
    - `ANALYZE_DATA`
    - `RESEARCH_PAPERS`
    - `EXTERNAL_AGENT` (reserved for future use)

- `HUMAN_IN_THE_LOOP`
- `FETCH_TOOLS`
- `FETCH_DATA`
- `FINALIZE`

Each action represents a distinct state transition, not an abstract thought.

---

## Decision Policy: `DecisionPlannerBot`

    `DecisionPlannerBot` is the policy model that decides the next atomic action.

### What it does

It receives:

- the current `PlanState`,
- the history of already executed planning actions,
- the number of remaining steps.

  It returns a `PlanStep` JSON object with:

- `action`
- `reason`
- `subTaskQuestion`

### Why this agent is narrow

This bot does not execute tools. It only decides what should happen next. That separation is intentional:

    - planning should stay cheap and structured,
    - execution should remain observable and auditable,
    - specialized tools should not be callable from an unconstrained planner.

### Important planning rules

The prompt already encodes critical behavior:

    - exactly one action per step,
    - no repeated actions from history,
    - do not finalize before evidence is sufficient,
    - prefer file-grounded reasoning when the user refers to uploaded data,
    - prefer data retrieval and analysis before generic recommendation,
    - force `FINALIZE` when only one step remains.

    This is a strong example of **policy encoded in prompt design rather than buried in procedural logic**.

---

## Data Analysis Components

There are two distinct analysis-related roles in the system.

### `DataAnalysisBot`

This bot summarizes reproducibility or workflow reports into a compact structured format.

    It extracts:
    - an overall summary,

- per-run highlights,
    - anomalies,
    - exactly one best next step.

### Why it exists

Raw analysis reports can be long, repetitive, and tool-specific. This bot converts them into a stable intermediate
representation that is easier for later planning and finalization to consume.

### `ResultAnalyzer`

This agent analyzes concrete outputs such as:

- images generated by tools,
    - uploaded images,
- CSV/TSV/JSON/TEXT files,
- text-like tool outputs together with file profiles.

### Why it is separate

Summarizing a workflow report and interpreting a concrete result artifact are different tasks. Keeping them separate
improves prompt clarity and reduces cross-task confusion.

### Guiding principle

The result-analysis prompts are intentionally strict:

- reason only from the provided artifact,
- do not speculate,
- state limitations clearly,
- keep conclusions tied to visible evidence.

  This is one of the core anti-hallucination measures in the architecture.

---

## Tool Retrieval and Tool Selection

The system distinguishes between two related but different capabilities.

### `StoreBot`: informational tool retrieval

    `StoreBot` answers factual questions about available tools, apps, or models. It is retrieval-augmented and typically used to:
    - list tools,
    - inspect tool details,
    - answer capability questions.

    It is not responsible for deciding the next workflow action.

### `PlanNextStepBot`: executable next-step selection

    `PlanNextStepBot` is the decision component that selects the single best next `StoreDTO` candidate for the workflow.

    It can:
    - discover candidates through retrieval,
    - validate a candidate by id,
    - inspect capability docs,
    - check required inputs,
    - retrieve hyperparameters,
    - ask one precise follow-up question if blocked.

    ### Why these are separate

This separation exists because **describing tools** and **committing to a workflow next step** are not the same thing.

    A user might ask:
    - “What tools are available for clustering?” → informational retrieval

- “Which one should I use next for this workflow?” → next-step decision

Mixing both responsibilities into one agent would encourage premature commitment and make the system less predictable.

---

## Human-in-the-Loop (HITL)

The architecture treats HITL as a first-class control path, not as an error case.

### When HITL is used

HITL is triggered when:

- required inputs are missing,
- the next workflow action depends on a user decision,
- the system cannot safely infer an underdetermined parameter.

### Why it matters

Many agent systems fail by guessing when they should pause. This system deliberately chooses the opposite policy:

- do not speculate,
- ask one precise question,
- stop until the answer is available.

  This improves correctness, traceability, and user trust.

### How it works

- The planner or next-step selector decides a clarification is required.
- `HumanInTheLoopRequestBO` persists the question and current state.
- The workflow enters a waiting status.
- On the next user message, `ModelWorkflowAgent` detects the pending HITL request and resumes the flow with the answer
  attached to state.

---

## Final Answer Generation: `FinalizeBot`

    `FinalizeBot` is responsible for the final user-facing response.

### Inputs

It receives:

- the original user question,
- the consolidated `PlanState`.

### Constraints

It must not:

- continue planning,

- execute tools,
    - expose internal prompts,
    - reveal internal reasoning traces,
    - ask unnecessary follow-up questions.

### Why it is isolated

Finalization is intentionally separated from planning to reduce hallucination risk. A generator that can still plan or
call tools during answer synthesis can easily drift away from validated evidence. By restricting `FinalizeBot` to
synthesis only, the architecture improves robustness.

### Output style

The final answer:

- is Markdown,
- can include UI action links for apps, models, and files,
- should remain concise and grounded,
- should reflect uncertainty explicitly if evidence is incomplete.

---

## Memory and Context Handling

The planner resets chat memory through `resetMemory(...)` and rehydrates it with compact prior context where needed.

### Why this matters

This architecture does not rely on a large unconstrained conversational memory. Instead, it prefers:

- compact relevant summaries,
- explicit state,
- bounded local context.

  This reduces prompt drift and makes stepwise decisions more stable.

---

## Streaming and UI Observability

The system emits intermediate status and tool trace events using `MultiEmitter<? super ModelWorkflowChatMessageDTO>`.

### What gets streamed

Examples include:

- status updates,
- reasoning snapshots,
- tool calls,
- tool results,
- final chunks from `FinalizeBot`.

### Why this was designed in

Streaming is not just a UI feature. It is also an observability mechanism. It allows developers and users to see:

- what stage the system is in,
- which tool was invoked,
- when the flow is blocked,
- where a failure occurred.

  That is particularly valuable in multi-agent systems, where silent internal transitions are otherwise hard to debug.

---

## Why the Architecture Is Split This Way

The system’s decomposition is not accidental. Each split addresses a common failure mode in LLM systems.

### Router vs planner

The router handles coarse intent discrimination and context compression. The planner handles fine-grained step
selection. This prevents one model from mixing classification with execution policy.

### Planner vs executor

The planner decides; specialized components execute. This makes actions auditable and reduces prompt overload.

### Tool retrieval vs next-step choice

Knowing what exists is not the same as deciding what to do. Splitting those roles reduces premature or weakly grounded
recommendations.

### Analysis vs finalization

Artifact interpretation is different from user communication. By separating them, the final response becomes more stable
and less likely to overclaim.

### HITL vs guesswork

The system explicitly prefers interruption over speculation when requirements are underdetermined.

---

## Typical End-to-End Flow

A common file-grounded request may look like this:

1. User uploads data and asks which workflow or tool family to use.
2. Context summarization compresses prior chat.
3. `DecisionPlannerBot` selects `FETCH_DATA`.
4. File profiles are written into `PlanState`.
5. Planner selects `ANALYZE_DATA`.
6. `ResultAnalyzerTools` analyzes the file and stores findings.
7. Planner selects `FETCH_TOOLS`.
8. Available tools are retrieved into state.
9. Planner selects `PLAN_NEXT_STEP`.
10. `PlanNextStepBot` validates the best candidate and maybe fills hyperparameters.
11. Planner selects `FINALIZE`.
12. `FinalizeBot` writes the answer using the validated state.

    If a required input is missing, the system may insert a HITL pause between steps 9 and 11.

---

## Contribution Guide

## General contribution principles

When contributing, preserve these architectural guarantees:

    - keep responsibilities narrow,
    - prefer explicit state over implicit memory,
    - do not let the finalizer plan,
    - do not let the planner become a free-form executor,
    - do not bypass HITL when required information is missing,
    - do not trade grounding for convenience.

                                     If a proposed change makes the system “feel smarter” by collapsing stages, that is often a warning sign rather than an improvement.

---

## Where to add new functionality

### Add a new planning action when:

    - a genuinely new class of state transition is needed,
    - the action cannot be expressed safely by an existing one,
    - the output needs distinct downstream handling.

    If you add a new action:

1. extend the planner enum/model,
2. update the `DecisionPlannerBot` prompt,
    3. add dispatch logic in `PlanningAgent`,
    4. decide what should be persisted in `PlanState`,
    5. define termination and fallback behavior.

### Add a new specialized agent when:

    - the task has a distinct evidence source,
    - the task benefits from a dedicated prompt,
    - conflating it with an existing agent would reduce reliability.

    Examples:

- ontology alignment analyzer,
    - result quality checker,
    - benchmark comparator,
- tool-compatibility verifier.

### Add a new `PlanState` field when:

    - the information is needed by more than one downstream stage,
    - recomputing it would be expensive or unstable,
    - it represents validated intermediate evidence.

    Avoid adding transient or decorative fields that do not influence later decisions.

---

## Prompt contribution guidelines

Most architectural behavior here is encoded in prompts. That makes prompt changes high impact.

### Good prompt changes

Good changes:

- tighten role boundaries,
- reduce ambiguity,
- improve output schema stability,
- add missing negative constraints,
- clarify when to stop,
- clarify what evidence is allowed.

### Bad prompt changes

Avoid changes that:

- blur execution and planning,
- encourage generic advice where file-grounded reasoning is required,
- add verbose reasoning requirements without structural need,
- weaken schema constraints,
- remove explicit anti-speculation language.

### Prompt testing checklist

When changing prompts, test at least these cases:

    1. **File-grounded recommendation**

User asks which tool fits an uploaded dataset.
Expected: retrieve/analyze file before recommending.

2. **Generic tool lookup**
   User asks what tools are available.
   Expected: informational retrieval, not workflow commitment.

3. **Underdetermined workflow step**
   A required input is missing.
   Expected: precise HITL question, not a guess.

4. **Already sufficient state**
   State already contains the needed evidence.
   Expected: skip unnecessary retrieval and finalize early.

5. **Conflicting or noisy history**
   Prior chat contains irrelevant content.
   Expected: summarizer keeps only relevant facts.

6. **Output schema compliance**
   JSON-only agents should return valid JSON and nothing else.

---

## Code contribution guidelines

### Keep orchestration explicit

Do not hide important control flow in prompts alone when the code should enforce it. Prompts define policy, but critical
lifecycle transitions should still be visible in Java orchestration.

### Preserve streaming transparency

Whenever a new stage or tool is added, consider what the user and developer should see during execution. Emit useful
intermediate states.

### Be strict about nullability and fallback behavior

This system frequently works with partially available evidence. Every new step should define:

- what happens if required data is missing,
- whether the flow should continue,

- whether HITL is required,
    - what should be written to state on failure.

### Prefer deterministic intermediate formats

Where possible, make agent outputs structured and constrained. Free-form prose should be the exception for internal
agent coordination.

---

## Failure Handling Philosophy

The system should fail in a way that is:

- visible,
- localizable,
- recoverable where possible.

### Preferred failure behavior

- record the error,
    - surface it in the streamed UI state,
    - preserve already validated state,
    - avoid silently fabricating a continuation.

### Why this matters

In a multi-agent pipeline, silent degradation is worse than a visible interruption. Users and developers need to know
when the chain is incomplete.

---

## Security and Safety Considerations

### Prompt injection

History summarization is guarded because prior conversation can contain adversarial instructions. Similar care should be
applied to any future component that consumes uncontrolled user or file content as prompt context.

### Hallucination control

Hallucination risk is reduced by:

- explicit state,
- role separation,

- file-grounded analysis,
    - strict “do not speculate” prompts,
    - HITL stops for missing information,
    - finalization from validated evidence only.

### Why safety is architectural, not cosmetic

Safety is not a wrapper added after generation. In this system, it is part of the control flow:

- guarded summarization,
- restricted planner,
- explicit HITL,
- isolated finalizer.

  That is the right design direction for analytical systems in biomedical and workflow-sensitive environments.

---

## Recommended Developer Workflow

A practical way to contribute is:

    1. Understand which stage your change belongs to.

2. Identify which evidence source it consumes.
3. Decide whether it should write to `PlanState`.
4. Update prompts and orchestration together.
5. Add streaming visibility for the new stage.
6. Test both normal and underdetermined cases.
7. Verify that the final response remains grounded and does not expose internal logic.

---

## Example Contribution Scenarios

### Scenario 1: Add a literature-quality scoring agent

Use this when retrieved papers need structured ranking before finalization.

    You would likely:
    - add a new specialized agent,
    - write scored results into `PlanState`,
    - let the planner choose it only when literature exists and ranking is needed,
    - keep `FinalizeBot` unchanged except for consuming the scored evidence.

### Scenario 2: Add a dataset schema compatibility checker

Use this when tool selection depends on precise input-schema matching.

    You would likely:
    - add a new planning action or extend analysis tooling,
    - read file profiles and tool input specs,
    - write compatibility findings into `PlanState`,
    - let `PlanNextStepBot` consume that compatibility evidence.

### Scenario 3: Add a new store retrieval mode

Use this when lexical search is insufficient.

    You would likely:
    - extend retrieval tooling,
    - preserve validation through `getStoreById(...)`,
    - avoid skipping the explicit candidate-validation step.

---

## Anti-Patterns to Avoid

Do not introduce these patterns:

    - A finalizer that starts choosing tools.

- A planner that directly executes retrieval without state updates.
- A tool selector that invents ids or skips validation.
- A summarizer that rewrites facts not present in history.
- An analyzer that infers biology from a file without evidence in the file.
- A missing-input case that proceeds without HITL.
- A broad prompt that merges routing, planning, tool lookup, analysis, and answer writing into one agent.

  These shortcuts make demos look fast, but they reduce reliability sharply.

---

## Summary

This system is a **bounded, stateful, retrieval-supported multi-agent orchestration architecture** for workflow-aware
analytical assistance.

    Its core strengths are:

    - explicit separation of concerns,

- evidence-grounded reasoning,
    - reusable persistent intermediate state,
- retrieval-validated next-step selection,
    - deliberate HITL pauses for underdetermined cases,
    - isolated final answer synthesis.

  Contributors should preserve these properties. Most of the system’s reliability comes not from any single model call,
  but from the fact that the architecture makes it hard for any one stage to overreach.
