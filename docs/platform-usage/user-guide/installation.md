---
id: installation
title: User Installation & Access
---


# User installation and access

Most end users do not install an FL-Net based networkfrom scratch themselves. They either:

- use a **hosted deployment** like the %%DEPLOYED_PRODUCT_NAME%% network
- or work in a **local development setup** provided by an administrator or developer

This page clarifies what you actually need in each case.

## Hosted or institutional access

If you are using a shared deployment, you typically need four things from your administrator:

- the platform base URL
- An account provided to you from your institution or project admin

In that scenario, there is usually nothing to install locally beyond a modern browser.

## Local development or test access

If you are working in a local or staging setup, access often requires:

- a running backend stack, usually started with Docker Compose
- a frontend development server or prebuilt frontend
- working authentication configuration

Typical local steps are:

1. start the infrastructure stack provided by the project or admin team
2. start the frontend if it is not already served by the stack
3. sign in with the configured local or test account

## Browser and authentication notes

Authentication issues are often environmental rather than application-level.

Check:

- whether the login service is reachable
- whether cookies are blocked across domains
- whether the system clock is correct
- whether HTTPS is expected but not used locally

## What to do if access fails

If you cannot sign in or the tool keeps redirecting, collect these details before asking for help:

- deployment URL
- whether this is local, staging, or production deployment
- your browser
- the exact step that fails
- whether the issue happens before or after the identity provider login screen

Continue with [Troubleshooting](troubleshooting.md) if login or startup still fails.
