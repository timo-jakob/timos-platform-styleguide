# Platform UI styleguide — design

Date: 2026-11-06 · Status: draft for approval

## Intent and why

The platform's UIs (shell, widget gallery, Trustcenter widgets, admin UIs) have
no shared rules for layout. Each widget picks its own gaps, alignment and type
sizes, and widgets open on an empty or partial view that needs several clicks
before it answers anything. The vulnerability overview widget is the trigger:
filters, counts and lists sit on different baselines with different gaps, and
nothing useful shows until segment › product › module are chosen.

We do not want to invent web UI design. We adopt an established system and
write down only what is ours.

## Goals

1. One place that states how a platform UI should look and behave — design,
   usage and review criteria, not implementation.
2. Three principles, owned by the product owner:
   - **Aligned.** Every component sits on a shared grid; edges and baselines
     line up.
   - **Defined distances.** Spacing comes only from a fixed scale; no ad-hoc
     pixel values.
   - **Fewest clicks to the answer.** Every view opens on a useful default and
     shows content without any interaction. Filters narrow; they are never
     required to see something.
3. **WCAG 2.2 AA is a must, from day one** (product owner). Accessibility
   conformance is a procurement requirement.
   It is a criterion at every step: designing, building, CI, review.
4. A small tokens file so the rules are machine-readable and usable from code.
   It becomes the single source of the platform's non-colour `--platform-*`
   tokens (spacing, type scale, default radius).
5. Included in every UI repo, version-pinned, so people and Claude read it
   before building UI.

## Non-goals

- No component library, no React/Web Component code, no build tooling. (May
  come later, once two UIs clearly need the same component.)
- No colour values, logos or images. These come from whitelabel-center (M5),
  whose design is not settled yet.
- No enforcement tooling inside the styleguide repo. Enforcement is rolled out
  by bootstrap in the plugin repo (see "Checking conformance in CI").
- Not a copy of Material Design 3. We link to it.

## Anti-goals (would be a failure even if delivered)

- A long document nobody reads. Prefer short rules + links + a checklist.
- Rules that contradict Material 3 without saying so.
- Colour or font-family values hard-coded here that later fight the white-label
  theme.

## Decisions (made by the product owner)

- **New repository**, not timos-platform-docs, not platform-infra.
- **Base system: Material Design 3** (m3.material.io) usage guidelines, plus
  **WCAG 2.2 AA**. Chosen over IBM Carbon because the products already use
  Material and it reads as more modern; judged fine for B2B.
- **Content: written rules + a tokens file.** Design, usage and criteria; not
  implementation.
- **Inclusion: git submodule pinned to a tag** in each UI repo, the same pattern
  as `platform-docs`; each repo's CLAUDE.md points at it.
- Colours and images come from whitelabel-center later.

## Repository

- Name: `timos-platform-styleguide` (GitHub `timo-jakob/`, **public** — product owner decision: it holds no brand values or secrets, and consumers build from it, so CI fetches it without credentials). Name is Claude's call.
  Consumer workflows that build fetch only this submodule (`git submodule update --init --depth 1 styleguide`).
- Consumers (submodule path `styleguide/`): dashboard-frontend, widget-gallery,
  trustcenter-frontend, whitelabel-center (admin UI). *Claude's guess at the
  list, confirmed by the product owner.*
- Versioning: semver git tags (`v0.1.0` first). Consumers bump deliberately.
  A change that makes existing compliant UI non-compliant is a major bump.

### Layout

```text
README.md                 what this is, how to include it, how to read it
STYLEGUIDE.md             the normative document (sections below)
tokens/tokens.css         CSS custom properties (no colours)
tokens/tokens.json        the same values, machine-readable (W3C design-tokens format)
patterns/widget-layout.md the standard widget layout
CHECKLIST.md              review criteria for a screen / PR
CHANGELOG.md
```

## STYLEGUIDE.md — contents

1. **Base and precedence.** Material Design 3 + WCAG 2.2 AA apply unless this
   document says otherwise. Precedence: this styleguide › Material 3 ›
   personal taste. Link to the relevant M3 pages (layout, spacing, typography,
   shape, buttons, dialogs, cards, chips, search, data tables/lists, empty
   states, writing/content design).
2. **Principles** — the three above plus **Accessible (WCAG 2.2 AA, mandatory)**,
   each with a one-line "how to check it".
