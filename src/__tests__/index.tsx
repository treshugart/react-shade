import * as React from "react";
import { render as reactDomRender } from "react-dom";
import Root, { Slot } from "..";

document.body.innerHTML = "<div></div>";

function render(node): HTMLElement {
  const { firstChild } = document.body;
  reactDomRender(node, firstChild);

  // The wrapper creates a wrapping node because ReactDOM's createPortal()
  // function can't render to a shadow root, so we must reach in and return
  // the wrapper it generates.
  return firstChild.firstChild;
}

test("creates a shadow root", () => {
  const root = render(<Root />);
  expect(root.shadowRoot).toBeDefined();
});

test("renders text into the shadow root", () => {
  const root = render(<Root>test</Root>);
  expect(root.shadowRoot.innerHTML).toMatchSnapshot();
});

test("renders elements into the shadow root", () => {
  const root = render(
    <Root>
      <div>test</div>
    </Root>
  );
  expect(root.shadowRoot.innerHTML).toMatchSnapshot();
});

test("rendered inside of another node", () => {
  const root = render(
    <section>
      <Root>
        <div>test</div>
      </Root>
    </section>
  );
  expect(root.outerHTML).toMatchSnapshot();
  expect(root.firstChild.shadowRoot.innerHTML).toMatchSnapshot();
});

test("props - tag", () => {
  const root = render(<Root tag="span">test</Root>);
  expect(root.outerHTML).toMatchSnapshot();
  expect(root.shadowRoot.innerHTML).toMatchSnapshot();
});

test("Slot - renders a slot", () => {
  const root = render(
    <Root>
      <Slot />
    </Root>
  );
  expect(root.outerHTML).toMatchSnapshot();
  expect(root.shadowRoot.innerHTML).toMatchSnapshot();
});

test("Slot - renders multiple slots", () => {
  const root = render(
    <Root>
      <Slot />
      <Slot />
      <Slot />
    </Root>
  );
  expect(root.outerHTML).toMatchSnapshot();
  expect(root.shadowRoot.innerHTML).toMatchSnapshot();
});

test("Slot - slots content", () => {
  const root = render(
    <Root>
      <Slot>content 1</Slot>
      <Slot>
        <span>content 2</span>
      </Slot>
      <Slot>
        <span>content 3</span>
      </Slot>
    </Root>
  );

  // Sanity check for the host.
  expect(root.outerHTML).toMatchSnapshot();

  // To look at the slots.
  expect(root.shadowRoot.innerHTML).toMatchSnapshot();

  // To look at where the light DOM is rendered.
  expect(root.parentNode.outerHTML).toMatchSnapshot();
});
