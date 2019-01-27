declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      __ssr_scope?: any;
      ref?: any;
    }
    interface IntrinsicElements {
      slot: {
        children?: any;
        name?: string;
      };
    }
  }
}

export type StyleProps = Function | { [s: string]: StyleValue };
export type StyleRules = Function | { [s: string]: StyleProps };
export type StyleValue =
  | Function
  | string
  | number
  | Array<Function | string | number>;
