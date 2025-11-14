import styled, { css } from 'styled-components'
import tw from 'twin.macro'

export const StyledCodeContainer = styled.div`
  ${tw`relative pt-8 rounded-xl h-fit`}

  ${({ theme }) => {
    return css`
      color: ${theme.color.white};
      background:
        linear-gradient(91.23deg, #ffffff11 11.38%, #ffffff00 96.5%),
        linear-gradient(84.86deg, #2260ff0c 65.23%, #1859ff00 99.89%), #141327;
    `
  }}
`

export const StyledCopyCodeContainer = styled.div`
  ${({ theme }) => {
    return css`
      ${tw`flex items-center gap-2 absolute top-0 right-0 cursor-pointer px-3 py-1 z-10 opacity-50`}
      color: ${({ theme }) => theme.color.purple4};

      transition-property: opacity;
      transition-duration: ${theme.transition.duration.fast}ms;
      transition-timing-function: ${theme.transition.timing};

      &:hover {
        ${tw`opacity-100`}
      }
    `
  }}
`

export const StyledFileInputContainer = styled.div<{
  isEncryptedDiskImagePresent?: boolean
}>`
  ${({ isEncryptedDiskImagePresent }) => {
    return isEncryptedDiskImagePresent
      ? css`
          ${tw`flex flex-col space-y-10 items-center`}
        `
      : css`
          ${tw``}
        `
  }}
`
