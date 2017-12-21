// @flow

function dashcase(str) {
  return str.replace(/([A-Z]{1})/g, (match, parens, offset) => {
    return `${offset ? '-' : ''}${parens.toLowerCase()}`;
  });
}

function ensurePx(value) {
  return typeof value === 'number' ? `${value}px` : value;
}

function ensureVal(value, props) {
  return typeof value === 'function' ? value(props) : value;
}

function styleValue(value, props): string {
  if (Array.isArray(value)) {
    return value.map(v => styleValue(v, props)).join(' ');
  }
  return ensurePx(ensureVal(value));
}

function styleProps(css: Object, props: Object): string {
  return Object.keys(css).reduce(
    (p, c) => p + `${dashcase(c)}:${ensurePx(styleValue(css[c], props))};`,
    ''
  );
}

export function styleRules(css: Object, props: Object): string {
  return Object.keys(css).reduce(
    (p, c) => p + `${c}{${styleProps(ensureVal(css[c], props), props)}}`,
    ''
  );
}
