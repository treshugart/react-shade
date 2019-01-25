import * as React from "react";
import { createPortal } from "react-dom";
import Context from "./Context";

type Props = {
  children?: React.ReactChildren;
  defaultContent?: React.ReactChildren;
};

export class Slot extends React.Component<Props> {
  static slot: number = 0;
  slotName: string;
  constructor(props: Props) {
    super(props);
    this.slotName = `slot-${Slot.slot++}`;
  }
  render() {
    const { children, defaultContent } = this.props;
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
        {shadowRoot =>
          // We do this to get around TS complaining about <slot /> not being a
          // valid JSX element.
          React.createElement(
            "slot",
            { name: this.slotName },
            defaultContent,
            shadowRoot ? createPortal(childrenMapped, shadowRoot.host) : null
          )
        }
      </Context.Consumer>
    );
  }
}
