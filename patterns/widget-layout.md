# Widget layout

The standard layout for a dashboard widget. It comes from the vulnerability
overview, where the product owner chose a product-card layout. A widget that
needs a different layout says why in its spec.

## Regions, top to bottom

1. **Title** — the widget's name, `--platform-type-title-large-*`.
2. **Filter row** — one line: filters as chips or selects, then the search,
   then "As of" right-aligned. Every control has the same height and sits on
   one baseline. Filters start at their default ("All", or "Latest" for
   versions) and only narrow. On narrow widths the row wraps; controls keep
   their height. Gap between controls: `--platform-space-sm`.
3. **Count tiles** (optional) — equal-width tiles in one row, each a number
   above its label. Gap: `--platform-space-sm`.
4. **Content** — a grid of cards, a table or a list. When the content shows
   risk, it is sorted most severe first. Items with nothing to report are
   shown, not hidden, so "clean" is visible. Cards in a grid: gap
   `--platform-space-md`.
5. **Detail** — opens in place of the content, with a visible "Back" that
   returns to the default view in one click.

Between regions: `--platform-widget-gap`. The widget adds no outer padding;
the shell's card owns it ([rule](../STYLEGUIDE.md#spacing-and-alignment)).

## Wireframe

```text
┌ shell card (owns the outer padding) ─────────────────────────────────┐
│ Vulnerability overview                       title-large             │
│                                              ↕ --platform-widget-gap │
│ [Segment: All ▾] [Version: Latest ▾] [🔍 Search a CVE ]   As of …    │
│   ↔ --platform-space-sm between controls, one height, one baseline   │
│                                              ↕ --platform-widget-gap │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                         │
│ │  42  │ │   3  │ │  11  │ │   5  │ │   2  │  equal-width tiles      │
│ │ CVEs │ │ Crit │ │ High │ │ ? Inv│ │ ! Aff│  ↔ --platform-space-sm  │
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘                         │
│                                              ↕ --platform-widget-gap │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                   │
│ │ Product  9.3 │ │ Product  4.0 │ │ Product  2.7 │  most severe first│
│ │ ████░░░░░░░░ │ │ ███░░░░░░░░░ │ │ █░░░░░░░░░░░ │  ↔ --platform-space-md
│ │ 2 crit 4 high│ │ 1 crit 5 high│ │ 0 crit 2 high│                   │
│ └──────────────┘ └──────────────┘ └──────────────┘                   │
└──────────────────────────────────────────────────────────────────────┘
```

## Accessibility

- The filter row comes first in the keyboard order, then the tiles, then the
  content; a card is one focusable control that opens its detail.
- Severity bars and counts carry text labels; colour is never the only signal.
- The default view is what the automated accessibility scan checks.

See [CHECKLIST.md](../CHECKLIST.md) for the full criteria.
