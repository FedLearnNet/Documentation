# `lib-skeleton-loader`

`lib-skeleton-loader` is the shared loading placeholder. It is heavily reused because it gives screens a decent loading state without each feature hand-rolling its own shimmer layout.

## Import

```ts
import { SkeletonLoaderComponent } from '@shared-lib/components/skeleton-loader/skeleton-loader.component';
```

## Variants

| Variant | Best for |
| --- | --- |
| `detail` | detail page, dialog body, single card |
| `grid` | card galleries |
| `list` | stacked rows or message-like items |
| `table` | data tables |

## Inputs

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `'detail' \| 'grid' \| 'list' \| 'table'` | `'detail'` | Main layout |
| `showHeader` | `boolean` | `true` | Header placeholder |
| `showActions` | `boolean` | `true` | Action buttons or row pill |
| `cards` | `number` | `3` | Count for grid/list |
| `lines` | `number` | `3` | Content line count |
| `density` | `'comfortable' \| 'compact'` | `'comfortable'` | Spacing |
| `animate` | `boolean` | `true` | Shimmer on or off |
| `shimmerMs` | `number` | `1200` | Shimmer speed input exists in API |
| `roundness` | `number` | `16` | Border radius |
| `title` | `string` | none | Optional static loading title |
| `tableRows` | `number` | `6` | Table body rows |
| `tableCols` | `number` | `5` | Table columns |
| `showTableHeader` | `boolean` | `true` | Table head placeholder |

## Common examples

Detail page:

```html
<lib-skeleton-loader title="Loading your summaries..."></lib-skeleton-loader>
```

List-like content:

```html
<lib-skeleton-loader
  [showHeader]="false"
  variant="list"
  [showActions]="false"
/>
```

Dense table:

```html
<lib-skeleton-loader
  variant="table"
  [showHeader]="false"
  [tableRows]="8"
  [tableCols]="4"
/>
```

## Practical rules

- Match the variant to the final layout so the page does not jump around too much.
- Turn `showHeader` off when the parent page already has a real header.
- Use compact density when the final UI is dense.
- Keep the loading title short. It should reassure, not explain the whole feature.

## Common pairing

This component often sits right next to `lib-error-card`:

1. show skeleton while loading
2. show error card if loading fails
3. show real content when data arrives

That is one of the most common screen-state patterns in this repo.
