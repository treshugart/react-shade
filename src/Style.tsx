import * as React from "react";
import shadowCss from "shadow-css";
import Context from "./Context";
import { styleRules } from "./internal/css";
import { StyleRules, StyleProps } from "./internal/types";

type Props = {
  [s: string]: any;
  children?: StyleRules;
};

export function Style({ children, ...props }: Props) {
  return (
    <Context.Consumer>
      {root => {
        const unscopedCss = styleRules(children, props);
        const scopedCss = shadowCss(unscopedCss)(root && root.host);
        return scopedCss ? <style>{scopedCss}</style> : "";
      }}
    </Context.Consumer>
  );
}
