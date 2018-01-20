const reactEvents = [
  'onAbort',
  'onAnimationCancel',
  'onAnimationEnd',
  'onAnimationIteration',
  'onAuxClick',
  'onBlur',
  'onChange',
  'onClick',
  'onClose',
  'onContextMenu',
  'onDoubleClick',
  'onError',
  'onFocus',
  'onGotPointerCapture',
  'onInput',
  'onKeyDown',
  'onKeyPress',
  'onKeyUp',
  'onLoad',
  'onLoadEnd',
  'onLoadStart',
  'onLostPointerCapture',
  'onMouseDown',
  'onMouseMove',
  'onMouseOut',
  'onMouseOver',
  'onMouseUp',
  'onPointerCancel',
  'onPointerDown',
  'onPointerEnter',
  'onPointerLeave',
  'onPointerMove',
  'onPointerOut',
  'onPointerOver',
  'onPointerUp',
  'onReset',
  'onResize',
  'onScroll',
  'onSelect',
  'onSelectionChange',
  'onSelectStart',
  'onSubmit',
  'onTouchCancel',
  'onTouchMove',
  'onTouchStart',
  'onTransitionCancel',
  'onTransitionEnd',
  'onDrag',
  'onDragEnd',
  'onDragEnter',
  'onDragExit',
  'onDragLeave',
  'onDragOver',
  'onDragStart',
  'onDrop',
  'onFocusOut'
];

const divergentNativeEvents = {
  onDoubleClick: 'dblclick'
};

const mimickedReactEvents = {
  onInput: 'onChange',
  onFocusOut: 'onBlur',
  onSelectionChange: 'onSelect'
};

function findReactComponent(item) {
  for (const key in item) {
    if (item.hasOwnProperty(key) && key.indexOf('_reactInternal') !== -1) {
      return item[key];
    }
  }
}

function findReactProps(component) {
  if (!component) return;

  // React 16 Fiber
  if (component.memoizedProps) return component.memoizedProps;

  // React <=15
  if (component._currentElement && component._currentElement.props)
    return component._currentElement.props;
}

function dispatchEvent(e, type, props) {
  return props[type] ? props[type](e) : null;
}

function getNativeEventName(reactEventName) {
  return divergentNativeEvents[reactEventName]
    ? divergentNativeEvents[reactEventName]
    : reactEventName.replace(/^on/, '').toLowerCase();
}

function getComposedPath({ target }) {
  const path = [];
  while (target) {
    path.push(target);
    if (target.tagName === 'HTML') {
      path.push(document);
      path.push(window);
      return path;
    }
    target = target.parentNode;
  }
}

function getPath(e) {
  return e.path || (e.composedPath && e.composedPath()) || getComposedPath(e);
}

export default shadowRoot => {
  if (shadowRoot._retargeted) return;
  shadowRoot._retargeted = true;
  for (const reactEventName of reactEvents) {
    const nativeEventName = getNativeEventName(reactEventName);
    shadowRoot.addEventListener(nativeEventName, e => {
      const path = getPath(e);
      e.stopPropagation();
      for (const el of path) {
        if (el === shadowRoot) return;
        const reactComponent = findReactComponent(el);
        const props = findReactProps(reactComponent);
        if (reactComponent && props) {
          if (mimickedReactEvents[reactEventName]) {
            dispatchEvent(e, mimickedReactEvents[reactEventName], props);
          } else {
            dispatchEvent(e, reactEventName, props);
          }
        }
      }
    });
  }
};
