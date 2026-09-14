---
id: troubleshooting
title: Troubleshooting
---


# Troubleshooting

When something fails in the %%DEPLOYED_PRODUCT_NAME%% network, the fastest path to a fix is to locate **which stage** is broken:

1. access and authentication
2. input preparation
3. run configuration
4. execution
5. result rendering

## Login fails

Check:

- whether the correct deployment URL is used
- whether the identity provider or Keycloak realm is reachable
- whether your browser blocks cookies or cross-site login flows
- whether your machine time is correct

If login succeeds but the tool immediately redirects or shows an empty state, the cause may be missing roles rather than failed authentication.

## A run does not start

Check:

- whether all required inputs were attached
- whether mandatory parameters are still unset
- whether the selected tool is actually runnable in the current deployment
- whether the backend or worker has sufficient resources

For local or admin-facing setups, also inspect worker and orchestration logs.

## Input files are rejected

For CSV or tabular inputs, verify:

- delimiter
- encoding, preferably UTF-8
- presence of required headers
- missing values and type mismatches

Small schema mismatches are a common cause of failed validation.

## A run finishes but no useful result appears

Check:

- the run status
- logs or warnings
- whether the tool declared the expected outputs
- whether the file preview supports the produced artifact type

Sometimes the tool succeeded technically but produced an unexpected or empty artifact because the input data was not meaningful.

## Performance is poor

Try the smallest realistic test case first.

If performance remains poor, review:

- file size
- number of selected features
- deployment resource limits
- whether you are uploading or processing unnecessarily large intermediate artifacts

## What to include in a support request

A good issue report should include:

- page or tool name
- deployment environment
- exact step that failed
- visible error message
- whether the problem is reproducible

That usually reduces debugging time much more than screenshots alone.
