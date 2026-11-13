---
title: Custom statistics
sidebar_label: Custom statistics
---

# Custom statistics

Custom statistics are charts you configure for a cohort. They are grouped in **dashboards**, shown as tabs next to **Data Profile** on the **Statistics** tab. Dashboards belong to the cohort and are visible to all [cohort members](index.md#members).

## Create a dashboard

1. Open the cohort's **Statistics** tab.
2. Select **+** next to the dashboard tabs.
3. Enter a name.

Rename or delete the dashboard with the arrow next to **Add custom statistic**.

## Add a statistic

1. Open the dashboard and select **Add custom statistic**.
2. Enter a **Name**, select a **Chart type**, and select **Continue**.

   ![New custom statistic dialog with the chart types](/img/screenshots/tutorials/walkthrough/client-usage/patient-data/custom-statistic-type.png)

3. Fill in the **Configuration** and select **Create**.

   ![Configuration of a bar chart counting patients per age group, grouped by readmission](/img/screenshots/tutorials/walkthrough/client-usage/patient-data/custom-statistic-configuration.png)

The chart is computed from the cohort's records. **Waiting for computed data…** is shown until the result is ready. Remove a chart with its delete action.

![Dashboard Readmission overview with a stacked bar chart of age by readmission](/img/screenshots/tutorials/walkthrough/client-usage/patient-data/custom-statistics-dashboard.png)

## Chart types

| Chart | Shows | Main settings |
|---|---|---|
| **Bar** | Counts or aggregations per category | Category property, value property, aggregation, group by, orientation, sort, category limit, stacked groups |
| **Pie** | Share of total per category | Category property, value property, aggregation, top N slices, labels |
| **Line** | Trend over time or an ordered axis | X property (date or numeric), Y property, aggregation, granularity, group by |
| **Scatter** | Two numeric properties | X and Y property, group by, size property |
| **Histogram** | Distribution of a numeric property | Property, bins, min, max |
| **Box plot** | Quartiles, optionally per group | Numeric property, group by |
| **Heatmap** | Density across two axes | X and Y property, value property, aggregation, X and Y bins (numeric only) |

Without a value property, a chart counts rows.

| Setting | Options |
|---|---|
| Aggregation | COUNT, SUM, AVG, MIN, MAX, MEDIAN |
| Granularity (Line) | DAY, WEEK, MONTH, QUARTER, YEAR |
