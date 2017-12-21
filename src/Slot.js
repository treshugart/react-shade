// @flow

import React, { Children, cloneElement, Component, type Node } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

type Props = {
  children?: Node,
  defaultContent?: Node
};

export class Slot extends Component<Props> {
  static contextTypes = {
    shadowRoot: PropTypes.object
  };
  static slot = 0;
  slotName: string;
  constructor(props: Props) {
    super(props);
    this.slotName = `slot-${this.constructor.slot++}`;
  }
  render() {
    const { children, defaultContent } = this.props;
    const { shadowRoot } = this.context;
    const childrenMapped = Children.map(children, child => {
      return typeof child === 'string' ? (
        <span slot={this.slotName}>{child}</span>
      ) : (
        cloneElement(child, {
          slot: this.slotName
        })
      );
    });
    return (
      <slot name={this.slotName}>
        {defaultContent}
        {shadowRoot ? createPortal(childrenMapped, shadowRoot.host) : null}
      </slot>
    );
  }
}
