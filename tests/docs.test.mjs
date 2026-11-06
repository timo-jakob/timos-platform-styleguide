import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import { test } from "node:test";
import { jsonTokens, read } from "./lib.mjs";

const SECTIONS = [
  "Base and precedence",
  "Principles",
  "Accessibility in the design step",
  "Deviations from Material 3",
  "Spacing and alignment",
  "Defaults and clicks",
  "Buttons and actions",
  "Writing",
];

const PATTERNS = new URL("../patterns/", import.meta.url);

// The styleguide's normative documents (not the design history under docs/).
const documents = () => [
  "README.md",
  "STYLEGUIDE.md",
  ...(existsSync(PATTERNS) ? readdirSync(PATTERNS, { withFileTypes: true }) : [])
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => `patterns/${entry.name}`),
];

test("STYLEGUIDE.md has the required sections, in order", () => {
  const headings = [...read("STYLEGUIDE.md").matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
  assert.deepEqual(
    headings.filter((heading) => SECTIONS.includes(heading)),
    SECTIONS,
  );
});

test("STYLEGUIDE.md names Material 3 and WCAG 2.2 AA as its base", () => {
  const text = read("STYLEGUIDE.md");
  assert.match(text, /https:\/\/m3\.material\.io\//);
  assert.match(text, /WCAG 2\.2 AA/);
});

test("every --platform- name in the docs is a styleguide token or a theme token", () => {
  const tokens = jsonTokens();
  const themeOwned = /^--platform-(color-[a-z0-9-]+|font-family(-[a-z]+)?|tokens-version|shadow|gradient-brand)$/;
  // A family written as `--platform-space-*` or `--platform-type-<role>…` names a prefix.
  const families = [...tokens.keys(), "--platform-color-x"];
  const known = (name) =>
    tokens.has(name) || themeOwned.test(name) || families.some((token) => token.startsWith(`${name}-`));
  const unknown = [];
  for (const file of documents()) {
    for (const [name] of read(file).matchAll(/--platform-[a-z0-9-]*[a-z0-9]/g)) {
      if (!known(name)) unknown.push(`${file}: ${name}`);
    }
  }
  assert.deepEqual(unknown, []);
});
