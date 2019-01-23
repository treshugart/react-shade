# react-shade

> Use the native Web Component Shadow DOM API declaratively in React.

Check out the [demo](https://react-shade.netlify.com/) and [code](https://github.com/treshugart/react-shade/tree/master/demo) for it!

* 🗜️ [2.8k](https://bundlephobia.com/result?p=react-shade@0.3.0)
* 🌲 Browser-native CSS scoping.
* ✍️ Write your CSS with strings, objects or functions that return either.
* 🥤 Works with Shadow DOM polyfill.

## Install

```sh
npm install react-shade
```

## Why

This library exposes the W3C standardised [Web Component](https://github.com/w3c/webcomponents) APIs for [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM) as a set of React components. This side-steps a lot of work that needs to be done to work with the imperative APIs - as well as the proposed [declarative APIs](https://github.com/whatwg/dom/issues/510) - and gives you a nice, clean and simple interface to encapsulate your DOM / styles in a perfectly declarative manner.

## Usage

```js
import React from "react";
import { render } from "react-dom";
import Root, { Slot, Style } from "react-shade";

const App = () => (
  <Root>
    <Style>
      {{
        ".totes-not-global": {
          fontWeight: "bold"
        }
      }}
    </Style>
    <span className="totes-not-global">This will be bold.</span>
    <Slot>
      <span className="totes-not-global">This will NOT be bold</span>
    </Slot>
  </Root>
);

render(<App />, window.root);
```

This will produce something like:

```html
<!-- Requires a wrapping node because it needs to have a node to attach
the shadow root to. -->
<div>
  <!-- This is where the slot content ends up (as light DOM). -->
  <span class="totes-not-global" slot="slot-0">This will NOT be bold</span>
  #shadow-root
    <style>.totes-not-global{font-weight:bold;}</style>
    <span class="totes-not-global">This will be bold.</span>
    <slot name="slot-0"></slot>
</div>
```

### About the root `<div />` node

Attaching a shadow root requires a real DOM node. We don't want to reach up in the hierarchy and mutate the DOM, so the `Root` component needs to generate a node to attach a shadow to. This defaults to a `div`, but can be whatever you want. This isn't something that will ever be able to change due to the nature of the DOM and React.

## Creating styled components

There is a `styled` export that is a shortcut for creating primitive components that have a default styling.

```js
import React from "react";
import { styled } from "react-shade";

const Div = styled({
  ":host": {
    fontSize: "1.2em",
    padding: 10
  }
});
```

## Differences to native Shadow DOM

A keen eye might spot some of these and notice that it's not how you'd normally do Shadow DOM with imperative JavaScript or HTML. I assure you, that is only superficial. _All aspects of react-shade's API fully utilises the native APIs._

### Custom slot component

This was chosen because it's a more idiomatic way of declaring content where custom elements aren't being used. Underneath the hood, the `Slot` will portal the content back to the host so it gets distributed using the built-in algorithms.

```js
<Slot>
  <span className="totes-not-global">This will NOT be bold</span>
</Slot>
```

### Custom style component

This may appear to be syntactic sugar for using objects to represent your style strings, but there's a bit more to it.

```js
<Style>
  {{
    selector: {
      style: "property"
    }
  }}
</Style>
```

For example, this can be minified without adding anything extra to your build pipeline. You can also specify functions that react to props that are passed to `Style`. Both the set of rules and each property can be specified as a function. Whatever `props` that are passed to `Style` will be passed through.

```js
const rulesAsFunction = ({ font }) => ({
  body: {
    fontFamily: valueAsFunction
  }
});
const valueAsFunction = ({ font }) => font;

<Style font={"Helvetica"}>{rulesAsFunction}</Style>;
```

You may also specify an `Array` for a value and it will be mapped into a string using the standard rules listed above.

```js
<Style prop={"property"}>
  {{
    body: {
      margin: [10, 0]
    }
  }}
</Style>
```

_NOTE: All numeric values will get converted to `px` units._

#### CSS custom properties (variables)

Props are useful for passing in data from your application state. However, it's recommended you simply use CSS variables where you don't need to do that.

```js
<Style>
  {{
    ":root": {
      "--grid-size": 5
    },
    body: {
      margin: ["calc(var(--grid-size) * 2)", 0]
    }
  }}
</Style>
```

## Usage in non-native environments

To use `react-shade` in browsers that don't support the native APIs you'll want to include the Shadow DOM polyfill. You can find this at https://unpkg.com/@webcomponents/webcomponentsjs.

Unfortunately, that polyfill doesn't support CSS scoping. You'd normally have to find a way to use [`shadycss`](https://github.com/webcomponents/shadycss), but integrating it is non-trivial due to its reliance on `<template>` and imperative APIs.

In order to scope CSS, we've placed a dependency on [`shadow-css`](https://github.com/treshugart/shadow-css) and the CSS that you pass to `<Style>` will automatically be scoped using it if you're running in a non-native environment. Check out the [demo](https://react-shade.netlify.com/) in a browser that [doesn't support ShadowDOM](https://caniuse.com/#feat=shadowdomv1).

**_Beware of the limitations of `shadow-css`!_**
