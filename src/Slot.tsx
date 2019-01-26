import * as React from "react";
import { createPortal } from "react-dom";
import Context from "./Context";

type Props = {
  children?: React.ReactNode;
};

export class Slot extends React.Component<Props> {
  static slot: number = 0;
  slotName: string;
  constructor(props: Props) {
    super(props);
    this.slotName = `slot-${Slot.slot++}`;
  }
  render() {
    const { children } = this.props;
    const childrenMapped = React.Children.map(children, child => {
      return typeof child === "string" || typeof child === "number" ? (
        <span slot={this.slotName}>{child}</span>
      ) : (
        React.cloneElement(child, {
          slot: this.slotName
        })
      );
    });
    return (
      <Context.Consumer>
        {({ shadowRoot }) => (
          <slot name={this.slotName}>
            {shadowRoot
              ? createPortal(childrenMapped, shadowRoot.host)
              : childrenMapped}
          </slot>
        )}
      </Context.Consumer>
    );
  }
}
