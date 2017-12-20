import React, { Children, cloneElement, Component } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

export class Slot extends Component {
  static contextTypes = {
    shadowRoot: PropTypes.object
  };
  static slot = 0;
  constructor(props) {
    super(props);
    this.slotName = `slot-${this.constructor.slot++}`;
  }
  render() {
    const { children, defaultContent } = this.props;
    const { shadowRoot } = this.context;
    const childrenMapped = Children.map(children, child => {
      const isObject = typeof child === 'object';
      return isObject
        ? cloneElement(child, {
            slot: isObject ? this.slotName : null
          })
        : child;
    });
    return (
      <slot name={this.slotName}>
        {defaultContent}
        {shadowRoot
          ? createPortal(childrenMapped, shadowRoot.host.parentNode)
          : null}
      </slot>
    );
  }
}
