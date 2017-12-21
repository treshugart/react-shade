// @flow

import type { StyleRules } from './internal/types';

import React from 'react';
import { styleRules } from './internal/css';

type Props = {
  children?: StyleRules
};

export const Style = ({ children, ...props }: Props) => (
  <style>{styleRules(children || {}, props)}</style>
);
