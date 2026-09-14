# `lib-time-badge`

`lib-time-badge` keeps dates and durations consistent across the apps.

It can do two jobs:

- show one formatted date
- show a running or finished duration

## Import

```ts
import { TimeBadgeComponent } from '@shared-lib/components/time-badge/time-badge.component';
```

## Inputs

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `date` | `Date \| undefined \| null` | required | Start date or single date |
| `dateTo` | `Date \| undefined \| null` | none | End date for duration mode |
| `calcDuration` | `boolean` | `false` | Switches from date view to duration view |
| `color` | `BadgeColor` | `'GREEN'` | Used in plain date mode |
| `size` | `BadgeSize` | `'SMALL'` | Badge size |
| `format` | `'LONG' \| 'SHORT' \| 'MEDIUM'` | `'MEDIUM'` | Angular date format shortcut |

## Show one date

```html
<lib-time-badge [date]="query().createdAt" [color]="'GRAY'" format="SHORT" />
```

## Show a duration

```html
<lib-time-badge
  [date]="step().startedAt"
  [dateTo]="step().finishedAt"
  [calcDuration]="true"
/>
```

If `dateTo` is missing, the component treats it like an active run and keeps updating every second.

## What happens on missing or broken data

- no `date`: shows `N/A`
- invalid date: shows `Invalid Date`
- broken duration input: falls back safely instead of crashing the template

That makes it a better default than repeating inline date formatting everywhere.

## Use it for

- created and updated timestamps
- run start and finish times
- elapsed time on active jobs
- compact tables where a full date field would look noisy
