---
title: Tool Tests
sidebar_position: 5
---

import RunTypeAnimation from '@site/src/components/ExecutionAnimation/RunTypeAnimation';

`purpose=TEST` · `mode=SINGLE` or `FEDERATED`

An app engine is the Python process serving test requests, locally or in a [hosted container](hosted-engine.md).

1. **Global API:** `TestRunSetupBO` stores a TEST run with trial or participant attempts in the Global database.
2. **Connected engine:** `TestRunLauncher` dispatches over `/testembed/` using `TestEmbedConnections`. Here `APP_ID` is the Tool ID; each dispatched test receives its attempt ID and API key.
3. **Reports:** The engine runs single tests or simulates federated participants. `TestRunProgressBO` and the attempt lifecycle persist status, results, and round messages in Global; test attempts share the engine.

<RunTypeAnimation type="test" />
