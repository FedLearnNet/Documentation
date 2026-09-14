# `lib-kv`

`lib-kv` is the shared lib's simplest detail component. It renders one label and one value in a small card-like block.

Use it when the UI is basically "show a fact", not "build a full widget".

## What it is good at

- metadata in detail pages
- config summaries
- dialog content
- compact cards with several facts next to each other

## Import

Inside this workspace:

```ts
import { KvComponent } from '@shared-lib/components/kv/kv.component';
```

Add it to the component `imports` array because it is standalone.

```ts
@Component({
  // ...
  imports: [KvComponent],
})
export class ExampleComponent {}
```

## Inputs

| Input | Type | Required | What it does |
| --- | --- | --- | --- |
| `label` | `string` | yes | Small uppercase label shown above the value |
| `value` | `string \| number \| null \| undefined` | no | Plain text value |
| `mono` | `boolean` | no | Slightly more code-like value styling |
| `multiline` | `boolean` | no | Lets long content wrap |
| `border` | `boolean` | no | Turns the outer border on or off |

## Default usage

```html
<lib-kv label="Commit" [value]="publishInfo().commitHash"></lib-kv>
```

That is the normal case. If the value is just text or a number, keep it this simple.

## When the value is not plain text

If `value` is empty, `lib-kv` falls back to projected content. That is how you can put a badge or custom markup inside it.

```html
<lib-kv label="Status">
  <lib-status-badge
    [type]="runStatusToBadgeStatus(run.status)"
    [text]="run.status"
    size="SMALL"
  />
</lib-kv>
```

That pattern is already used in this repo and is the main reason `lib-kv` stays useful without growing a huge API.

## Long content

For descriptions, logs, or error text, turn on wrapping:

```html
<lib-kv
  label="Description"
  [value]="config.description"
  [multiline]="true"
/>
```

## Small flags that matter

- Use `mono` for ids, shapes, hashes, or anything that reads like code.
- Use `multiline` for text that should wrap.
- Use `[border]="false"` when the parent card already provides enough framing.

## Good examples from this repo

- run detail facts
- tool config cards
- pipeline publish metadata
- experiment summaries

## When not to use it

Skip `lib-kv` if:

- the content is mostly interactive
- the value needs a whole layout of its own
- the section really wants grouped facts, not independent tiles

In those cases, use `lib-info-grid` or a feature-specific component instead.
