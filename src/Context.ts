import { createContext } from "react";

export default createContext<{
  scope: number;
  shadowRoot: ShadowRoot;
}>({
  scope: null,
  shadowRoot: null
});
