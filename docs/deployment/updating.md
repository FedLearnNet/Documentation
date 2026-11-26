---
title: Updating
slug: /deployment/updating
sidebar_position: 4
---

# Updating a Client or Platform

An admin updates in the **Admin Center** under **Updates & backups**:

1. **Download** the new version. Everything keeps running.
2. **Install** it once no training or analysis is running. The site is offline for a few minutes.
3. If something goes wrong, it returns to the previous version on its own.

A Client installs the version its Platform runs, so the Platform is updated first. On a Platform, enter the
version to install, e.g. the latest [release](https://github.com/FedLearnNet/FL-Net-CLI/releases).

**Roll back** returns to the state before the last update. Everything done since then is lost.

## The first time

If the card says that updates are not supported yet, run this once on the server:

```bash
flnet client init      # or: flnet platform init
```

## Without the Admin Center

Install the new `flnet` (`flnet upgrade` shows how), then:

```bash
flnet upgrade prepare --dir <folder>
flnet upgrade apply --dir <folder>
```

`flnet client info` shows the folder. Each update keeps a backup in the `backups` folder.
