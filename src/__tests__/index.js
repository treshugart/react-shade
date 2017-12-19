import React from 'react';
import { render as reactDomRender } from 'react-dom';
import { renderIntoDocument } from 'react-dom/test-utils';
import ShadowRoot from '..';

document.body.innerHTML = '<div></div>';

function render(node) {
  const { firstChild } = document.body;
  reactDomRender(node, firstChild);

  // The wrapper creates a wrapping node because ReactDOM's createPortal()
  // function can't render to a shadow root, so we must reach in and return
  // the wrapper it generates.
  return firstChild.firstChild;
}

test('creates a shadow root', () => {
  const root = render(<ShadowRoot />);
  expect(root.shadowRoot).toBeDefined();
});

test('renders text into the shadow root', () => {
  const root = render(<ShadowRoot>test</ShadowRoot>);
  expect(root.shadowRoot.innerHTML).toBe('<div>test</div>');
});

test('renders elements into the shadow root', () => {
  const root = render(
    <ShadowRoot>
      <div>test</div>
    </ShadowRoot>
  );
  expect(root.shadowRoot.innerHTML).toBe('<div><div>test</div></div>');
});

test('rendered inside of another node', () => {
  const root = render(
    <section>
      <ShadowRoot>
        <div>test</div>
      </ShadowRoot>
    </section>
  );
  expect(root.nodeName).toBe('SECTION');
  expect(root.firstChild.shadowRoot.innerHTML).toBe(
    '<div><div>test</div></div>'
  );
});

test('props - tag', () => {
  const root = render(<ShadowRoot tag="span">test</ShadowRoot>);
  expect(root.nodeName).toBe('SPAN');
  expect(root.shadowRoot.innerHTML).toBe('<span>test</span>');
});
