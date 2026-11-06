# Changelog

## Unreleased

## 0.1.1 — 2026-11-06

- `STYLEGUIDE.md`: the colour-role table maps `--tc-color-surface` to surface
  and `--tc-color-surface-muted` to surface-container, matching their values;
  the note on the shell's `--tc-*` defaults now describes what the shell does.
- `README.md`: consumers fetch only the styleguide submodule
  (`git submodule update --init --depth 1 styleguide`), not `submodules: true`,
  which fails on a private submodule.

## 0.1.0 — 2026-11-06

- `STYLEGUIDE.md`: Material 3 + WCAG 2.2 AA as the base, the four principles,
  accessibility checks for the design step, deviations from Material 3 with
  the colour-role mapping, spacing, defaults, buttons and writing.
- `tokens/`: the non-colour `--platform-*` tokens — spacing (4–64 px), the
  Material 3 type scale, default corner radius, `--platform-widget-gap`.
  Every existing shell name and value is kept.
- `patterns/widget-layout.md`: the standard widget layout.
- `CHECKLIST.md`: design, mechanical and review criteria.
