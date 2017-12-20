import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

type Props = {
  tag: string
};

type State = {
  shadowRoot: Node
};

export class Root extends Component<Props, State> {
  static childContextTypes = {
    shadowRoot: PropTypes.object
  };
  static defaultProps = {
    tag: 'div'
  };
  state = {};
  attachShadow = e => {
    if (e) {
      const shadowRoot = e.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(document.createElement(this.props.tag));
      this.setState({ shadowRoot });
    }
  };
  getChildContext() {
    return {
      shadowRoot: this.state.shadowRoot
    };
  }
  render() {
    const { attachShadow, props, state } = this;
    const { tag: Tag, ...rest } = this.props;
    return (
      <Tag {...rest} ref={attachShadow}>
        {state.shadowRoot
          ? createPortal(props.children, state.shadowRoot.firstChild)
          : null}
      </Tag>
    );
  }
}
