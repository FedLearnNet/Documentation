---
title: Groups & temporal relationships
sidebar_position: 2
---

# Groups & temporal relationships

Real cohort definitions rarely stop at a single variable. The Query Builder lets you combine conditions into arbitrarily nested **AND / OR groups** and attach **temporal relationships** so events must occur in a specific chronological order, within a bounded time window, during the same clinical visit, or inside the same imported record group.

---

## Boolean groups (`AND` / `OR`)

Every query starts with a root group card. Inside any group header you can:

- Switch between **AND** (*Match all*, wire `"$and"`) and **OR** (*Match any*, wire `"$or"`):
  - **AND (`$and`):** A patient qualifies only if **every** child condition and nested sub-group in the group matches (compiled via SQL `INTERSECT` of distinct `patient_id` sets).
  - **OR (`$or`):** A patient qualifies if **at least one** child condition or nested sub-group matches (compiled via SQL `UNION` of distinct `patient_id` sets).
- Click **+ Condition** to append a leaf condition to the group.
- Click **+ Group** to nest a child sub-group (for example, `Age >= 18 AND (Diagnosis = Type 1 Diabetes OR Diagnosis = Type 2 Diabetes)`).
- Click **+ Temporal relationship** (enabled whenever the group contains at least **two** leaf conditions that are eligible endpoints).
- **Collapse / Expand (`▾` / `▸`):** Collapses a group into a single-line human-readable formula (such as `(Diagnosis = E11 OR Diagnosis = E10)`) so large trees stay easy to scan.
- **Move up / Move down / Duplicate / Delete** (on nested groups): Reorders, clones, or removes an entire sub-tree at once.

### Structural rules for groups

- Every group must contain **at least one** condition or sub-group; empty groups are flagged as invalid before saving.
- Numbered badges follow tree hierarchy (`1`, `2`, `2.1`, `2.2`, …) so you can immediately tell which condition a temporal relationship refers to.
- Reordering or deleting a condition inside a group automatically shifts (or cleans up) the `Source` and `Target` indexes of any temporal relationships in that group.

---

## Temporal relationships

Without a temporal relationship, `Condition 1 AND Condition 2` only requires that the patient satisfied Condition 1 at *some* point in their history and Condition 2 at *some* point in their history — even years apart or in the opposite order.

Adding a **Temporal relationship** correlates the **actual matching event occurrences** of a **Source** condition and a **Target** condition for the same patient.

```mermaid
flowchart LR
  Source["Source condition (e.g. 1: HbA1c > 7.5)"] -->|"Relationship + optional interval + At least / At most"| Target["Target condition (e.g. 2: Insulin exists)"]
```

### Endpoint rules

- **Same-group leaves only:** Both **Source** and **Target** must be **distinct leaf conditions** directly inside the same group (`Source != Target`). Nested sub-groups cannot be selected directly as endpoints; place correlated leaves inside the group that owns the relationship.
- **Event timestamp required:** A condition using whole-series **Value aggregation = Average** with **Time aggregation = None** collapses a patient's entire history into a single timeless number, so it has no occurrence timestamp and **cannot** be used as a temporal relationship endpoint. (`Average` *with* a sliding `Within` window, or `First` / `Last`, *does* retain an event timestamp and can be used.)
- **Multiple relationships in one group:** You can add several temporal relationships to the same group (for example `1 → 2` and `2 → 3` for a three-step clinical pathway). Every relationship in the group must be satisfied (`INTERSECT`).

### Relationship types and exact semantics

Read every relationship from **Source** (`source.event_time`) to **Target** (`target.event_time`):

| Relationship in UI | Wire spelling | Interval required? | Exact matching rule |
| --- | --- | --- | --- |
| **Same group** | `"same group"` | No | `source` and `target` share the same non-null `import_schema_group_id` (records imported together as part of the same structured clinical group, such as a medication order or lab panel). |
| **Same visit** | `"same visit"` | No | `source` and `target` share the same non-null `visit_id` (recorded during the exact same clinical encounter/visit). |
| **Same time** | `"same time"` | No | `source` and `target` occurred on the **same UTC calendar date** (`CAST(target.event_time AT TIME ZONE 'UTC' AS date) = CAST(source.event_time AT TIME ZONE 'UTC' AS date)`). |
| **Within** | `"within <interval>"` | Yes | Symmetric inclusive window: `target` occurred within `± <interval>` of `source` (`source.event_time - interval <= target.event_time <= source.event_time + interval`), in **either** chronological order, including the exact same timestamp. |
| **In the following** | `"in the following <interval>"` | Yes | Forward directional window: `target` occurred **strictly after** `source` and **at most `<interval>` later** (`source.event_time < target.event_time <= source.event_time + interval`). |
| **Anytime after** | `"anytime after"` | No | Chronological order without a maximum gap: `target` occurred **strictly after** `source` (`target.event_time > source.event_time`). |

