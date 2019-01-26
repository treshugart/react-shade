import { StyleProps, StyleRules, StyleValue } from "./types";

const regexHostContext = /:host-context\(([^)]+)\)/g;
const regexHostSelector = /:host\(([^)]+)\)/g;

function dashcase(str: string) {
  return str.replace(/([A-Z]{1})/g, (match, parens, offset) => {
    return `${offset ? "-" : ""}${parens.toLowerCase()}`;
  });
}

function ensurePx(value: number | string) {
  return typeof value === "number" ? `${value}px` : value;
}

function ensureVal<T>(value: StyleValue, props: T) {
  return typeof value === "function" ? value(props) : value;
}

function scopeSelector(selector: string, scope: number) {
  const attr = `[__ssr_scope="${scope}"]`;
  const hostContextOrSelector = selector.substring(0, 6);

  if (selector === ":host") {
    return attr;
  }

  if (hostContextOrSelector === ":host(") {
    return selector.replace(regexHostSelector, `$1 ${attr}`);
  }

  if (hostContextOrSelector === ":host-") {
    return selector.replace(regexHostContext, `${attr} $1`);
  }

  return `${attr} ${selector}`;
}

function styleValue<T>(value: StyleValue, props: T): string {
  return Array.isArray(value)
    ? value.map(v => styleValue(v, props)).join(" ")
    : ensurePx(ensureVal(value, props));
}

function styleProps<T>(css: StyleProps, props: T): string {
  return Object.keys(css).reduce(
    (p, c) => p + `${dashcase(c)}:${ensurePx(styleValue(css[c], props))};`,
    ""
  );
}

export function styleRules<T>(
  css: StyleRules,
  props: T,
  scope: number = null
): string {
  return Object.keys(css || {}).reduce((p, c) => {
    const scopedSelector = scope ? scopeSelector(c, scope) : c;
    return (
      p + `${scopedSelector}{${styleProps(ensureVal(css[c], props), props)}}`
    );
  }, "");
}
