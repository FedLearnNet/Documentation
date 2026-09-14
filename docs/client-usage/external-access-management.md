---
title: Controlling federated data analysis settings
sidebar_position: 4
---
# Controlling federated data access via your Clients interface

Joining the %%DEPLOYED_PRODUCT_NAME%% network doesn't mean every participant can run arbitrary analysis against your client. Defining **what is allowed**, **for whom**, and **under which privacy controls** is a core feature of the client — and your responsibility.

There are two controls for this: **Requests**, which require manual approval, and **Permissions**, which define the access and disclosure controls for a cohort.
You can setup permissions and handle requests via the *Access Management* tab in your Client's interface.
On deployment of the client, certain [permission options can be enabled/disabled](#activating-the-automatic-access-permission-system) and a [default permission can be created](#setting-a-default-permission-automatically-created-on-cohort-creation) for each cohort.

## Requests

Statistics, learning, and metrics actions that may release non-anonymous personal data from your client to the outside world go through a request and require manual approval. Federated data discovery queries are evaluated automatically using the cohort's disclosure-control settings and do not have a manual-approval step.

There are three types:

**Federated Statistics Request**
A request for the distribution of specific variables. Your cohort's rounding and thresholding settings (defined in your permissions) are applied automatically to the result.

**Federated Learning Request**
A request to run a federated learning job on your client. You choose which patients and variables are included. The request specifies:
- The tools and workflow used, including versions and chosen hyperparameters
- The output artifacts requested (model and metrics), and whether they're limited to participating sites and the requesting user, or made public

**Federated Metrics Request**
A request for the local metrics produced by a completed federated learning run, calculated on your client's own data. This can be requested by:
- Any user, if the run's resulting Inference Tool is public, or
- Only the user who created the run, otherwise

## Permissions

Data you add to your client is organized into **cohorts** that you create. On each cohort, you can add **permissions** under *Access Management* to define disclosure controls and access rules.

Each permission defines:

| Setting | What it controls |
|---|---|
| **Who** | Which user the permission applies to. Leave empty to apply it to *any* user. |
| **Query: Enable queries** | Whether the user is allowed to run federated queries on this cohort. Queries have no approval mechanism, once enabled they are safeguarded by the further permissions below on frequency limit and minimum record count. |
| **Query: Query frequency limit** | The minimum time that must pass between queries. Queries arriving too fast are rejected. |
| **Query: Minimum record count** | The minimum number of records a query must return. Queries below this threshold return `0` instead of the real count. This includes statistics requests, so a category with only 50 records under a threshold of 100 returns `0`, not 50. |
| **Statistics: Statistics access** | When disabled, automatically rejects any federated statistics requests. Enabling this does **not** automatically approve statistics requests. |
| **Statistics: Minimum record count** | The minimum record count each entry in the statistics response must include. Requests below this threshold return `0` instead of the real count.  For example for a categorical variable with 10 categories, a category with only 30 records under a threshold of 100 returns `0`, not 30. For numerical variables, the values are binned and the minimum record count applies to each bin. For free text, each unique term is treated as a separate category. |
| **Statistics: Minimum catergory count** | The minimum number of categories with values that are not zero after disclosure control. If the number of categories is below this threshold, the entire response of this variable is removed. For example for a categorical variable with 10 categories, if only 3 categories have more than 100 records and the threshold is set to 5, the variable is completely removed from the response. For free text, each unique term is treated as a separate category. |
| **Automatic Training Access** | When enabled, `Certified Tools` automatically approves federated learning requests for certified tools; `All` also covers uncertified tools. **Exception:** any tool requesting network access outside the federated learning channel always requires manual approval, regardless of this setting. This protects your client from data exfiltration. |
| **Automatic Statistics Access** | When enabled and set to `All`, automatically approves federated statistics requests. |
| **Automatic Metrics Access** | When enabled and set to `All`, automatically approves metrics requests. See the metrics-request rules above for who's eligible to request this. |

You can create as many permissions as you like. If more than one applies to the same request, **the most permissive one wins** — e.g., if one permission for all users allows statistics access and another for a specific user denies it, that user will still be allowed to run statistics queries!

# Controlling federated data access when configuring and deploying your Client
## Activating the automatic access permission system
During deployment/configuration, you decide — separately for each of Statistics, Learning, and Metrics — whether automatic-access permissions are enabled at all on this client for that resource.

Federated queries aren't affected by this setting — they're always evaluated automatically against as the permission and if the permission allows a user to query, the relevant disclosure controls are applied automatically.

## Setting a default permission automatically created on cohort creation
You can optionally configure a default permission that's created automatically whenever a new cohort is added to this client.
See [the permission table above](#permissions) for a description of the settings you can configure for this default permission.

## Related reading

- [Deploy your client](../deployment/deploy-client.md)
- [Authentication](../contribution-guide/auth.md)
- [Add data to your client](add-data/index.md)
