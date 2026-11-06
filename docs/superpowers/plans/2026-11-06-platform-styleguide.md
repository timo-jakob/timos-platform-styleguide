# Platform UI Styleguide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the public `timos-platform-styleguide` repo (rules + non-colour `--platform-*` tokens), release `v0.1.0`, migrate the shell to take its tokens from it, and point every UI repo at it.

**Architecture:** A docs-plus-tokens repo with no runtime code. `tokens/tokens.json` (W3C Design Tokens format) is the source; `tokens/tokens.css` mirrors it and a Node test proves they match. Consumers include the repo as a submodule at `styleguide/`; the shell imports `styleguide/tokens/tokens.css` ahead of its own colour/font `tokens.css`.

**Tech Stack:** Markdown, CSS custom properties, Node 22 (`node --test`, no dependencies), markdownlint-cli2, GitHub Actions, git submodules, Dependabot `gitsubmodule`.

**Spec:** `docs/superpowers/specs/2026-11-06-platform-styleguide-design.md`.

## Global Constraints

- Repo `timo-jakob/timos-platform-styleguide`, **public**. Local clone next to the other platform repos.
- Base: Material Design 3 usage guidelines (reference, not a component library) + **WCAG 2.2 AA (mandatory)**. Link to m3.material.io; never copy its text.
- Principles, verbatim names: **Aligned**, **Defined distances**, **Fewest clicks to the answer**, **Accessible (WCAG 2.2 AA, mandatory)**.
- Tokens: prefix `--platform-`. No colour values, no font stacks in this repo. **Every existing shell name and value stays** (no renames/removals).
- Spacing: `xs` 4px, `sm` 8px, `sm-md` 12px, `md` 16px, `lg` 24px, `xl` 32px, `2xl` 40px, `3xl` 48px, `4xl` 64px → `--platform-space-<name>`.
- Radius (theme-overridable defaults): `sm` 4px, `md` 6px, `lg` 8px, `pill` 1000px → `--platform-radius-<name>`.
- Type scale `--platform-type-<role>-<size>-{size,line-height,weight}` with M3 values (px):
  display L 57/64/400, M 45/52/400, S 36/44/400 · headline L 32/40/400, M 28/36/400, S 24/32/400 · title L 22/28/400, M 16/24/500, S 14/20/500 · body L 16/24/400, M 14/20/400, S 12/16/400 · label L 14/20/500, M 12/16/500, S 11/16/500.
- Widget: `--platform-widget-gap: 16px`. Widgets add no outer padding (the shell card owns it).
- `--platform-tokens-version` stays in the shell's `tokens.css` (it versions colours too) at `"1"`; additions do not bump it.
- Checklist items: one per line, format `- [ ] [design|mechanical|review] <criterion>`.
- Shell rendered output must not change.
- Commits: Conventional Commits, ending with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Each consumer change is its own branch + PR (`/development:open-pr`); never push to `main`.

## Review Focus

1. **A token missing after migration** — a shell stylesheet uses `var(--platform-space-md)` but the styleguide import is absent in a build (submodule not checked out in CI/Docker) → silent `unset` spacing. Pinned by Task 5's "every pre-migration token resolves to its old value" test and by a CI step that fails if `styleguide/tokens/tokens.css` is missing.
2. **json/css drift** — someone edits `tokens.css` by hand. Pinned by Task 2's drift test, which runs in CI.
3. **Theme override order** — a tenant theme must still be able to override radius. The styleguide CSS is imported *before* the shell's `tokens.css`, so later declarations win. Pinned in Task 5 (import order test).
4. **Widgets losing tokens** — `themeTokens()` collects `--platform-*` from all page stylesheets; moved tokens must still reach widget `ctx.theme.tokens`. Pinned in Task 5.
5. **Checklist lines a machine can't parse** (missing/two tags) — breaks issue #3019's consumer. Pinned by Task 4's checklist-format test.

---

### Task 1: Create the repo and scaffold

**Files:**