:::tip[Choosing between `Within` and `In the following`]
- Use **Within `2 weeks`** when two measurements belong to the same diagnostic workup and you do not care which one was recorded first.
- Use **In the following `2 weeks`** when **Source** is the index event (for example *Surgery* or *Baseline Lab*) and **Target** must happen *after* it within 2 weeks.
:::

### Interval units

For **Within** and **In the following**, build intervals from one or more positive integer parts:

- Supported units: `minutes`, `hours`, `days`, `weeks`, `months`, `years` (singular or plural in JSON, e.g. `"1 day"`, `"2 weeks"`, `"6 months"`, or compound `"1 month 2 weeks"`).
- Zero or negative interval counts are rejected.

### Occurrence bounds on a temporal relationship (`At least` / `At most`)

Each temporal relationship also has optional **At least** and **At most** fields (`0 <= At least <= At most`). For every matching **Source** occurrence of a patient, the clinic counts how many distinct **Target** occurrences satisfy the relationship (`relation_count`):

| `At least` | `At most` | Meaning |
| --- | --- | --- |
| *Empty* | *Empty* | Default (`At least = 1`): the patient has at least one **Source** occurrence linked to **at least 1** matching **Target** occurrence. |
| `N` (`N >= 1`) | *Empty* | At least one **Source** occurrence is linked to **`N` or more** distinct matching **Target** occurrences (for example, *Diagnosis = Heart failure* followed `in the following 1 year` by **at least `2`** *Hospitalization* events). |
| *Empty* or `0` | `0` | **Event without follow-up:** the patient has a matching **Source** occurrence, and **zero** matching **Target** occurrences satisfy the relationship across all Source occurrences (for example, *Index procedure* with **no** *Complication* `in the following 30 days`). |
| *Empty* or `0` | `M` (`M >= 1`) | Universal cap: the patient has a matching **Source** occurrence, and **no** single Source occurrence has more than `M` matching Target occurrences. |
| `N` | `M` | At least one Source occurrence has `>= N` matching Targets, and no Source occurrence exceeds `M` matching Targets. |

---

## Best practices for advanced combinations

### Combining `Same group` with `First`, `Last`, or `Delta`

When a clinic imports grouped longitudinal records (via `import_schema_group_id`, such as LOINC/ATC sub-panels where one field identifies the code/category and a second field holds the numeric measurement), `Same group` scopes the **Target** condition's raw rows to the groups matched by **Source** *before* computing `First`, `Last`, or `Delta` on **Target**.

- **Recommended order:** Always place the **identifying code / category condition as `Source`** (e.g. Condition 1: *Measurement Code = Systolic BP*) and the **aggregated (`First` / `Last`) or `Delta` value condition as `Target`** (e.g. Condition 2: *Measurement Value > 10* with `Value mode = Delta`), linked by **Same group**.
- That ensures `First`, `Last`, and `Delta` are computed strictly over rows belonging to that code's group rather than across unrelated measurements.

### Mixing `OR` groups with temporal relationships

If you need *(Condition A OR Condition B) followed within 30 days by Condition C*:
- Because temporal relationship endpoints must be leaf conditions in the same group, check whether Condition A and Condition B can be expressed as a single leaf using the **`In (in)`** operator (for example `Diagnosis in E10, E11`). A single `in` leaf *can* serve directly as **Source**!
- Otherwise, create an outer **OR** group containing two **AND** sub-groups: `(A followed by C)` **OR** `(B followed by C)`.

## Next steps

- Review how clinics enforce permissions and privacy, inspect the JSON schema, or follow step-by-step clinical recipes in [**Results, privacy, JSON & troubleshooting**](results-privacy-and-json.md).
- Revisit single-condition longitudinal settings in [**Conditions, operators & advanced filters**](conditions-and-filters.md).
