# `lib-info-grid`, `lib-info-item`, and `lib-status-title`

These three usually belong together when a detail screen needs structure, not just individual facts.

## Mental model

- `lib-info-grid` = the section
- `lib-info-item` = one fact inside the section
- `lib-status-title` = the section or dialog header when the whole thing has a status

## `lib-info-grid`

Use it to group a few related facts under one title.

```ts
import { InfoGridComponent } from '@shared-lib/components/info-grid/info-grid.component';
```

Input:

| Input | Type | Required |
| --- | --- | --- |
| `title` | `string` | yes |

Example:

```html
<lib-info-grid title="Details">
  <lib-info-item title="Started At">
    <lib-time-badge [date]="experiment().startedAt" />
  </lib-info-item>

  <lib-info-item title="Finished At">
    <lib-time-badge [date]="experiment().finishedAt" />
  </lib-info-item>
</lib-info-grid>
```

## `lib-info-item`

Use it inside `lib-info-grid` for one fact.

```ts
import { InfoItemComponent } from '@shared-lib/components/info-item/info-item.component';
```

Input:

| Input | Type | Required |
| --- | --- | --- |
| `title` | `string` | yes |

The value comes through `ng-content`, so you can pass text, badges, time badges, or custom markup.

## `lib-status-title`

Use it for a detail header that should show both a title and the current state.

```ts
import { StatusTitleComponent } from '@shared-lib/components/status-title/status-title.component';
```

Input:

| Input | Type | Required |
| --- | --- | --- |
| `type` | `StatusBadeType` | no |

Example:

```html
<lib-status-title [type]="runStatusToBadgeStatus(detail.stepStatus!)">
  #{{ node.nodeId }} {{ name }}
</lib-status-title>
```

## When this layout works well

- dialog detail views
- run or workflow summaries
- experiment metadata
- read-only overview screens

## When it does not

Do not force it into forms or dense editable UIs. It is for readable summaries, not input-heavy screens.
