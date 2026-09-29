---
title: Requests and governance
sidebar_label: Requests and governance
sidebar_position: 5
---

# Requests and governance

The Client's **Requests** and **Governance** menus bring together the tasks used to control access to local data and manage participation in federated analysis. This guide describes both areas in one place.

Access permissions define which users and groups may query data, participate in training, or request statistics. Incoming requests apply those rules to a specific proposed use of the data. Accepted trainings can then be reviewed and managed throughout execution and after completion.

## Review incoming requests

Use the **Requests** menu to review proposed uses of local data and decide whether to approve them:

| Menu item | Purpose |
|---|---|
| **Training Requests** | Review proposed federated learning workflows and determine which local records and variables may participate. |
| **Statistics Requests** | Review requests for statistical summaries of local data. |
| **Metrics Requests** | Review requests for locally calculated evaluation metrics from completed training runs. |

Request handling follows the configured access permissions and approval settings. Some requests may be approved automatically when the corresponding options are enabled. Federated discovery queries are evaluated against access permissions and disclosure controls without a manual request-review step.

## Manage access permissions

Open **Governance → Access Management** to manage which users and groups can query, train on, or request statistics for a cohort. Permissions also define disclosure controls, such as minimum record counts and query frequency limits.

For the available settings and automatic approval options, see the [detailed access-management reference](external-access-management.md).

## Manage accepted trainings

Open **Governance → Trainings** to review accepted federated learning trainings. Use this area to monitor ongoing trainings, review completed trainings, and manage their access settings and your site's participation using the available controls.

## Review logs and notifications

- **Governance → Logs** provides access to activity logs for reviewing operations and investigating issues.
- **Governance → Notifications** provides access to system notifications and updates requiring attention.
