---
title: Analysis
sidebar_position: 3
---

import RunTypeAnimation from '@site/src/components/ExecutionAnimation/RunTypeAnimation';

`purpose=ANALYSIS` · `mode=SINGLE` · `location=PLATFORM`

1. **Global API:** `DataAnalysisExecutionBO` checks input-file ownership and creates the run and steps in Global. Shared coordinators create attempts.
2. **Platform Tool:** `DataAnalysisRunResultBO` turns file references into download URLs. The launcher starts the Tool/model; the attempt socket sends `START_RUN` or `START_PREDICTION`.
3. **Results:** `DataAnalysisExecutionBO` stores uploaded fields on the attempt and files through `DataAnalysisFileBO`, then finishes it. `DataAnalysisRunResultMapper` exposes the selected results.

<RunTypeAnimation type="analysis" />
