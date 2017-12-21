// @flow

import React, { type Node } from 'react';
import { Root } from './Root';
import { Slot } from './Slot';
import { styleRules } from './internal/css';
import type { StyleRules } from './internal/types';

type Opt = {
  name: string | ((props: Object) => string),
  slot: boolean
};

type Props = {
  children?: Node
};

function tag(name, props) {
  return typeof name === 'function' ? name(props) : name;
}

const def: Opt = { name: 'div', slot: true };
export const styled = (css: StyleRules, opt: Opt) => ({
  children,
  ...props
}: Props) => {
  const { name, slot } = { ...def, ...opt };
  return (
    <Root tag={tag(name, props)} {...props}>
      <style>{styleRules(css, props)}</style>
      {slot ? <Slot>{children}</Slot> : children}
    </Root>
  );
};
