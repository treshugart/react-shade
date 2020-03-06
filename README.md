# react-shade

> Use the native Shadow DOM API declaratively in React.

- 🗜️ [1.7k](https://bundlephobia.com/result?p=react-shade@0.4.0)
- 🌲 Browser-native CSS scoping on the client.
- 🖥️ Simulated CSS scoping on the server.
- ✍️ Write your CSS with strings, objects or functions.
- 🥤 Works with the Shadow DOM polyfill (only needed for IE11 and pre-Chromium Edge).

## Install

```sh
npm install react-shade
```

## Why

Most CSS solutions for React scope CSS by simulating it, but there are
browser-based primitives that already do this for us.

This library exposes the imperative
[Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM)
API as a set of React components that you can use declaratively.

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
  <style>
    .totes-not-global {
      font-weight: bold;
    }
  </style>
  <span class="totes-not-global">This will be bold.</span>
  <slot name="slot-0"></slot>
</div>
```

### `Root`

The `Root` component creates an element with a `shadowRoot` attached to it. This
is the outer-boundary for scoping, meaning nothing comes in, and nothing gets
out. You can use it standalone, or with the other components.

#### About the root `<div />` node

Attaching a shadow root requires a real DOM node. We don't want to reach up in
the hierarchy and mutate the DOM, so the `Root` component needs to generate a
node to attach a shadow to. This defaults to a `div`, but can be whatever you
want. This isn't something that will ever be able to change due to the nature of
the DOM and React.

### `Slot`

The `Slot` component declares an inner-boundary for your shadow root. Anything
placed inside of a `<Slot />` will not affect anything in the ancestor `Root`
and the `Root` cannot affect anything in the `<Slot />`.

#### Why not just use `<slot />`?

`<Slot />` was chosen because it's a more idiomatic way of declaring content
where custom elements aren't being used. Underneath the hood, the `Slot` will
portal the content back to the host so it gets distributed using the built-in
algorithms.

```js
<Slot>
  <span className="totes-not-global">This will NOT be bold</span>
</Slot>
```

### `Style`

The `Style` component may seem redundant when you can just use `<style />` but
it does a number of things.

- If you need SSR, or simulated scoping, you should use `Style`.
- If you want to use objects and functions to represent your CSS, then you
  should use `Style`.
- If you would like your styles to be minified with your standard JS tooling,
  then you should use `Style`.
- If you don't care about those things, you're free to use the standard `style`
  tag.

The following is a very simple use case that uses only an object to represent
your CSS.

```js
<Style>
  {{
    selector: {
      style: "property"
    }
  }}
</Style>
```

You can also specify functions that react to props that are passed to `Style`.
Both the set of rules and each property can be specified as a function. Whatever
`props` that are passed to `Style` will be passed through.

```js
const rulesAsFunction = ({ font }) => ({
  body: {
    fontFamily: valueAsFunction
  }
});
const valueAsFunction = ({ font }) => font;

<Style font={"Helvetica"}>{rulesAsFunction}</Style>;
```

You may also specify an `Array` for a value and it will be mapped into a string
using the standard rules listed above.

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

#### Passing props vs CSS variables

Props are useful for passing in data from your application state. However, it's
recommended you simply use CSS variables where you don't need to do that.

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

#### Why can't you pass a string to `<Style />`?

There's currently no support for using strings as we'd have to parse the strings
to simulate scoping and this is not simple nor inexpensive. Using objects makes
it far simpler. We're not opposed to finding a way to be able to use strings,
it's just not an immediate priority. Please reach out if this is something you'd
like to discuss.

### `styled` - creating styled components

There is a `styled` export that is a shortcut for creating primitive components
that have a default styling.

```js
import React from "react";
import { styled } from "react-shade";

const Div = styled("div", {
  ":host": {
    fontSize: "1.2em",
    padding: 10
  }
});
```

#### Why don't you provide `styled.div()`?

We don't provide functions for each HTMLElement because it would cause a lot of
bloat for little benefit. If you want to do this, it's pretty easy.

```js
const div = styled.bind(null, "div");
const Div = div(css);
```

#### Why don't you provide `` styled.div`${css}` ``?

We don't provide a template literal API because we don't have to parse any CSS.
You can use `<style />` directly, and use your own template literals, but we
don't provide scoping for it. To keep things simple, we've only provided scoping
simulation when running on the server (for SSR) or if using the Shadow DOM
polyfill. For more information, see those sections.

## Server-side rendering

A big caveat of Shadow DOM for some is that it only comes with an imperative DOM
API. This means that it doesn't support server-side rendering out of the box.
We're happy to say that react-shade supports server-side rendering and there's
nothing you need to do on your end to make it work; it's 100% plug and play.

> "The best API is no API" - not me

Simulated scoping currently supports:

- `:host`
- `:host(selector)`
- `:host-context(selector)`
- `any-selector` (will be prefixed by the scope and turned into a descendant
  selector)

**_Prefixing selectors is how other CSS-in-JS libraries simulate scoping._**
It's worth noting as a caveat because native Shadow DOM does not have this
limitation and provides much stronger selector scoping. The recommended thing to
do here would be to limit your use of descendant selectors within your
components.

The worst-case-scenario is that you might have a selector that bleeds in SSR or
under the polyfill. If your components are rehydrated in a browser that supports
native Shadow DOM, scoping will be fixed when the shadow roots are created.

## Differences to native Shadow DOM

A keen eye might spot some of these and notice that it's not how you'd normally
do Shadow DOM with imperative JavaScript or HTML. I assure you, that is only
superficial. _All aspects of react-shade's API fully utilises the native APIs._

## Using the Shadow DOM polyfill

To use `react-shade` in browsers that don't support the native APIs you'll want
to include the Shadow DOM polyfill. You can find this at
https://unpkg.com/@webcomponents/webcomponentsjs.

That polyfill doesn't support CSS scoping and integrating
[`shadycss`](https://github.com/webcomponents/shadycss) is non-trivial, so we've
gone ahead and simulated scoping when running under the polyfill because this is
basically the same thing as when running in an SSR environment.
