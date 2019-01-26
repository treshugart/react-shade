import { createContext } from "react";

export default createContext<{
  scope: number;
  shadowRoot: ShadowRoot;
  ssr: boolean;
}>({
  scope: 0,
  shadowRoot: null,
  ssr: false
});