- Create: `README.md`, `CHANGELOG.md`, `.markdownlint.jsonc`, `.github/workflows/ci.yml`, `package.json`
- Create: `docs/superpowers/specs/2026-11-06-platform-styleguide-design.md`, `docs/superpowers/plans/2026-11-06-platform-styleguide.md`

**Interfaces:**

- Produces: `npm test` (= `node --test tests/`), `npm run lint` (= `markdownlint-cli2 "**/*.md" "#node_modules"`), CI running both on PRs and `main`.

- [ ] **Step 1:** `gh repo create timo-jakob/timos-platform-styleguide --public --description "Platform UI styleguide: design and usage rules (Material 3 + WCAG 2.2 AA) and the non-colour --platform-* tokens"` and clone it to the local path. Enable branch protection on `main` matching dashboard-frontend's (required status check `ci`, PR required).
- [ ] **Step 2:** Write `README.md`: what it is, the four principles in one line each, how to include it (`git submodule add -b main https://github.com/timo-jakob/timos-platform-styleguide.git styleguide`, then pin to a tag), how consumers check out (`actions/checkout` with `submodules: true`), reading order (STYLEGUIDE → patterns → CHECKLIST), licence line "All rights reserved" matching the other platform repos.
- [ ] **Step 3:** `package.json` with `"private": true`, scripts above, devDependency `markdownlint-cli2` only. `ci.yml`: Node 22, `npm ci`, `npm run lint`, `npm test`; actions pinned by SHA like dashboard-frontend's workflows. Add `CHANGELOG.md` with an `Unreleased` section.
- [ ] **Step 4:** Copy spec and plan into `docs/superpowers/`. Run `npm run lint` → passes (fix lint in the copies if needed). `npm test` with an empty `tests/` → passes.
- [ ] **Step 5:** Commit `chore: scaffold the platform styleguide repo` on a branch, open the PR, merge after CI is green.

### Task 2: Tokens (json source, css mirror, drift test)

**Files:**

- Create: `tokens/tokens.json`, `tokens/tokens.css`, `tests/tokens.test.mjs`

**Interfaces:**

- Produces: the token names/values in Global Constraints. `tokens.json` uses DTCG groups `space`, `radius`, `type.<role>.<size>.{size,lineHeight,weight}`, `widget.gap`, each leaf `{ "$value": "<css value>", "$type": "dimension"|"fontWeight" }`. CSS name = `--platform-` + path joined by `-`, with `lineHeight` → `line-height`. All declarations live in one `:root { }` block.

- [ ] **Step 1: Write the failing tests** in `tests/tokens.test.mjs` (`node:test`, `node:assert/strict`):
  - `every json token appears in tokens.css with the same value` — flatten json → map name→value; parse css `/(--platform-[a-z0-9-]+)\s*:\s*([^;]+);/g`; `deepEqual` both maps.
  - `keeps every shell token name and value` — asserts `space.xs/sm/md/lg/xl` = 4/8/16/24/32px and `radius.sm/md/lg/pill` = 4/6/8/1000px.
  - `adds the M3 spacing steps` — `sm-md` 12px, `2xl` 40px, `3xl` 48px, `4xl` 64px.
  - `carries the M3 type scale` — all 15 role/size combos present with the Global Constraints values (table-driven).
  - `holds no colour and no font stack` — css has no `#`, `rgb(`, `hsl(`, `font-family`.
  - `every spacing value is a multiple of 4px`.
- [ ] **Step 2:** `npm test` → FAIL (files missing).
- [ ] **Step 3:** Write `tokens.json` and `tokens.css` with the Global Constraints values; the css header comment says "Generated mirror of tokens.json — edit both together; tests/tokens.test.mjs enforces equality. Radius values are defaults a tenant theme may override."
- [ ] **Step 4:** `npm test` → PASS. Then change one css value by hand → the drift test FAILs naming that token; revert.
- [ ] **Step 5:** Commit `feat(tokens): add the non-colour --platform-* tokens`; PR; merge.

