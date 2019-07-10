import * as React from "react";
import { createPortal } from "react-dom";
import Context from "./Context";
import retarget from "./internal/retarget";

type Props<T extends keyof JSX.IntrinsicElements> = {
  tag?: T;
} & React.ComponentProps<T>;

type State = {
  shadowRoot?: Node;
};

const isNodeOrPolyfill =
  typeof HTMLSlotElement === "undefined" ||
  HTMLSlotElement.toString().indexOf("native code") === -1;

export class Root<
  T extends keyof JSX.IntrinsicElements = "div"
> extends React.Component<Props<T>, State> {
  static defaultProps: Props<"div"> = {
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
    const { tag, ...rest } = this.props;
    const Tag: string = tag;
    return (
      <Context.Provider
        value={{
          scope: isNodeOrPolyfill ? this.scope : null,
          shadowRoot: state.shadowRoot
        }}
      >
        <Tag
          {...rest}
          __ssr_scope={isNodeOrPolyfill ? this.scope : undefined}
          ref={attachShadow}
        >
          {state.shadowRoot
            ? createPortal(props.children, state.shadowRoot)
            : props.children}
        </Tag>
      </Context.Provider>
    );
  }
}
