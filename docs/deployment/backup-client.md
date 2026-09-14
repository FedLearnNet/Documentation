---
title: Backup and Restore a Client
sidebar_position: 3
---

# Backup and Restore a Client

This page explains how to backup and restore any FL-Net Client installation.

Your Clients data is stored in 
- docker volumes storing the PostgreSQL databases (Patient, Orchestration and Authentication data)
- environment variables storing network settings and secrets such as database secrets
- nginx configuration files storing further network settings

## Create Local Database Backups

### Using the provided create-backup.sh script
A backup script is provided with the deployment in the `FLNet_client` folder and should be excecuted
from this folder.
```bash
./create-backup.sh
```
The client should be running when running the script.
If this script outputs `Backup completed: ...` the backup was successful.
It creates a timestamped backup folder and generates SQL dumps for all local databases 
and backups your whole `FLNet_client` folder including environment variables and 
nginx configuration.

The script is commented if you're interested in the details of the backup process, in short it
- copies the `FLNet_client` folder to a new backup folder with a timestamp, containing all configuration files and environment variables
- generates SQL dumps for all local PostgreSQL databases and saves them in the backup folder
- creates a `restore-backup.sh` script in the backup folder that can be used to restore the 
client state from the backup folder.

## Restore Local Database Backups
You can just use the generated `restore-backup.sh` script in the created backup folder:
```bash
cd backups/
# This folders name depends on when you created the backup
cd backup_2026-06-19_14-45-42/
./restore-backup.sh
```

To now start your restored deployment, you can use the `docker compose` commands as usual, for example:
```bash
docker compose up -d
```

The restore script restores the local PostgreSQL databases by importing the generated SQL dumps with `psql` through `docker compose exec`. 
If you accidentally already ran `docker compose up` before running the restore, the database
will already contain constraints and you will get multiple errors.
Please then run:
```bash
docker compose down -v
./restore-backup.sh
```
This will delete the existing volumes and their data before restoring the backup!

## What exactly is backed up?

### Databases
The local databases are all PostgreSQL databases:

- `local-learning-api-db`: stores the patient data and import related settings such as connectors
- `orch-api-db`: stores orchestration data from the tool execution system
- `keycloak-postgres`: stores Keycloak users, realms, clients and authentication state

The backup script uses `pg_dump` through `docker compose exec`. This creates portable `.sql` files
that can later be imported into PostgreSQL again with `psql`.

### Settings files
- The nginx config is backed up including also the domain name which is hardcoded `nginx.conf`. 
This hardcoding allows us to use the more secure chainguard nginx image which does not allow to change the domain name through environment variables.
- The `.env` file containing domain name, used port as well as the global platform used in the deployment.
- the `env` folder contains any secrets such as the database passwords.

## Important Notes
- The commands use `docker compose exec -T` so they also work in non-interactive shells, for example in cron jobs.
- The generated SQL files may contain sensitive information, especially the Keycloak backup. Store them securely.
- This backup process does NOT cover versioning. We recommend that you change the `docker-compose.yml` file to use a specific version tag for the PostgreSQL images instead of `latest` to ensure compatibility when restoring the backup in the future.
