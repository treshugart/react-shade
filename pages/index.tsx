import * as React from "react";
import Root, { Slot, Style } from "../src";
import { Demo, Hr, Text, Theme } from "./__components";

type Props = {
  grid: number;
};

type State = {
  grid: string;
};

export default class App extends React.Component<Props, State> {
  static defaultProps = {
    grid: 10
  };
  state = {
    grid: ""
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
            styled like the following titles. The <code>code</code> style should
            also remain untouched.
          </p>
          <Root>
            <Style>
              {{
                ".title": {
                  fontSize: "1.2em",
                  fontWeight: "bold",
                  margin: "var(--grid) 0"
                },
                code: {
                  backgroundColor: "papayawhip",
                  borderRadius: "var(--border-radius)",
                  display: "inline-block",
                  padding: "calc(var(--grid) / 2)"
                }
              }}
            </Style>

            <p className="title">
              This is <code>code</code> in the root.
            </p>
            <Slot>
              <p className="title">
                This is <code>code</code> in the slot. We still need to find a
                way to unscope these.
              </p>
            </Slot>
          </Root>
        </Demo>
      </div>
    );
  }
}
