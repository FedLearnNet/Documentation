# `lib-closeable-dialog-title`

`lib-closeable-dialog-title` is the standard dialog header with a title, a close button, and an optional maximize toggle.

Use it when a dialog should feel like the rest of the app instead of each feature inventing its own header row.

## Import

```ts
import { CloseableDialogTitleComponent } from '@shared-lib/components/closeable-dialog-title/closeable-dialog-title.component';
```

## Inputs and output

| Name | Kind | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `title` | input | `string` | required | Dialog title text |
| `allowMaximize` | input | `boolean` | `true` | Shows or hides maximize button |
| `maximizedChanged` | output | `boolean` | n/a | Emits current maximize state |

## Default usage

```html
<lib-closeable-dialog-title title="Edit connector"></lib-closeable-dialog-title>
```

## With maximize handling

```html
<lib-closeable-dialog-title
  title="Workflow details"
  [allowMaximize]="true"
  (maximizedChanged)="setFullscreen($event)"
/>
```

The component manages the toggle state internally and emits the new state so the dialog wrapper can react.
