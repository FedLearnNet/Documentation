---
title: Hosted Engine
sidebar_position: 6
---

import RunTypeAnimation from '@site/src/components/ExecutionAnimation/RunTypeAnimation';

`purpose=TEST_HOSTING` · `mode=SINGLE` · `location=PLATFORM`

1. **Global API:** `TestEngineRunBO` stores a TEST_HOSTING run. `ExecutionAttemptLauncher` starts its Platform container; `TestEngineBO` configures and monitors it.
2. **Engine:** Connecting modes use `/testembed/` with the Tool ID. `TestRunLauncher` sends separate TEST runs; their `test_engine_id` points to the hosting run.
3. **Lifetime:** `ENGINE` serves tests until stopped; `SINGLE_RUN` ends after its test; `SELF_TEST` runs without `/testembed/` and uses its exit code. `TestEngineRunBO` records the outcome; the launcher removes the container and revokes its key.

<RunTypeAnimation type="hosting" />
