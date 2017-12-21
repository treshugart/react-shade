// @flow

import React, { Component, type Node } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

type Props = {
  children?: Node,
  tag: string,
  tagForShadowRoot: string
};

type State = {
  shadowRoot?: window.Node
};

export class Root extends Component<Props, State> {
  static childContextTypes = {
    shadowRoot: PropTypes.object
  };
  static defaultProps = {
    tag: 'div',
    tagForShadowRoot: 'shadow--root'
  };
  state = {};
  attachShadow: Function = (e: HTMLElement): void => {
    if (e) {
      const shadowRoot = e.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(
        document.createElement(this.props.tagForShadowRoot)
      );
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
    const { tag: Tag, tagForShadowRoot, ...rest } = this.props;
    return (
      <Tag {...rest} ref={attachShadow}>
        {state.shadowRoot
          ? createPortal(props.children, state.shadowRoot.firstChild)
          : null}
      </Tag>
    );
  }
}
