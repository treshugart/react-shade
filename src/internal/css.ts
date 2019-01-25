import { StyleProps, StyleRules, StyleValue } from "./types";

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

export function styleRules<T>(css: StyleRules, props: T): string {
  return Object.keys(css || {}).reduce(
    (p, c) => p + `${c}{${styleProps(ensureVal(css[c], props), props)}}`,
    ""
  );
}