2a. **Accessibility in the design step.** A mockup or design spec is not
   approved until it has been checked against AA *before* anything is built:
   - contrast of every text and UI element (4.5:1 text, 3:1 large text and
     UI components/focus indicators), checked against the colour roles used;
   - colour never the only signal (severity, status);
   - target size ≥ 24×24 px (2.5.8);
   - visible focus that is not hidden by sticky/overlay content (2.4.7, 2.4.11);
   - full keyboard path through the default view and every action, in a
     logical order;
   - text resizable to 200 % and reflow at 320 px width without loss (1.4.4,
     1.4.10);
   - names/labels for every control, headings that describe structure;
   - no drag-only interactions (2.5.7), no re-entering data already given
     (3.3.7), consistent help placement (3.2.6).
   These are the `design` items in `CHECKLIST.md`.
3. **Deviations from Material 3** — explicit list:
   - **M3 is the design and usage reference, not a component library.** No
     platform UI uses a Material library; hand-built components follow M3's
     anatomy, states and usage rules. Not using `@material/web` is not a
     deviation.
   - Colour: use M3 colour **roles** (primary, on-primary, surface,
     surface-container, outline, error, …) by name; values come from the
     white-label theme. Until M5, apps keep their existing tokens; a mapping
     table M3 role → `--platform-color-*` (shell) → `--tc-color-*`
     (Trustcenter widget contract) is included. *Claude's call:* both sets in
     one table.
   - Typography: M3 type **scale** (sizes, line heights, weights) applies; the
     **font family** comes from the white-label theme.
   - Data density: B2B data views may use M3's compact density.
   - Status/severity colours (critical, high, …) are a platform addition to M3
     roles and must always carry a label or symbol besides colour (already
     practised in the Trustcenter).
4. **Spacing and alignment.** 4px baseline; spacing scale 4, 8, 12, 16, 24,
   32, 40, 48, 64. Within a component: 4–12. Between components: 16. Between
   sections/regions: 24. A widget's outer padding belongs to the shell's card;
   the widget adds none. Every row of controls shares
   one baseline and one height.
5. **Defaults and clicks.** Every view defines its default state in its spec;
   the default must show content. Choosing is optional; a reset to default is
   always one click.
6. **Buttons and actions.** Follow M3; restated briefly: one primary action per
   view; labels are verb (+ noun), sentence case; placement per M3.
7. **Writing.** Sentence case, no jargon, numbers as digits; empty states say
   what is empty and why.

## tokens/tokens.css — contents

**Decision (product owner): the styleguide becomes the home of the existing
`--platform-*` token names.** Today they live in
`dashboard-frontend/src/styles/tokens.css` (versioned by
`--platform-tokens-version`, enforced by the shell's stylelint rule, platform
design §6.3). The styleguide takes over the non-colour tokens; the shell then
imports them from the submodule instead of defining them. One set of names,
one source.

Rules:

- **Keep every existing name and value.** No renames, no removals (those would
  bump `--platform-tokens-version` and break consumers). Additions only.
- Spacing: existing `--platform-space-xs|sm|md|lg|xl` (4, 8, 16, 24, 32) plus
  the missing M3 steps 12, 40, 48, 64. Names for the new steps are the
  builder's call, consistent with the existing pattern.
- Type scale (new): M3 roles `display|headline|title|body|label` ×
  `large|medium|small` → size, line-height, weight. Font **family** stays a
  theme token, not a styleguide value.
- Corner radius: existing `--platform-radius-sm|md|lg|pill` (4, 6, 8, pill)
  kept as **defaults the theme may override** — radius is tenant-themed, like
  colour and font (shell stylelint, §6.3). *Claude's call:* keep 6px rather
  than force the M3 scale, to avoid a visible change everywhere.
- Widget layout: `--platform-widget-gap` (16) for gaps between regions inside a
  widget. *Claude's call:* the **shell's card owns the outer padding**; widgets
  add none, so padding never doubles.
- No colour values and no font stacks in the styleguide. Colour tokens and the
  font families stay in the shell (later: whitelabel-center).

