# Platform UI styleguide

The rules every platform UI follows: the shell, the widget gallery, the
widgets and the admin UIs. Short on purpose: where Material 3 already says
it, we link instead of repeating.

## Base and precedence

- **[Material Design 3](https://m3.material.io/)** is the design and usage
  reference: anatomy, states, behaviour and wording of components.
- **[WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/)** is mandatory for every
  screen. Accessibility conformance is a procurement requirement; a screen
  that fails AA is not done.
- Precedence: **this styleguide › Material 3 › personal taste.** Where we
  differ from Material 3, the difference is listed under
  [Deviations from Material 3](#deviations-from-material-3); anything not
  listed there follows Material 3.

## Principles

| Principle | What it means | How to check it |
|---|---|---|
| **Aligned** | Every component sits on a shared grid; edges and baselines line up. | Draw a vertical line along the left edge of each region and a horizontal line through each row of controls: everything touches a line. |
| **Defined distances** | Spacing comes only from the token scale; no ad-hoc pixel values. | Every margin, padding and gap is a `--platform-space-*` or `--platform-widget-gap` token. |
| **Fewest clicks to the answer** | Every view opens on a useful default and shows content without any interaction. Filters narrow; they are never required to see something. | Open the view and do nothing: it already answers its main question. |
| **Accessible (WCAG 2.2 AA, mandatory)** | Every screen meets AA, checked while designing, building, in CI and in review. | The `design` items in [CHECKLIST.md](CHECKLIST.md) pass before building; the CI accessibility scan and the `review` items pass before merging. |

## Accessibility in the design step

A mockup or design spec is not approved until it has been checked against
WCAG 2.2 AA **before** anything is built:

- **Contrast:** 4.5:1 for text, 3:1 for large text, UI components and focus
  indicators (1.4.3, 1.4.11), checked against the colour roles the design uses.
- **Colour is never the only signal** (1.4.1): severity and status always
  carry a label or symbol as well.
- **Target size** at least 24×24 px, or enough spacing around it (2.5.8).
- **Visible focus** that sticky headers or overlays never hide (2.4.7, 2.4.11).
- **Keyboard:** the default view and every action can be reached and used
  with the keyboard alone, in a logical order (2.1.1, 2.4.3).
- **Resize and reflow:** text resizes to 200 % and the layout reflows at
  320 px width without losing content or function (1.4.4, 1.4.10).
- **Names and structure:** every control has a visible label or an accessible
  name; headings describe the structure (1.3.1, 2.4.6, 4.1.2).
- **No drag-only interactions** (2.5.7), **no re-entering data already
  given** (3.3.7), **help in a consistent place** (3.2.6).

Material 3's [accessibility guidance](https://m3.material.io/foundations)
covers the component-level details.

## Deviations from Material 3

- **Reference, not a component library.** No platform UI uses a Material
  library; hand-built components follow Material 3's anatomy, states and
  usage. Not using `@material/web` is not a deviation.
- **Colour values come from the theme.** We use Material 3's
  [colour roles](https://m3.material.io/styles/color) by name; the values come
  from the theme (the shell today, whitelabel-center later). Until then, use
  the existing tokens in this table:

  | Material 3 role | Shell (`--platform-*`) | Trustcenter widget (`--tc-*`) |
  |---|---|---|
  | primary | `--platform-color-primary` | `--tc-color-primary` |
  | on-primary | `--platform-color-primary-contrast` | — |
  | surface | `--platform-color-background` | `--tc-color-bg`, `--tc-color-surface` |
  | surface-container | `--platform-color-surface` | `--tc-color-surface-muted` |
  | on-surface | `--platform-color-text` | `--tc-color-text` |
  | on-surface (headings) | `--platform-color-text-heading` | `--tc-color-heading` |
  | on-surface-variant | `--platform-color-text-muted` | — |
  | outline-variant | `--platform-color-border` | `--tc-color-border` |
  | focus indicator (primary) | `--platform-color-focus-ring` | `--tc-color-focus` |
  | error | `--platform-color-danger` | — |
  | tertiary | `--platform-color-accent` | — |

  **Platform additions** with no Material 3 role: `--platform-color-warning`,
  `--platform-color-success`, `--platform-color-on-brand`, the call-to-action
  pair `--tc-color-cta` / `--tc-color-on-cta`, and the severity
  (`--tc-color-severity-*`) and status (`--tc-color-status-*`) colours.
  Severity and status always carry a label or symbol besides their colour.
  The shell declares its own `--tc-color-*` defaults next to its
  `--platform-color-*` tokens rather than deriving one from the other; deriving
  both from the Material 3 roles comes with the theme work.
- **Font family comes from the theme.** The Material 3
  [type scale](https://m3.material.io/styles/typography) applies (sizes, line
  heights, weights: `--platform-type-<role>-<size>-*`); the family is the
  theme's `--platform-font-family`.
- **Corner radius is themeable.** `--platform-radius-sm|md|lg|pill`
  (4, 6, 8 px, pill) are defaults a theme may override, instead of Material 3's
  fixed [shape scale](https://m3.material.io/styles/shape).
- **Data density.** Data-heavy B2B views may use Material 3's compact density.

## Spacing and alignment

- **4 px baseline.** The scale: `--platform-space-xs` 4 · `-sm` 8 ·
  `-sm-md` 12 · `-md` 16 · `-lg` 24 · `-xl` 32 · `-2xl` 40 · `-3xl` 48 ·
  `-4xl` 64 px. See Material 3 [layout](https://m3.material.io/foundations).
- **Within a component** (icon to label, label to field): 4–12 px.
- **Between components** (control to control, card to card): 16 px
  (`--platform-space-md`).
- **Between sections or regions** (filter row to content): 24 px
  (`--platform-space-lg`); inside a widget use `--platform-widget-gap`.
- **Widgets add no outer padding.** The shell's card owns it, so padding never
  doubles.
- **One row, one baseline, one height.** Controls in a row share a baseline
  and a height; labels sit consistently (all above, or all inline) per row.
- Left edges of stacked regions line up; numbers in tables right-align and use
  tabular figures.

## Defaults and clicks

- Every view's spec names its **default state**, and the default shows
  content: no "pick something first" screens.
- Choosing is optional: filters start at "All" (or the most useful value,
  such as "Latest" for versions) and only narrow.
- Returning to the default is always **one click**.
- Detail opens **in place** with a visible way back; prefer it over a new page
  or a dialog when the user is comparing.
- Count the clicks to the view's main answer in the spec. The target is zero.

## Buttons and actions

Follow Material 3 [buttons](https://m3.material.io/components/buttons)
and [dialogs](https://m3.material.io/components/dialogs). In short:

- **One primary action per view.** Other actions are secondary (outlined or
  text buttons).
- **Labels are a verb, plus a noun when needed**, in sentence case: "Save
  changes", "Add widget", never "OK" or "Submit".
- In dialogs, the confirming action is on the right and names what happens
  ("Delete segment"); the dismissing action is "Cancel".
- Destructive actions use the error role and ask for confirmation only when
  the action cannot be undone.

## Writing

Follow Material 3 [content design](https://m3.material.io/foundations). In
short:

- **Sentence case** for everything: titles, labels, buttons.
- Plain words, no internal jargon; numbers as digits.
- **Empty states say what is empty and why**, and what to do next if
  anything ("No published vulnerabilities in this scope.").
- Error messages say what happened and how to fix it; never blame the user.
