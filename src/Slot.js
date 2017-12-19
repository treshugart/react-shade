import React, { Children, cloneElement, Component } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

export class Slot extends Component {
  static contextTypes = {
    shadowRoot: PropTypes.object
  };
  static slot = 0;
  render() {
    const { children, defaultContent } = this.props;
    const { shadowRoot } = this.context;
    const slotName = `slot-${this.constructor.slot++}`;
    const childrenMapped = Children.map(children, child => {
      return cloneElement(child, {
        slot: slotName
      });
    });
    return (
      <slot name={slotName}>
        {defaultContent}
        {shadowRoot
          ? createPortal(childrenMapped, shadowRoot.host.parentNode)
          : null}
      </slot>
    );
  }
}
