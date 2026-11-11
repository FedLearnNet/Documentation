---
title: Central Training
sidebar_position: 1
---

import RunTypeAnimation from '@site/src/components/ExecutionAnimation/RunTypeAnimation';

`purpose=TRAINING` · `mode=SINGLE` · `location=PLATFORM`

1. **Global API:** `PlatformTrainingBO` creates the experiment/run in the Global database and starts execution.
2. **Platform containers:** `PlatformTrainingSetupBO` stages project files; shared coordinators launch each step through Orch API. Downstream steps read the selected attempt's output.
3. **Results:** Tool callbacks update attempt state in Global. `PlatformTrainingProgressBO` keeps output files; `PlatformTrainingBO` saves the uploaded model. Completion events advance the run.

<RunTypeAnimation type="central" />