### Task 3: STYLEGUIDE.md

**Files:**

- Create: `STYLEGUIDE.md`
- Test: `tests/docs.test.mjs`

**Interfaces:**

- Consumes: token names from Task 2.
- Produces: section anchors `#base-and-precedence`, `#principles`, `#accessibility-in-the-design-step`, `#deviations-from-material-3`, `#spacing-and-alignment`, `#defaults-and-clicks`, `#buttons-and-actions`, `#writing` (referenced by CHECKLIST.md).

- [ ] **Step 1: Write the failing test** `tests/docs.test.mjs`:
  - `STYLEGUIDE.md has the required sections` — each heading above exists, in that order.
  - `every --platform- name mentioned in docs exists in tokens.json or is a listed colour/theme token` — scan `*.md` and `patterns/*.md` for `--platform-[a-z0-9-]+`; allowed = json tokens ∪ the theme-owned names in the colour mapping table (`--platform-color-*`, `--platform-font-family*`, `--platform-tokens-version`).
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Write `STYLEGUIDE.md` per spec §"STYLEGUIDE.md — contents" 1–7 and 2a, short: rules + links to the matching m3.material.io page per section. The colour section contains the mapping table *M3 role → `--platform-color-*` → `--tc-color-*`*; derive the `--tc-color-*` column from `trustcenter-frontend/src/contract/mfe.ts` (`TOKEN_NAMES`) and the shell's colour block in `dashboard-frontend/src/styles/tokens.css`; mark "—" where no token exists yet, and list severity/status tokens as a platform addition.
- [ ] **Step 4:** `npm test` and `npm run lint` → PASS.
- [ ] **Step 5:** Commit `docs: add the styleguide rules`; PR; merge.

### Task 4: Widget-layout pattern and CHECKLIST.md

**Files:**

- Create: `patterns/widget-layout.md`, `CHECKLIST.md`
- Test: `tests/checklist.test.mjs`

**Interfaces:**

- Consumes: Task 3 anchors; Task 2 tokens.
- Produces: `CHECKLIST.md` lines in the Global Constraints format, grouped under `## Design`, `## Mechanical`, `## Review`; each item ends with a link to its STYLEGUIDE anchor.

- [ ] **Step 1: Write the failing tests** `tests/checklist.test.mjs`:
  - `every checklist item has exactly one known tag` — every line starting `- [ ]` matches `/^- \[ \] \[(design|mechanical|review)\] \S/`; no other bullet lines outside the intro.
  - `each tag sits under its own heading` — `[design]` items only under `## Design`, etc.
  - `covers WCAG 2.2 AA design criteria` — the Design section mentions `4.5:1`, `3:1`, `24×24`, `2.4.11`, `1.4.10`, `2.5.7`, `3.3.7`, `3.2.6`.
  - `links resolve` — every `STYLEGUIDE.md#anchor` link in CHECKLIST and patterns targets an existing heading.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Write `patterns/widget-layout.md` (title → filter row → optional count tiles → content → in-place detail with "back"; default view must show content; cards worst-first; empty items shown) with an ASCII wireframe annotated in token names (`--platform-widget-gap`, `--platform-space-*`). Write `CHECKLIST.md` from spec §CHECKLIST plus the design-step AA list.
- [ ] **Step 4:** `npm test`, `npm run lint` → PASS.
- [ ] **Step 5:** Commit `docs: add the widget layout pattern and review checklist`; PR; merge. Then tag `v0.1.0` on `main`, move `CHANGELOG.md` `Unreleased` → `0.1.0`, and create a GitHub release.

### Task 5: Shell migration (dashboard-frontend)

**Files:**

- Create: submodule `styleguide/` at `v0.1.0`
- Modify: `src/main.tsx:8` (import order), `src/styles/tokens.css` (remove spacing + radius blocks), `src/styles/tokens.test.ts`, `.github/workflows/{gate,image,release,acceptance}.yml` (checkout `submodules: true`), `.github/dependabot.yml` (add `gitsubmodule`, weekly, same cooldown style as existing entries), `CLAUDE.md`, `.github/workflows/gate.yml` or `scripts/gate.zsh` (missing-styleguide guard)
- Test: `src/styles/tokens.test.ts`, `src/widgets/createContext.test.ts` (or the existing themeTokens test file)

