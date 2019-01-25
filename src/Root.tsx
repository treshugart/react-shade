import * as React from "react";
import { createPortal } from "react-dom";
import Context from "./Context";
import retarget from "./internal/retarget";

type Props = {
  children?: React.ReactNode;
  tag?: string;
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
