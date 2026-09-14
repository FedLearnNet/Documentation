# `lib-badge`

`lib-badge` is the generic small tag component.

Use it for labels like type, mode, category, environment, or lightweight counters. If the color should be driven by a real execution state, use `lib-status-badge` instead.

## Import

```ts
import { BadgeComponent } from '@shared-lib/components/badge/badge.component';
```

## Inputs that matter most

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | `string` | required | Badge label |
| `color` | `'GREEN' \| 'GRAY' \| 'RED' \| 'ORANGE' \| 'BLUE' \| 'WHITE'` | `'GREEN'` | Visual tone |
| `size` | `'X-SMALL' \| 'SMALL' \| 'MEDIUM' \| 'LARGE'` | `'SMALL'` | Compactness |
| `iconName` | `string` | none | Optional Material icon |
| `border` | `boolean` | `false` | Adds border emphasis |
| `pulseCircle` | `boolean` | `false` | Small live-state dot |
| `wrap` | `boolean` | `false` | Allows longer badge content |
| `uppercase` | `boolean` | `false` | Keeps the text as-is instead of title-casing it |

## Common usage

```html
<lib-badge
  text="Required"
  color="RED"
  size="SMALL"
  [border]="true"
  [uppercase]="true"
/>
```

## Use it for

- app type labels
- required or optional markers
- compact tags in cards
- metadata chips that do not need business logic

## Do not use it for

- `SUCCESS`, `FAILED`, `RUNNING` style states
- date formatting
- full empty-state callouts

That is what `lib-status-badge`, `lib-time-badge`, and `lib-hint-card` are for.
