import * as React from "react";
import { Root } from "./Root";
import { Slot } from "./Slot";
import { Style } from "./Style";
import { StyleRules, StyleProps } from "./internal/types";

type Tag = string | ((props: { [s: string]: any }) => string);
type Props = {
  children?: React.ReactNode;
};

function createTag(name, props) {
  return typeof name === "function" ? name(props) : name;
}

export const styled = (css: StyleRules, tag: Tag = "div") => ({
  children,
  ...props
}: Props) => {
  return (
    <Root tag={createTag(tag, props)} {...props}>
      <Style {...props}>{css}</Style>
      <Slot>{children}</Slot>
    </Root>
  );
};
