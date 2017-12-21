import React from 'react';
import { render } from 'react-dom';
import Root, { Slot, styled } from '../src';

const Heading = styled(
  {
    ':host': {
      margin: '10px 0'
    }
  },
  { name: ({ num }) => `h${num || 2}` }
);
const Hr = styled({
  ':host': {
    borderBottom: '1px solid black',
    marginBottom: 10,
    marginTop: 10
  }
});
const Demo = ({ name, children }) => (
  <section>
    <Heading>{name}</Heading>
    {children}
  </section>
);
const App = () => (
  <div>
    <Demo name="Simple">
      <Root>No slots or anything.</Root>
    </Demo>
    <Hr />
    <Demo name="Slots">
      <p className="title">
        This paragraph has a title class and should not be styled like the
        following titles for each slot.
      </p>
      <Root>
        <style>{`
          .title {
            font-size: 1.2em;
            font-weight: bold;
            margin: 10px 0
          }
        `}</style>
        <div className="title">Only text</div>
        <Slot>Slot 1</Slot>
        <p>
          (This should be wrapped with a <code>&lt;span /&gt;</code> tag by
          default.)
        </p>

        <div className="title">Wrapper span</div>
        <Slot>
          <span>Slot 2</span>
        </Slot>
      </Root>
    </Demo>
  </div>
);

render(<App />, window.root);
