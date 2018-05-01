// @flow

import React from "react";
import { styleRules } from "./internal/css";
import type { StyleRules } from "./internal/types";

type Props = {
  children?: StyleRules
};

export const Style = ({ children, ...props }: Props) => (
  <style>{styleRules(children || {}, props)}</style>
);
