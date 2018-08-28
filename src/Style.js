// @flow

import React from "react";
import shadowCss from "shadow-css";
import Context from "./Context";
import { styleRules } from "./internal/css";
import type { StyleRules } from "./internal/types";

type Props = {
  children?: StyleRules
};

export const Style = ({ children, ...props }: Props) => (
  <Context.Consumer>
    {root => {
      const unscopedCss = styleRules(children, props);
      const scopedCss = shadowCss(unscopedCss)(root && root.host);
      return scopedCss ? <style>{scopedCss}</style> : "";
    }}
  </Context.Consumer>
);
