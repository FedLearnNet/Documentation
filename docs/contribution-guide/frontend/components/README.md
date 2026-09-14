# Simple UI components

These are the shared-lib pieces that are cheap to reuse and easy to understand.

## Start with these

- `lib-kv`
  Use it for label/value pairs inside cards, dialogs, detail views, and compact metadata sections.
- `lib-badge`
  Use it for small tags, categories, and lightweight metadata.
- `lib-status-badge`
  Use it when the value is an execution state and the color should come from the state type.
- `lib-time-badge`
  Use it when you need consistent date or duration display.
- `lib-info-grid` + `lib-info-item`
  Use them when a detail page needs a clean group of facts.
- `lib-status-title`
  Use it when a detail header needs both a title and a visible run state.
- `lib-hint-card`
  Use it for empty states and "what should I do next" messages.

## Simple rule of thumb

- one fact: `lib-kv`
- one tag: `lib-badge`
- one state: `lib-status-badge`
- one date or duration: `lib-time-badge`
- a grouped detail section: `lib-info-grid`
- an empty state with an action: `lib-hint-card`

If a screen needs several of these together, that is normal. The repo already does that in run details, project details, and config cards.
