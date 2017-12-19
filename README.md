# react-shadow-dom

> Project description.

## Install

```sh
npm install react-shadow-dom
```

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
