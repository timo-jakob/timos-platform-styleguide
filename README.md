# timos-platform-styleguide

Design and usage rules for every platform UI, and the non-colour
`--platform-*` design tokens (spacing, type scale, default corner radius).
No application code lives here.

The base is [Material Design 3](https://m3.material.io/) as a design and
usage reference (not a component library), plus
[WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/), which is mandatory.

## Principles

- **Aligned.** Every component sits on a shared grid; edges and baselines line up.
- **Defined distances.** Spacing comes only from the token scale; no ad-hoc pixel values.
- **Fewest clicks to the answer.** Every view opens on a useful default and shows content without any interaction.
- **Accessible (WCAG 2.2 AA, mandatory).** Checked when designing, building, in CI and in review.

## Reading order

1. [`STYLEGUIDE.md`](STYLEGUIDE.md) — the rules.
2. [`patterns/`](patterns/) — our own layouts, starting with the widget layout.
3. [`CHECKLIST.md`](CHECKLIST.md) — the criteria a design, a build and a review are checked against.
4. [`tokens/`](tokens/) — `tokens.json` is the source; `tokens.css` mirrors it.

## Including it in a UI repository

Add it as a submodule at `styleguide/` and pin it to a release tag:

```sh
git submodule add https://github.com/timo-jakob/timos-platform-styleguide.git styleguide
git -C styleguide checkout v0.1.0
git add .gitmodules styleguide
```

Workflows that build the UI fetch this submodule, and only this one, right
after `actions/checkout`:

```yaml
- name: fetch the styleguide submodule
  run: git submodule update --init --depth 1 styleguide
```

Don't use `submodules: true` on `actions/checkout`: it fetches every
submodule, and a private one (such as `platform-docs`) fails without
credentials. Import the tokens before the repository's own theme tokens, so a
theme can still override the defaults:

```ts
import "../styleguide/tokens/tokens.css";
import "./styles/tokens.css";
```

Add to the repository's `CLAUDE.md`: read `styleguide/STYLEGUIDE.md` before
UI changes; check `styleguide/CHECKLIST.md` before declaring UI work done.

Colours, logos and font families are not defined here; they come from the
theme (the shell today, whitelabel-center later).

## Versioning

Semver tags. Adding a token or a rule that existing compliant UI already
meets is a minor release; renaming or removing a token, or a rule that makes
existing compliant UI non-compliant, is a major release.

## Development

```sh
npm ci
npm run lint   # markdownlint
npm test       # tokens, docs and checklist checks
```

All rights reserved.
