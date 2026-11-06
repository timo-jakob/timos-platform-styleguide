import assert from "node:assert/strict";
import { test } from "node:test";
import { read } from "./lib.mjs";

const TAGS = { design: "Design", mechanical: "Mechanical", review: "Review" };
const ITEM = /^- \[ \] \[(design|mechanical|review)\] \S/;

/** Checklist lines with the `## ` heading each one sits under. */
function items() {
  let heading = null;
  const found = [];
  for (const line of read("CHECKLIST.md").split("\n")) {
    const h = /^## (.+)$/.exec(line);
    if (h) heading = h[1].trim();
    else if (line.startsWith("- ")) found.push({ heading, line });
  }
  return found;
}

test("every checklist item has exactly one known tag", () => {
  const bad = items()
    .filter(({ heading }) => heading !== null)
    .filter(({ line }) => !ITEM.test(line) || (line.match(/\[(design|mechanical|review)\]/g) ?? []).length !== 1);
  assert.deepEqual(bad, []);
  assert.ok(items().length >= 15, "the checklist has items");
});

test("each tag sits under its own heading", () => {
  const misplaced = items()
    .filter(({ heading }) => heading !== null)
    .filter(({ heading, line }) => TAGS[ITEM.exec(line)?.[1]] !== heading);
  assert.deepEqual(misplaced, []);
});

test("covers the WCAG 2.2 AA design criteria", () => {
  const design = items()
    .filter(({ heading }) => heading === "Design")
    .map(({ line }) => line)
    .join("\n");
  for (const criterion of ["4.5:1", "3:1", "24×24", "2.4.11", "1.4.10", "2.5.7", "3.3.7", "3.2.6"]) {
    assert.ok(design.includes(criterion), criterion);
  }
});

test("links into STYLEGUIDE.md resolve to a heading", () => {
  const slug = (heading) =>
    heading
      .toLowerCase()
      .replace(/[^\p{L}\p{N} -]/gu, "")
      .replace(/ /g, "-");
  const anchors = new Set([...read("STYLEGUIDE.md").matchAll(/^#{2,3} (.+)$/gm)].map((m) => slug(m[1].trim())));
  const broken = [];
  for (const file of ["CHECKLIST.md", "patterns/widget-layout.md"]) {
    for (const [, anchor] of read(file).matchAll(/STYLEGUIDE\.md#([a-z0-9-]+)/g)) {
      if (!anchors.has(anchor)) broken.push(`${file}: #${anchor}`);
    }
  }
  assert.deepEqual(broken, []);
});
