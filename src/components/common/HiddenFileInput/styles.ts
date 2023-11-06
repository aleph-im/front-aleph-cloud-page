import styled from 'styled-components'

export const StyledHiddenFileInput = styled.input
  .withConfig({
    shouldForwardProp: (prop, defaultValidatorFn) =>
      ['webkitDirectory', 'directory'].includes(prop) ||
      defaultValidatorFn(prop),
  })
  // @ts-ignore
  .attrs(({ webkitDirectory, directory }) => ({ webkitDirectory, directory }))`
  display: none;
`
