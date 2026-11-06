import assert from "node:assert/strict";
import { test } from "node:test";
import { cssTokens, jsonTokens, read } from "./lib.mjs";

const json = () => jsonTokens();
const css = () => cssTokens();

test("every json token appears in tokens.css with the same value", () => {
  assert.deepEqual(css(), json());
});

test("keeps every shell token name and value", () => {
  const tokens = json();
  const expected = {
    "--platform-space-xs": "4px",
    "--platform-space-sm": "8px",
    "--platform-space-md": "16px",
    "--platform-space-lg": "24px",
    "--platform-space-xl": "32px",
    "--platform-radius-sm": "4px",
    "--platform-radius-md": "6px",
    "--platform-radius-lg": "8px",
    "--platform-radius-pill": "1000px",
  };
  for (const [name, value] of Object.entries(expected)) assert.equal(tokens.get(name), value, name);
});

test("adds the M3 spacing steps", () => {
  const tokens = json();
  assert.equal(tokens.get("--platform-space-sm-md"), "12px");
  assert.equal(tokens.get("--platform-space-2xl"), "40px");
  assert.equal(tokens.get("--platform-space-3xl"), "48px");
  assert.equal(tokens.get("--platform-space-4xl"), "64px");
});

test("defines the widget gap", () => {
  assert.equal(json().get("--platform-widget-gap"), "16px");
});

// Material 3 type scale: [size, line-height, weight] in px.
const TYPE_SCALE = {
  display: { large: [57, 64, 400], medium: [45, 52, 400], small: [36, 44, 400] },
  headline: { large: [32, 40, 400], medium: [28, 36, 400], small: [24, 32, 400] },
  title: { large: [22, 28, 400], medium: [16, 24, 500], small: [14, 20, 500] },
  body: { large: [16, 24, 400], medium: [14, 20, 400], small: [12, 16, 400] },
  label: { large: [14, 20, 500], medium: [12, 16, 500], small: [11, 16, 500] },
};

test("carries the M3 type scale", () => {
  const tokens = json();
  for (const [role, sizes] of Object.entries(TYPE_SCALE)) {
    for (const [size, [fontSize, lineHeight, weight]] of Object.entries(sizes)) {
      const prefix = `--platform-type-${role}-${size}`;
      assert.equal(tokens.get(`${prefix}-size`), `${fontSize}px`, `${prefix}-size`);
      assert.equal(tokens.get(`${prefix}-line-height`), `${lineHeight}px`, `${prefix}-line-height`);
      assert.equal(tokens.get(`${prefix}-weight`), String(weight), `${prefix}-weight`);
    }
  }
});

test("holds no colour and no font stack", () => {
  const source = read("tokens/tokens.css").replace(/\/\*[\s\S]*?\*\//g, "");
  for (const forbidden of [/#[0-9a-f]{3,8}\b/i, /\brgba?\(/, /\bhsla?\(/, /font-family/]) {
    assert.doesNotMatch(source, forbidden);
  }
  assert.ok(![...json().keys()].some((name) => name.startsWith("--platform-color")));
});

test("every spacing value is a multiple of 4px", () => {
  for (const [name, value] of json()) {
    if (!name.startsWith("--platform-space-")) continue;
    const px = Number.parseInt(value, 10);
    assert.equal(px % 4, 0, `${name}: ${value}`);
  }
});
