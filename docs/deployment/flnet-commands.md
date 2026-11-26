---
title: Everyday commands
slug: /deployment/flnet
sidebar_position: 3
---

# Everyday commands

`flnet` sets up and runs your Client. Install it once as shown in [Deploy your own Client](client/deploy-client.md).

| What you want | Command |
|---|---|
| Start | `flnet client up` |
| Stop | `flnet client stop` |
| Check that everything runs | `flnet client status` |
| See what happens | `flnet client logs -f` |
| Find the folder and version | `flnet client info` |
| Change settings | `flnet client init` |
| Make a backup of the data | `flnet client backup` |
| Make a backup of everything, with settings and passwords | `flnet client backup --all` |
| Go back to a backup | `flnet client restore <name>` |
| Look for a new version | `flnet upgrade` |

For a Platform, write `platform` instead of `client`. Every command explains its options with `--help`.

To install a new version, see [Updating](updating.md).
