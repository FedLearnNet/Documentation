# `lib-hint-card`

`lib-hint-card` is the shared empty-state / helper box.

It is useful when the screen is valid but there is nothing to show yet, or when the user needs one obvious next step.

## Import

```ts
import { HintCardComponent } from '@shared-lib/components/hint-card/hint-card.component';
```

## Inputs and outputs

| Name | Kind | Type | Notes |
| --- | --- | --- | --- |
| `hintButtonText` | input | `string` | Shows a primary button |
| `hintLink` | input | `string` | Adds a router link button |
| `hintClicked` | output | `boolean` | Fires when the primary button is clicked |

## Simple usage

```html
<lib-hint-card>There are no HyperParams</lib-hint-card>
```

## With an action

```html
<lib-hint-card
  hintButtonText="Create config"
  (hintClicked)="openCreateDialog()"
>
  No config selected yet.
</lib-hint-card>
```

## Use it for

- empty lists
- missing optional sections
- "nothing selected yet" states
- a small nudge toward the next action

Keep the message short. If the screen needs a full explanation, use a dedicated feature component instead.
