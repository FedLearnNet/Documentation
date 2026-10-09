---
title: Requests and governance
sidebar_label: Requests and governance
sidebar_position: 5
---

# Requests and governance

Joining the %%DEPLOYED_PRODUCT_NAME%% network does not mean that every participant can run arbitrary analyses against your Client. Defining **what is allowed**, **for whom**, and **under which privacy controls** is a core feature of the Client and the responsibility of its Data Access Managers.

The Client's **Requests** and **Governance** menus bring together the tasks used to control access to local data and manage participation in federated analysis:

- **Requests** are proposed uses of local data (statistics, federated learning, or metrics) that are reviewed and approved or rejected.
- **Access permissions** define, per cohort, which users may query data or submit requests, which disclosure controls apply, and which requests are approved automatically.
- **Accepted trainings** can be reviewed and managed throughout execution and after completion.

Some of these controls are also set when the Client is deployed. See [Deployment settings](#deployment-settings).

## Review incoming requests

Use the **Requests** menu to review proposed uses of local data and decide whether to approve them:

| Menu item | Purpose |
|---|---|
| **Training Requests** | Review proposed federated learning workflows and determine which local records and variables may participate. |
| **Statistics Requests** | Review requests for statistical summaries of local data. |
| **Metrics Requests** | Review requests for locally calculated evaluation metrics from completed training runs. |

Statistics, training, and metrics requests may release non-anonymous personal data from your Client, so they require approval. They are approved manually unless a matching [access permission](#manage-access-permissions) approves them automatically.

Federated discovery queries are not requests. They are evaluated automatically against the cohort's access permissions and disclosure controls, without a manual review step. Depending on those settings, a query can also be rejected automatically.

### Training requests

A training request asks to run a federated learning job on your Client. When approving it, you choose which patients and variables are included. The request specifies:

- The tools and workflow used, including their versions and the chosen hyperparameters.
- The requested output artifacts (model and metrics), and whether they are limited to the participating sites and the requesting user or made public.

### Statistics requests

A statistics request asks for the distribution of specific variables. The cohort's rounding and thresholding settings, defined in its access permissions, are applied to the result automatically.

### Metrics requests

A metrics request asks for the local metrics of a completed federated learning run, calculated on your Client's own data. It can be submitted by:

- Any user, if the run's resulting Inference Tool is public.
- Only the user who created the run, otherwise.

## Manage access permissions

Data in your Client is organized into [cohorts](cohorts.md). Open **Governance → Access Management**, or the **Access management** tab of a cohort, to add permissions that define access rules and disclosure controls for that cohort.

Each permission defines the following settings:

| Setting | What it controls |
|---|---|
| **Who** | The user the permission applies to. Leave empty to apply it to *any* user. |
| **Query: Enable queries** | Whether the user may run federated queries on this cohort. Queries have no approval step; once enabled, they are safeguarded only by the query frequency limit and minimum record count below. |
| **Query: Query frequency limit** | The minimum time that must pass between queries. Queries arriving too fast are rejected. |
| **Query: Minimum record count** | The minimum number of records a query must return. Queries below this threshold return `0` instead of the real count. This also applies to statistics requests, so a category with only 50 records under a threshold of 100 returns `0`, not 50. |
| **Statistics: Statistics access** | When disabled, federated statistics requests are rejected automatically. Enabling it does **not** approve statistics requests automatically. |
| **Statistics: Minimum record count** | The minimum record count each entry in a statistics response must include. Entries below this threshold return `0` instead of the real count. For example, in a categorical variable with 10 categories, a category with only 30 records under a threshold of 100 returns `0`, not 30. Numerical values are binned, and the threshold applies to each bin. For free text, each unique term is treated as a separate category. |
| **Statistics: Minimum category count** | The minimum number of categories that must still have non-zero counts after disclosure control. If fewer categories remain, the variable is removed from the response entirely. For example, if only 3 of 10 categories have more than 100 records and the threshold is 5, the variable is removed. For free text, each unique term is treated as a separate category. |
| **Automatic Training Access** | `Certified Tools` automatically approves training requests that use certified tools; `All` also covers uncertified tools. **Exception:** a tool requesting network access outside the federated learning channel always requires manual approval, regardless of this setting. This protects your Client from data exfiltration. |
| **Automatic Statistics Access** | When set to `All`, statistics requests are approved automatically. |
| **Automatic Metrics Access** | When set to `All`, metrics requests are approved automatically. See [Metrics requests](#metrics-requests) for who may submit them. |

You can create as many permissions as you need. If more than one permission applies to the same request, **the most permissive one wins**. For example, if a permission for all users allows statistics access and another permission for a specific user denies it, that user is still allowed to request statistics.

Which variables of a cohort can be queried, and how, is set separately in the cohort's **Queriability** tab. See [Cohorts](cohorts.md).

## Deployment settings

Some access controls are configured when the Client is deployed rather than in its interface. See [Deploy your client](../deployment/deploy-client.md).

### Automatic approval

For each of statistics, training, and metrics requests, the deployment configuration decides whether automatic approval is available on the Client at all. If it is disabled for a request type, the corresponding **Automatic … Access** permission setting has no effect, and all requests of that type require manual approval.

Federated queries are not affected by this setting. They are always evaluated automatically against the cohort's permissions, and the configured disclosure controls are applied.

### Default permission for new cohorts

You can optionally configure a default permission that is created automatically whenever a new cohort is added to the Client. It supports the same settings as described in [Manage access permissions](#manage-access-permissions).

## Manage accepted trainings

Open **Governance → Trainings** to review accepted federated learning trainings. Use this area to monitor ongoing trainings, review completed trainings, and manage their access settings and your site's participation using the available controls.

## Review logs and notifications

- **Governance → Logs** provides access to activity logs for reviewing operations and investigating issues.
- **Governance → Notifications** provides access to system notifications and updates requiring attention.

## Related reading

- [Deploy your client](../deployment/deploy-client.md)
- [Authentication](../contribution-guide/auth.md)
- [Add data to a cohort](add-data/index.md)
