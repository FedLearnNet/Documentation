# `lib-status-badge`

`lib-status-badge` is the state-aware version of `lib-badge`.

It already knows the common execution states used in this repo, maps them to icons, and formats the label.

## Import

```ts
import {
  StatusBadeType,
  StatusBadgeComponent,
} from '@shared-lib/components/status-badge/status-badge.component';
```

## Supported types

- `SUCCESS`
- `FAILED`
- `RUNNING`
- `PENDING`
- `WARNING`
- `INIT`
- `STOPPED`

## Inputs

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `type` | `StatusBadeType` | none | Drives color and icon |
| `text` | `string` | none | Optional override text |
| `size` | `'X-SMALL' \| 'SMALL' \| 'MEDIUM' \| 'LARGE'` | `'MEDIUM'` | Badge size |
| `animate` | `boolean` | `true` | Usually keep this on for live states |
| `noText` | `boolean` | `false` | Icon-only variant |
| `width` | `number \| null` | `null` | Fixed width in pixels |
| `border` | `boolean` | `false` | Border variant |

## Default usage

```html
<lib-status-badge
  [type]="projectStatusToBadgeStatus(experiment().experimentStatus!)"
  [text]="experiment().experimentStatus!"
  size="SMALL"
/>
```

## Practical notes

- Prefer `type` even if you also pass `text`. The type gives you the right icon and color.
- Pass `text` when the backend value is worth showing directly.
- Use `noText` only when the surrounding layout already explains the state.

## When to choose this over `lib-badge`

Pick `lib-status-badge` when the value is a real system state. Pick `lib-badge` when it is just a tag.
