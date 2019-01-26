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

  // Number that increments for each used scope.
  static scope: number = 0;

  // The scope that was assigned to this instance.
  scope: number = 0;

  state = {
    shadowRoot: null
  };

  constructor(props) {
    super(props);
    this.scope = ++Root.scope;
  }

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
    const ssr = typeof document === "undefined";
    const ssrScope = { __ssr_scope: ssr ? this.scope : undefined };
    const value = { scope: this.scope, shadowRoot: state.shadowRoot, ssr };
    return (
      <Context.Provider value={value}>
        <Tag {...rest} ref={attachShadow} {...ssrScope}>
          {state.shadowRoot
            ? createPortal(props.children, state.shadowRoot)
            : props.children}
        </Tag>
      </Context.Provider>
    );
  }
}
