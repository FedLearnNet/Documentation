# `lib-error-card`

`lib-error-card` is the shared fallback for problems the user should notice.

It is heavily reused because most feature screens need the same three things:

- show a readable error message
- avoid dumping raw backend objects into the template
- optionally give the user one next action

## Import

```ts
import { ErrorCardComponent } from '@shared-lib/components/error-card/error-card.component';
```

## Inputs and output

| Name | Kind | Type | Notes |
| --- | --- | --- | --- |
| `errorObject` | input | `string \| object \| null \| undefined` | Main error source |
| `oopsError` | input | `string` | Short direct message |
| `showOops` | input | `boolean` | Adds the "OOPS something went wrong" wrapper text |
| `warningButtonText` | input | `string` | Shows an action button |
| `showAnimation` | input | `boolean` | Plays the embedded error animation |
| `warningClicked` | output | `boolean` | Fired when the button is clicked |

## What it does for you

`lib-error-card` already tries to normalize a few common backend error shapes:

- plain strings
- objects with a `message` field
- OAuth-like `error_description`
- shared `ErrorResponseDTO`
- `HttpErrorResponse`-like objects
- JSON strings that need parsing first

That means most screens can just pass the error object directly.

## Default usage

```html
<lib-error-card [errorObject]="err"></lib-error-card>
```

## Static warning message

```html
<lib-error-card>
  No App found
</lib-error-card>
```

Use projected content when there is no backend error object and the message is just part of the screen logic.

## With an action

```html
<lib-error-card
  warningButtonText="Specify"
  (warningClicked)="routeToPage('overview')"
>
  Project settings are incomplete.
</lib-error-card>
```

## `oopsError` vs `errorObject`

- Use `errorObject` for real errors coming from services or HTTP calls.
- Use `oopsError` for a short custom message when you still want the built-in "reload and try again" wording.

```html
<lib-error-card
  [oopsError]="'No Project found'"
  [showOops]="true"
/>
```

## When not to use it

Do not use `lib-error-card` for tiny inline form validation under one field. It is for section-level or screen-level feedback.
