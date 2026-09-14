---
title: Add data to your client
sidebar_position: 1
---

# Add data to your client

Data is added to the %%DEPLOYED_PRODUCT_NAME%% Client through **connectors**. 
A connector is a saved configuration that describes for specific data input the whole ETL (Extract, Transform, Load) process:
- The data format (csv/sql database/...)
- The extraction method (e.g. PostgreSQL extractor logic or a simple csv extractor)
- The set of column names that should exist after the extraction
- A set of transformation apps/functions that are applied on a subset of columns
- Mapping of the (transformed) columns to the nodes in the data standard

Once a connector is set up, it can be run on demand to import or re-import data into a cohort.

The client supports the creation of connectors based on data files. 
A datafile, e.g. a csv file, is uploaded directly to the client.
Based on that a connector is configured once.
This connector can be run again later with another file as long as the new file
has the same format including column names than the one used for connector creation.

We natively support simple tabular `csv`/`tsv` or similiar files as well as `.xlsx` excel files.
Multiple sheets or multiple tabular files are supported.
Please refer to the [input data formatting guidelines](input_checklist) as well and make sure
your input follows these.

# Creating a connector
A connector is usually created from scratch based on raw input such as tabular data files (`csv`/`tsv`).
Please refer to [the documentation on creating a connector from scratch for more information](connector_creation_from_scratch)

Alternatively, somebody already set the connector up for you.
Go to the relevant cohort, find the connector menu and click on the arrow next to the add connector button.
Either select import from JSON or from URL and paste in the URL or JSON given to you.
You can then on running the connector chose the raw data file you want to import from.

### Re-uploading

When the source data is updated, a new version of the file can be uploaded through the connector without reconfiguring the mapping. The client validates that the column structure of the new file matches the existing configuration before accepting it. If columns do not match, the upload is rejected and the existing data is preserved.

### Normalization and validation
For more information about how data is normalized and validated, please check:
- the [input data formatting guidelines](input_checklist)
- the [detailed normalization and validation documentation](input_validation)
