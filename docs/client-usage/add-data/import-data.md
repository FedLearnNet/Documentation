---
title: Import data by running a connector
sidebar_position: 3
---

# Import data by running a connector

Creating or importing a connector saves its ETL configuration. You can then add or update patient data by running the connector with a compatible data source.

## Open and run the connector

1. Open the cohort and select [**Connector**](connectors/index.md).
2. Open the connector you want to run.
3. Review its source and configuration summary, then select **Run**.

![Connector detail page showing its summary, Run action, automation settings, and activity log](/img/screenshots/tutorials/walkthrough/client-usage/connector.png)

The connector detail page also contains an **Activity Log**. Each run reports its status, execution date, and the numbers of new, deleted, updated, failed, and unchanged patients. Select **View Details** to inspect a run.

## Configure the import

The run dialog determines how the connector uses its source and how the imported data affects the cohort. If no option is selected, the connector runs against its configured source and adds or updates the patients contained in that source while retaining other patients already in the cohort.

![Run connector dialog showing replacement, dry-run, and new-file options](/img/screenshots/tutorials/walkthrough/client-usage/run-connector.png)

| Option | Description |
|---|---|
| **Delete all patients before import** | Permanently deletes all existing patients before importing the source, replacing the cohort's current patient data with the imported dataset. |
| **Make this a Dry Run** | Executes the connector without applying changes to the cohort. The results can be reviewed before deciding whether to apply or abandon them. |
| **Import a new File** | Selects a new compatible source file for this run of a file-based connector. |

Enable **Delete all patients before import** only when the incoming source is intended to replace the complete cohort dataset. For a new connector or source file, use a dry run first to identify extraction, transformation, mapping, or validation problems without changing cohort data. Select **Run** to start the execution.

## Review the result

After execution, select **View Details** for the run in the connector's activity log. The detail page contains a run summary and an entity overview showing the numbers of new, updated, deleted, failed, and unchanged patients.

![Connector run details showing the run summary, entity overview, result tabs, logs, and rollback action](/img/screenshots/tutorials/walkthrough/client-usage/run-details.png)

Use the available tabs to inspect **Patient Results**, **Patient Errors**, **Run Errors**, and **Run Logs**. The logs can be searched and filtered by severity. A completed status confirms that execution finished; review the entity counts and errors to verify that the run produced the expected changes.

For accepted values and error handling, see [Data validation and normalization](input_validation.md).
