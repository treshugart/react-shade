# react-shadow-dom

> Use the Web Component Shadow DOM API as React components.

## Install

```sh
npm install react-shadow-dom
```

## Why

This library exposes the standardised W3C Web Component Shadow DOM API as a set of React components. Normally, what you'd have to do is get a `ref` and imperatively call `attachShadow()` then somehow portal your components to that newly created shadow root. On top of that, you'd also have to somehow get light DOM into your shadow root by rendering it to the host of the shadow root.

Instead of having to do all of this yourselves, you can now just compose together your React components as normal and your styles / DOM becomes encapsulated.

## Usage

```js
import React from 'react';
import { render } from 'react-dom';
import Root, { Slot } from 'react-shadow-root';

const App = (
  <div>
    <Root>
      <style>{`
        span {
          font-weight: bold;
        }
      `}</style>
      <span>This will be bold.</span>
      <Slot>
        <span>This will NOT be bold</span>
      </Slot>
    </Root>
  </div>
);

render(<App />, window.root);
```

This will produce something like:

```html
<div>
  <!-- Requires a wrapping node because it needs to have a node to attach
  the shadow root to. -->
  <div>
    <!-- This is where the slot content ends up (as light DOM). -->
    <span slot="slot-0">This will NOT be bold</span>
    #shadow-root
      <!-- ReactDOM doesn't support calling createPortal() on a shadow root so
      we must create a wrapper node to portal into. -->
      <div>
        <style>
          span {
            font-weight: bold;
          }
        </style>
        <slot name="slot-0"></slot>
      </div>
  </div>
</div>
```

There's some drawbacks as noted above in the HTML comments:

1. Attaching a shadow root requires a real DOM node. We don't want to reach up in the hierarchy and mutate the DOM, so the `Root` component needs to generate a node to attach a shadow to. This defaults to a `div`, but can be whatever you want. This isn't something that will ever be able to change due to the nature of the DOM and React.
2. ReactDOM doesn't support calling `createPortal()` on a shadow root (or document fragment, which is what a shadow root appears to be under certain conditions). Therefore, we have to create a wrapper for the shadow root that we can use as the portal node. Once React supports rendering to a shadow root, this can be simplified.

## Differences to native Shadow DOM

A keen eye might spot this and notice that it's not how you do normal Shadow DOM:

```js
<Slot>This will NOT be bold.</Slot>
```

_Don't worry, this is actually using the standard APIs and distribution algorithm._
