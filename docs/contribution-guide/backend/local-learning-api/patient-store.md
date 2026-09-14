---
title: Patient Store
description: How connector imports write mapped patient data into the local patient store.
---

# Patient Store

Connector imports load source rows into the cohort patient store by external patient ID. The importer now keeps source rows disk-backed when needed, but patient-store semantics remain patient oriented.

The disk cache stores rows as compact JSONL value arrays in table column order. When the loader reads those rows, `TableDataFileHandler` reconstructs the normal row map before mapping and validation, so patient-store code does not depend on the on-disk format.

## Import unit

The loader imports a `ConnectorLoadPatient`:

- `externalPatientId` identifies the cohort patient.
- `rows` contains mapped import rows for that patient.
- each row contains `PatientDataEntryDTO` values created by `MappingBO`.

Disk-backed ETL builds patient groups from row indexes first, then maps and loads one patient group at a time.

## Validation and row checks

Patient-level checks still run with all mapped rows for a patient available:

- validation failures mark the whole patient group as failed for loading;
- failed data-entry counts are added to run statistics;
- schema parent group consistency is checked while creating patient data entries;
- missing external patient IDs are logged during mapping.

## Import modes

Default mode creates new patients or appends entries to existing patients.

Comprehensive mode treats incoming patients as the source-of-truth snapshot for the connector run. It streams incoming patient batches, tracks imported external IDs, updates or creates matching patients, then reconciles existing patients that were not imported.

Delete mode resolves each incoming external patient ID and deletes matching patient data. Missing patients are treated as unchanged.

## Persistence memory

Patient imports are flushed and cleared in configured batches. This keeps the Hibernate persistence context from growing with the full import size.

Relevant tuning:

```properties
flnet.connector.import-flush-clear-batch-size=50
flnet.connector.import-progress-publish-batch-size=50
```

## Extension guidance

When adding patient-store import logic:

- keep the patient as the unit of work;
- do not reintroduce a full import-wide `List<MappingRowResultDTO>`;
- use `ConnectorLoadBO.loadPatientMappedRows` for disk-backed patient groups;
- preserve patient-level validation before persistence;
- publish run statistics after batch boundaries or configured progress intervals.
