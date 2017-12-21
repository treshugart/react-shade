import React from 'react';
import { Root } from './Root';
import { Slot } from './Slot';

function dashcase(str) {
  return str.replace(/([A-Z]{1})/g, (match, parens, offset) => {
    return `${offset ? '-' : ''}${parens.toLowerCase()}`;
  });
}

function ensurePx(val) {
  return typeof val === 'number' ? `${val}px` : val;
}

function styleValueOrFunction(value, props) {
  return typeof value === 'function' ? value(props) : value;
}

function styleProps(css, props) {
  return Object.keys(css).reduce(
    (p, c) =>
      p + `${dashcase(c)}:${ensurePx(styleValueOrFunction(css[c], props))};`,
    ''
  );
}

function styleRules(css, props) {
  return Object.keys(css).reduce(
    (p, c) =>
      p + `${c}{${styleProps(styleValueOrFunction(css[c], props), props)}}`,
    ''
  );
}

function tag(name, props) {
  return typeof name === 'function' ? name(props) : name;
}

const def = { name: 'div', slot: true };
export const styled = (css, opt) => ({ children, ...props }) => {
  const { name, slot } = { ...def, ...opt };
  return (
    <Root tag={tag(name, props)} {...props}>
      <style>{styleRules(css, props)}</style>
      {slot ? <Slot>{children}</Slot> : children}
    </Root>
  );
};
