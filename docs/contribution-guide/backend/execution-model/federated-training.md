---
title: Federated Training
sidebar_position: 2
---

import RunTypeAnimation from '@site/src/components/ExecutionAnimation/RunTypeAnimation';

`purpose=TRAINING` · `mode=FEDERATED` — Platform and Clients

1. **Global API:** `FederatedTrainingBO` stores the experiment and participants. It copies the workflow before requesting clinic approval; approved Clients create their own local runs.
2. **Each Client:** `FederatedLearningRunBO` prepares approved patient data and launches its Tool through local Orch API. Readiness/status reports travel to Global over the FLNet WebSocket.
3. **Training:** Global creates tracking attempts and supplies relay configuration; `FederatedTrainingAggregatorBO` launches a Platform aggregator when selected. Local's `FederatedLearningProgressBO` starts the Controller and Tool. Model updates pass through Controllers and Relay; patient data stays local.
4. **Completion:** Clients persist local attempt state; Global updates participant/tracking state from their reports. Global advances after all clinics and the aggregator finish.

<RunTypeAnimation type="federation" />

[Message sequence and identifiers](../federated-learning-flow.md).
