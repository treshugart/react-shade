// @flow

import React, { Component } from 'react';
import { render } from 'react-dom';
import Root, { Slot, Style } from '../src';
import { Demo, Heading, Hr, Text, Theme } from './components';

type Props = {
  grid: number
};

type State = {
  grid: string
};

class App extends Component<Props, State> {
  static defaultProps = {
    grid: 10
  };
  state = {
    grid: ''
  };
  onChangeGrid = e => {
    this.setState({ grid: e.target.value });
  };
  render() {
    const { props, state, onChangeGrid } = this;
    return (
      <div>
        <Theme grid={parseFloat(state.grid) || props.grid} />
        <Text
          autoFocus
          onChange={onChangeGrid}
          style={{ width: 50 }}
          value={state.grid}
        >
          Grid size
        </Text>

        <Hr />

        <Demo name="Simple">
          <Root>No slots or anything.</Root>
        </Demo>

        <Hr />

        <Demo name="Slots">
          <p className="title">
            This paragraph has a <code>title</code> class and should not be
            styled like the following titles.
          </p>
          <Root>
            <Style>
              {{
                '.title': {
                  fontSize: '1.2em',
                  fontWeight: 'bold',
                  margin: 'var(--grid) 0'
                },
                code: {
                  backgroundColor: 'papayawhip',
                  borderRadius: 'var(--border-radius)',
                  display: 'inline-block',
                  padding: 'calc(var(--grid) / 2)'
                }
              }}
            </Style>

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
  }
}

render(<App />, window.root);
