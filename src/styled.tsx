import * as React from "react";
import { Root } from "./Root";
import { Slot } from "./Slot";
import { Style } from "./Style";
import { StyleRules } from "./internal/types";

type Tag = string | ((props: { [s: string]: any }) => string);
type Props = { children?: React.ReactNode };

function createTag(name, props) {
  return typeof name === "function" ? name(props) : name;
}

export const styled = (tag: Tag = "div", css: StyleRules) => ({
  children,
  ...props
}: Props) => {
  return (
    <Root tag={createTag(tag, props)} {...props}>
      <Style {...props}>{css}</Style>
      {children ? <Slot>{children}</Slot> : null}
    </Root>
  );
};
