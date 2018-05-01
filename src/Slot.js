// @flow

import React, { Children, cloneElement, Component, type Node } from "react";
import { createPortal } from "react-dom";
import Context from "./Context";

type Props = {
  children?: Node,
  defaultContent?: Node
};

export class Slot extends Component<Props> {
  static slot = 0;
  slotName: string;
  constructor(props: Props) {
    super(props);
    this.slotName = `slot-${this.constructor.slot++}`;
  }
  render() {
    const { children, defaultContent } = this.props;
    const childrenMapped = Children.map(children, child => {
      return typeof child === "string" ? (
        <span slot={this.slotName}>{child}</span>
      ) : (
        cloneElement(child, {
          slot: this.slotName
        })
      );
    });
    return (
      <Context.Consumer>
        {shadowRoot => (
          <slot name={this.slotName}>
            {defaultContent}
            {shadowRoot ? createPortal(childrenMapped, shadowRoot.host) : null}
          </slot>
        )}
      </Context.Consumer>
    );
  }
}
