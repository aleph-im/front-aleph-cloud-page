import { createGlobalStyle } from "styled-components";

export const GlobalStylesOverride = createGlobalStyle`
  main {
    min-height: 800px;
  }

  .unavailable-content *:not(.unavailable-label) {
    opacity: 0.5;
    filter: grayscale(1);
    pointer-events: none;
  }
`