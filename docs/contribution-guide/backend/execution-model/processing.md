---
title: Processing
sidebar_position: 4
---

import RunTypeAnimation from '@site/src/components/ExecutionAnimation/RunTypeAnimation';

`purpose=PROCESSING` · `mode=SINGLE` · `location=LOCAL`

1. **Local API:** `ConnectorAppRunSetupBO` creates the processing run; local Orch API launches the extractor/transformer container.
2. **Batches:** `AppTransformerSessionBO` sends rows over the attempt socket. `ConnectorAppRunProgressBO` matches each HTTP-uploaded table to its waiting batch.
3. **Lifetime:** `FINISH_RUN` ends a batch; `ConnectorAppRunBO.endSession` ends the attempt/container. One-shot extractors finish after uploading output.

Session/batch waiters live in Local API memory; execution state and messages live in its database. `PatientToolBO` uses the same processing lifecycle for cohort Tools.

<RunTypeAnimation type="processing" />
