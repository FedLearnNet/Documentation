---
title: SQL SELECT extractor
sidebar_position: 3
---

# SQL SELECT extractor

The **SqlSelectExtractor** uses the result of a read-only SQL `SELECT` statement as the tabular input for a connector. Use it when the source data is stored in a supported relational database.

## Configuration

Select **SqlSelectExtractor** as the connector source and configure:

| Setting | Description |
|---|---|
| **SQL SELECT** | The read-only query whose result becomes the connector input. |
| **SQL distribution** | The database type, such as PostgreSQL, MySQL, or SQLite. |
| **Host** | The database server hostname or address. |
| **Port** | The database service port. |
| **Database** | The database name. |
| **Username** | The account used to establish the connection. |
| **Password** | The password for the database account. |

![SqlSelectExtractor configuration showing the SQL query and database connection fields](/img/screenshots/tutorials/walkthrough/client-usage/database-source.png)

The columns returned by the query become the source columns reviewed and mapped in the remaining connector steps. Use stable, meaningful column aliases where necessary so that the result is easy to transform and map.

Use a database account with only the permissions required to execute the intended read-only query. Test the query and confirm that its result contains the expected rows and columns before completing the connector configuration.
