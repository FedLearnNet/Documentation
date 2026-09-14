---
title: Creating queries
sidebar_position: 4
---

A query defines which patients you want to study. The global platform sends your query to every participating clinic, the clinics run it against their own patient data, and only an aggregated, privacy-protected count comes back. You never see individual patient records.

This page walks you through building, running, and editing a query.

## Where to start

1. Open the global platform and go to **Find data**.
2. Click **New query**.
3. Fill in:
   - **Name** — short label visible in your query list.
   - **Description** — a longer description of the query.

You are now on the query builder.

## The building blocks

A query is a tree of **conditions** combined by **AND** or **OR**.

- A **condition** matches a value in patient data: an ontology (e.g. *Diagnosis*, *Heart rate*), an operator (`=`, `>`, `<`, *exists*, etc.), and a value.
- A **group** combines several conditions with **AND** (all must match) or **OR** (any one matches). You can nest groups inside groups.
- **Time filter** restricts which observations of the patient count (only after a date, only before a date, only the first or last value, or the average).
- **At least / at most** controls how often the condition must occur for the patient to qualify.
- **Temporal relations** link two conditions and require them to happen in a specific order or at the same time (e.g. *condition A happens before condition B*).

A query has two cohorts:

- a **case** cohort — the patients you are interested in (required), and
- an optional **control** cohort — patients you want to compare against.

Both are independent queries with the same building blocks. The system gives you two counts: how many case patients each clinic found, and how many control patients.

## Step-by-step recipes

### "Patients with diabetes type 1"

1. Pick the ontology *Diagnosis*.
2. Operator `=`, value `Diabetes Type 1`.
3. Save & run.

### "Patients over 35 with a high heart rate in May 2025"

1. Add a condition: *Age* `>` `35`.
2. Add a second condition: *Heart rate* `>` `70`, time filter **after** `2025-05-01` **before** `2025-05-31`.
3. Make sure the group operator is **AND**.
4. Save & run.

### "More than three blood pressure readings"

1. Add a condition: *Blood pressure* `exists`.
2. Set **at least** to `3`.
3. Save & run.

### "Patients whose blood glucose was above 180 within 2 weeks of an HbA1c over 7%"

1. Add condition 1: *Blood glucose* `>` `180`.
2. Add condition 2: *HbA1c* `>` `7`.
3. Add a temporal relation: source `1`, target `2`, relationship **AFTER**, *at most* `2 weeks`.
4. Save & run.

### "Compare diabetics vs. healthy patients"

1. Build the case cohort as in the diabetes recipe.
2. Switch to the **Control query** tab.
3. Build the control cohort: *Diagnosis* `=` `Healthy` (or whatever matches your study).
4. Save & run.

The result card now shows **two** counts side by side — one for the case cohort, one for the control cohort.

## Reading the result

After firing, each connected clinic responds asynchronously. The result card updates as responses arrive:

- **Result** — total case patients matching across all clinics that responded.
- **Result control** — total control patients (only shown when you defined a control cohort).
- Per-clinic counts are aggregated and **privacy-rounded** before they reach you. Counts under a clinic's minimum sample threshold are dropped entirely.
- **Statistics** — once you fire data statistics, you get distributions for the values inside your query.

If no clinic responds, or every clinic's count is below the privacy threshold, the result stays empty. That's by design.

## Editing a query

Every save creates a new **version** of the query under the same group. The list view always shows you the most recent version; older versions are linked from the detail page.

You can:

- **Edit** an unfired query — saves a new draft.
- **Save & run** an existing query — creates a fresh version and broadcasts it.
- **Re-run** a fired query — broadcasts the same payload again as a new rerun version.
- **Delete** a query you own that has not been fired.

You cannot delete a query that has already been fired. This is intentional: fired queries are part of the audit trail.

## Limits and good practice

- Keep cohort definitions tight. Overly broad queries can be rejected by a clinic for falling below the privacy threshold per cohort.
- Use **time filters** to scope to a study period. They cut down on the data the clinics scan.
- Use **at least / at most** rather than nesting groups when you want to express "this happens N times" — it generates much simpler SQL on the clinic side.
- Use a **control cohort** when you plan to compare. Asking for it after the fact requires re-firing the query.

## Troubleshooting

| Symptom                                    | Likely cause                                                                                  |
| ------------------------------------------ | --------------------------------------------------------------------------------------------- |
| Result stays at 0 across all clinics       | Privacy threshold rejected every cohort, or the operator/value pair matches no patients.       |
| Result is much lower than expected         | Privacy rounding plus per-cohort thresholds suppressed small cohorts. Try widening the filter.|
| A clinic shows an error                    | The clinic's local data model may not have the ontology you used. Check the *Diagnostics* tab. |
| You see *Query rejected — permission denied* | You don't have query access on any cohort, or your account hasn't accepted the project terms. |
| Editing the query "does nothing visible"   | Each save creates a new version. Refresh the list to see it; older versions are kept.         |

## See also

- Backend mechanics: [how the global API persists and broadcasts a query](../../contribution-guide/backend/global-learning-api/query-creation.md).
- Translation details: [how a clinic turns your query into SQL](../../contribution-guide/backend/local-learning-api/query-translation-and-privacy.md).
- Frontend internals (for contributors): [Query system](../../contribution-guide/frontend/systems/query-system.md).
