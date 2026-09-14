---
title: Simple graphical overview
sidebar_position: 4
---

# High level overview
The following figure provides a high-level overview of the FL-Net architecture, including the Platform and Client components, and their interactions.

![FL-Net Graphical Overview](/img/docs/Figure-1-v2-latest.png)

The Platform combines (1) a globally defined data standard with decentralized institutional Sites. Ontology-Nodes, DataType-Nodes, and Schemas form the basis for distributed data harmonization and the identification of suitable patient data. At the Platform, patient data availability is queried (2), projects are configured (3), and federated learning runs are orchestrated (4). The corresponding requests are transmitted to the participating FL-Net clients via secure communication channels. There, the clinical data is organized in cohorts and remains under Site control: cohorts are created and data is imported locally (I), patient data discovery queries are executed (II), requests are verified (III), results are validated, and workflow applications are launched in an isolated execution environment. On Site training and analysis results are logged and returned to the Platform exclusively as derived results, model parameters, or metrics. An aggregated model is then versioned and stored in the central artifact repository (5). Audit information accompanies the processing steps and enables traceability of data access, approvals, and executions. The stored Inference-Tool can be used by other users and executed on the Platform with user-provided data, providing an easy, no-code entry point (6).

For more details, see the [architecture documentation](architecture/welcome.md).
Check the [Getting Started](get-started.md) page for the right path for you through the documentation.
