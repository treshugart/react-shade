import * as React from "react";
import shadowCss from "shadow-css";
import Context from "./Context";
import { styleRules } from "./internal/css";
import { StyleRules } from "./internal/types";

type Props = {
  [s: string]: any;
  children?: StyleRules;
};

export function Style({ children, ...props }: Props) {
  return (
    <Context.Consumer>
      {({ scope, ssr }) => {
        const css = styleRules(children, props, ssr ? scope : null);
        return css ? <style dangerouslySetInnerHTML={{ __html: css }} /> : "";
      }}
    </Context.Consumer>
  );
}
