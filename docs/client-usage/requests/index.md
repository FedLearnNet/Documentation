---
title: Requests
sidebar_label: Requests
sidebar_position: 1
---

# Requests

A **request** is a proposed use of your Client's local data by a user of the %%DEPLOYED_PRODUCT_NAME%% network. Statistics, training, and metrics requests give access to the local clinical data stored in your Client, so they must be approved before they are executed. Reviewing them is the responsibility of the Client's Data Access Managers.

Requests are approved manually unless a matching permission defined in [Access Management](../governance/access-management.md) approves them automatically.

## The Requests menu

The **Requests** menu of the Client contains one menu item for each request type:

| Menu item | Purpose |
|---|---|
| [**Training Requests**](training-requests.md) | Review proposed federated learning workflows and determine which local records and variables may participate. |
| [**Statistics Requests**](statistics-requests.md) | Review requests for statistical summaries of local data. |
| [**Metrics Requests**](metrics-requests.md) | Review requests for locally calculated evaluation metrics from completed training runs. |

Each menu item opens a list of the requests of that type received by your Client. Select a request in the list to open its details and review it. Then decide:

- Select **Accept** to approve the request and allow it to run on your Client's data.
- Select **Reject** to decline the request and deny the requester access to your Client's data.

## Discovery queries

Users of the network can also send federated discovery queries to your Client, for example to find out how many patients match certain criteria. Discovery queries are not requests: they do not appear in the **Requests** menu and do not require manual review. The Client answers them automatically, based on the permissions defined in [Access Management](../governance/access-management.md).

Discovery queries never disclose exact patient counts. The following safeguards apply to every response:

- **Rounded counts:** The Client returns a rounded number instead of the actual count.
- **Minimum record count:** The Client returns a count only if the number of matching records reaches the configured minimum. Queries matching fewer records are rejected.
- **Query frequency limit:** You can set the minimum time that must pass between queries. Queries that arrive more frequently are rejected automatically.

Queries from users who are not permitted to query a cohort are also rejected automatically. See [Permission settings](../governance/access-management.md#permission-settings) for details.

## Related reading

- [Governance](../governance/index.md)
- [Cohorts](../cohorts.md)
