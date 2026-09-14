---
id: security
title: Security & Privacy
---


# Security and privacy

Security in %%DEPLOYED_PRODUCT_NAME%% is closely tied to reproducibility and governance. The platform is intended for settings where analysis must remain both usable and controlled.

## Core principles

### Explicit authentication and authorization

Use realm-, client-, and role-based access control so users and services only receive the permissions they actually need.

### Controlled execution

Tools should run in isolated, centrally governed environments instead of uncontrolled user machines.

### Least privilege

Access tokens, runtime permissions, and service credentials should all be scoped as narrowly as possible.

### Privacy-aware observability

Logs and monitoring should make execution understandable without exposing raw sensitive data.

## Practical checklist

- Use HTTPS everywhere.
- Review realm and client configuration regularly.
- Avoid logging raw PII or secret values.
- Encrypt sensitive storage where applicable.
- Apply timeouts, request-size limits, and rate limits at network boundaries.
- Separate build-time trust from runtime trust wherever possible.

## Why this matters in %%DEPLOYED_PRODUCT_NAME%%

The paper’s architecture depends on a simple idea: users can benefit from flexible workflows and AI-supported guidance only if the platform keeps execution bounded, observable, and governable.

That means security is not a side topic here. It is part of how the scientific workflow stays trustworthy.