**Interfaces:**

- Consumes: `styleguide/tokens/tokens.css` (Task 2).
- Produces: shell pages and widget `ctx.theme.tokens` carrying the full union of styleguide + shell tokens.

- [ ] **Step 1:** Branch, `git submodule add https://github.com/timo-jakob/timos-platform-styleguide.git styleguide`, check out `v0.1.0` inside it.
- [ ] **Step 2: Write the failing tests** in `tokens.test.ts`:
  - `every pre-migration token keeps its value` — a frozen literal map of all 29 `--platform-*` names/values currently in `src/styles/tokens.css` (copy them before editing); assert each is declared in `styleguide/tokens/tokens.css` ∪ `src/styles/tokens.css` with the same value, and no name is declared in both.
  - `imports the styleguide tokens before the shell tokens` — in `src/main.tsx`, the index of `styleguide/tokens/tokens.css` import < index of `./styles/tokens.css`.
  - Update `carries the brand values` to read radii from the styleguide file.
  - In the themeTokens test: with both stylesheets loaded, `themeTokens()` returns `--platform-space-md` = `16px` and `--platform-radius-md` = `6px`.
- [ ] **Step 3:** `npm test` → the new tests FAIL.
- [ ] **Step 4:** Add `import "../styleguide/tokens/tokens.css";` above `./styles/tokens.css` in `src/main.tsx`; delete the Spacing and Shape blocks from `src/styles/tokens.css` and add a comment pointing to `styleguide/tokens/tokens.css` for non-colour tokens. Add `submodules: true` to every `actions/checkout` of this repo (not the plugin-repo checkout in template-drift-watch). Add a gate step: `test -f styleguide/tokens/tokens.css || { echo "styleguide submodule missing — run git submodule update --init"; exit 1; }`. Confirm `.dockerignore` does not exclude `styleguide`. Add the CLAUDE.md section: "Read `styleguide/STYLEGUIDE.md` before UI changes; check `styleguide/CHECKLIST.md` before declaring UI work done."
- [ ] **Step 5:** Run `npm test`, `npm run lint`, `npm run lint:css`, `npm run build`, `zsh scripts/gate.zsh` → all pass. `docker build .` succeeds. Open the built app and compare the dashboard against `main` visually (Playwright screenshot of the default dashboard before/after: pixel-identical).
- [ ] **Step 6:** Commit `feat(tokens): take the non-colour tokens from the platform styleguide`; open PR via `/development:open-pr`; CI green; merge.

### Task 6: Point the other UI repos at the styleguide

One PR per repo: trustcenter-frontend, widget-gallery, whitelabel-center.

**Files (each repo):**

- Create: submodule `styleguide/` at `v0.1.0`
- Modify: `CLAUDE.md` (same section as Task 5); `.github/dependabot.yml` add `gitsubmodule` **only where the file exists** (trustcenter-frontend; the two scaffolds have none — note it in the PR body)

**Interfaces:**

- Consumes: `v0.1.0`. No build imports yet, so no workflow changes (first import comes with the vulnerability-widget redesign).

- [ ] **Step 1:** In each repo: branch, add the submodule, pin `v0.1.0`, edit CLAUDE.md (and dependabot where present).
- [ ] **Step 2:** Verify: `git submodule status` shows `styleguide` at the `v0.1.0` commit; trustcenter-frontend `npm test` and its lint gates still pass (the submodule must not be picked up by ESLint/oxlint/vitest — add `styleguide/` to their ignores if it is).
- [ ] **Step 3:** Commit `docs: include the platform styleguide`; PR; merge.
- [ ] **Step 4:** Comment on timos-claude-code-plugins#3016 with links to the four consumer PRs as the manual reference implementation.
