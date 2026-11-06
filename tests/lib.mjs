// Shared readers for the repository's checks: the token source (tokens.json),
// its CSS mirror (tokens.css) and the Markdown documents.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const root = fileURLToPath(new URL("..", import.meta.url));
export const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

const cssName = (key) => (key === "lineHeight" ? "line-height" : key);

/** tokens.json flattened to a Map of CSS custom-property name → value. */
export function jsonTokens(json = JSON.parse(read("tokens/tokens.json"))) {
  const tokens = new Map();
  const walk = (node, path) => {
    if (Object.hasOwn(node, "$value")) {
      tokens.set(`--platform-${path.map(cssName).join("-")}`, String(node.$value));
      return;
    }
    for (const [key, child] of Object.entries(node)) {
      if (!key.startsWith("$")) walk(child, [...path, key]);
    }
  };
  walk(json, []);
  return tokens;
}

/** Every `--platform-*` declaration in a stylesheet, as a Map of name → value. */
export function cssTokens(css = read("tokens/tokens.css")) {
  return new Map([...css.matchAll(/(--platform-[a-z0-9-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
}
