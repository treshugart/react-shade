import * as React from "react";
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
      {({ scope }) => {
        const css = styleRules(children, props, scope);
        return css ? <style dangerouslySetInnerHTML={{ __html: css }} /> : "";
      }}
    </Context.Consumer>
  );
}
