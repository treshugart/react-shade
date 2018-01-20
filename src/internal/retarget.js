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
      // This prevents double handling by ancestor roots. We only need to
      // retarget once, so if a shadow root is nested within an ancestor
      // root, this would normally end up handling it twice.
      if (e.__ReactShadeIsHandled) return;
      e.__ReactShadeIsHandled = true;
      const path = getPath(e);
      for (const el of path) {
        const component = findReactComponent(el);
        const props = findReactProps(component);
        if (component && props) {
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
