import * as React from "react";
import { createPortal } from "react-dom";
import Context from "./Context";
import retarget from "./internal/retarget";

// This is so that we can have a dynamic tag name and still pass ref.
declare module "react" {
  namespace JSX {
    interface IntrinsicAttributes {
      ref?: any;
    }
  }
}

type Props = {
  children?: React.ReactChildren;
  tag: string;
};

type State = {
  shadowRoot?: Node;
};

export class Root extends React.Component<Props, State> {
  static defaultProps = {
    tag: "div"
  };
  state = {
    shadowRoot: null
  };
  attachShadow = (e: HTMLElement): void => {
    if (e) {
      const shadowRoot = e.attachShadow({ mode: "open" });
      retarget(shadowRoot);
      this.setState({ shadowRoot });
    }
  };
  render() {
    const { attachShadow, props, state } = this;
    const { tag: Tag, ...rest } = this.props;
    return (
      <Context.Provider value={state.shadowRoot}>
        <Tag {...rest} ref={attachShadow}>
          {state.shadowRoot
            ? createPortal(props.children, state.shadowRoot)
            : null}
        </Tag>
      </Context.Provider>
    );
  }
}