`tokens.json` carries the same values; the two must not drift (a test or
script check is the builder's call).

### Shell migration (part of this project)

One PR in dashboard-frontend: add the submodule, import
`styleguide/tokens/tokens.css`, delete the moved non-colour definitions from
`src/styles/tokens.css`, keep the stylelint rule working (the `--platform-`
prefix is unchanged, so it should). Rendered output must be unchanged.

## patterns/widget-layout.md

The standard widget, from the chosen vulnerability-overview layout:

1. Title.
2. **Filter row**: one line, chips/selects + search, "as of" right-aligned;
   wraps on narrow widths, keeps one control height.
3. **Count tiles** (optional): equal-width tiles in one row.
4. **Content**: cards grid, table or list. Cards sorted most-severe first when
   they show risk; empty items are shown, not hidden.
5. Detail opens in place with a visible "back".

Includes an annotated wireframe with spacing values.

## CHECKLIST.md

Yes/no criteria a reviewer (human or Claude) can apply: aligned edges, only
scale spacing, default shows content, one primary action, labels follow
writing rules, colour never the sole signal, WCAG AA contrast and keyboard
reachability, component follows M3 anatomy/usage or the deviation is listed,
only `--platform-*` tokens for spacing, radius, type.

## Inclusion in consumers

Per consumer repo, one PR: add the submodule at `styleguide/` pinned to the
tag, and a CLAUDE.md section "Read `styleguide/STYLEGUIDE.md` before UI
changes; check `styleguide/CHECKLIST.md` before declaring UI work done."
The shell imports `tokens.css` in this project (see Shell migration). Other
consumers import it when they first use the tokens (the vulnerability widget
redesign is the first). widget-gallery and whitelabel-center are still
scaffolds: they get only the submodule and the CLAUDE.md pointer for now.

## Checking conformance in CI (product owner request)

The styleguide itself stays rules + tokens. The **checks** that enforce it in
frontend repos are rolled out by `/development:bootstrap`
(timos-claude-code-plugins), generated from the styleguide's `tokens.json`, so
the rules and the checks cannot drift. What can and cannot be machine-checked:

| Rule | Check | Mechanical? |
|---|---|---|
| Defined distances / radius / type | **stylelint**: `margin*`, `padding*`, `gap`, `inset*`, `border-radius`, `font-size`, `line-height`, `font-weight` accept only `0` or `var(--platform-…)`. Extends the shell's existing rule. | yes |
| Same, in inline React styles | **ESLint**: the same properties in JSX `style` objects / style constants reject raw numbers and `px` strings. Needed because Trustcenter widgets style inline, which stylelint never sees. | yes |
| Only real tokens | Script: every `var(--platform-…)` used exists in the pinned `tokens.json`. | yes |
| WCAG 2.2 AA | **axe-core** (already a dev dependency in shell and Trustcenter) in component and Playwright tests, run with the WCAG 2.0/2.1/2.2 A+AA tag sets. **Active from the start in warn mode** (see below). | partly (axe finds ~⅓ of WCAG issues; the rest is the design step + review) |
| Default view shows content | Playwright test per view/widget: load with mocked data, assert content is visible **without any interaction**. Bootstrap ships the template; presence per widget is a review item. | yes, per test |
| Styleguide version current | Renovate bumps the `styleguide` submodule like any dependency. | yes |
| Aligned, one primary action, wording | **Review**: the review/approver panel checks the diff against `CHECKLIST.md`. Alignment could later get a Playwright bounding-box helper (controls in one row share top and height). | no (judgment) |

### Accessibility gate: warn now, block later (product owner)

- The axe check runs in every frontend repo **from the start**.
- Phase 1 — **warn**: violations do not fail the build but are never silent:
  each one appears as a CI annotation on the PR and in the job summary with
  rule, element and WCAG criterion.
- Phase 2 — **block**: the same check fails the build. One switch per repo
  (e.g. `a11y: warn | block` in the bootstrap config), no code change needed.
- *Claude's call:* a repo is switched to `block` once its main branch has zero
  violations; the product owner sets the date for all repos. Until then the
  warning count per repo is visible so progress can be tracked.
- The `review` panel treats an AA violation as a finding even in warn mode.

These land in the plugin repo as issues (below); this project only makes sure
`tokens.json` and `CHECKLIST.md` are shaped so those checks can consume them
(stable token names, one checklist item per line, each tagged `design`,
`mechanical` or `review`).

### Issues to file in timos-claude-code-plugins

1. **bootstrap: include the platform styleguide in UI repos** — submodule at
   `styleguide/`, CLAUDE.md pointer, Renovate submodule bumps.
2. **bootstrap: token lint gate for UI repos** — stylelint + ESLint inline-style
   rule + unknown-token check, generated from `styleguide/tokens/tokens.json`,
   wired into pre-commit and CI.
3. **bootstrap: WCAG 2.2 AA gate (warn → block) and default-view test
   templates** — axe with WCAG A+AA tags (2.0–2.2) in component + Playwright
   tests; warn mode with PR annotations and job summary, per-repo switch to
   block; Playwright template that asserts a view shows content without
   interaction.
4. **review: check UI diffs against the styleguide checklist** — the
   react/javascript review panel (and approver) reads `styleguide/CHECKLIST.md`
   for the `review` items.

## Left to the builder

- Exact wording and length of each section (keep it short).
- Which M3 pages to link per section.
- Tokens.json/tokens.css drift check mechanism.
- Repo bootstrap (CI, markdown lint) using the existing org tooling.

## Follow-ups (not in this project)

- Vulnerability overview redesign (layout B) built on this styleguide.
- The CI conformance checks (issues 1–4 above, built in the plugin repo).
- Mapping M3 colour roles to the whitelabel-center theme API (M5).
