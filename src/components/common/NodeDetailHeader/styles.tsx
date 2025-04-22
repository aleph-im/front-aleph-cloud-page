import { NodeAvatar, addClasses } from '@aleph-front/core'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import HiddenFileInput from '../HiddenFileInput'
import Image from 'next/image'

export type StyledContainerProps = {
  $hash?: string
  $backgroundUrl?: string
}

export const StyledBackgroundEditInput = styled(HiddenFileInput).attrs(
  (props) => {
    return {
      accept: '*.png,*.jpg,*.jpeg,*.svg',
      ...props,
    }
  },
)`
  ${({ theme }) => {
    return css`
      ${tw`absolute -top-4 -right-4 pl-6 pb-5 w-20 h-14 flex items-center justify-center opacity-0 cursor-pointer`}
      /* w-14 h-9 */
      transition: all ease-in-out 0.25s 0s;
      background-color: ${theme.color.base1}66;
      border-bottom-left-radius: 100%;
    `
  }};
`

export const StyledContainer = styled.div<StyledContainerProps>`
  ${({ $backgroundUrl, $hash, theme }) => {
    const keys = Object.keys(theme.gradient)
    const index =
      ($hash || '').split('').reduce((ac, cv) => cv.charCodeAt(0) + ac, 0) %
      keys.length

    const [c1, c2] = theme.gradient[keys[index]].colors

    const bg = $backgroundUrl
      ? `url(${$backgroundUrl})`
      : `linear-gradient(90deg, ${c1}cc 0%, ${c2}cc 100%)`

    return css`
      ${tw`relative flex flex-col h-[12.5rem] justify-end overflow-hidden z-0`}
      background-image: ${bg};
      background-position: center;
      background-size: cover;

      &:before {
        ${tw`absolute inset-0 scale-100 origin-center`}
        content: '';
        background: inherit;
        transition: transform 0.4s ease-in-out;
      }

      &:hover {
        &:before {
          ${tw`scale-110`}
        }

        & > ${StyledBackgroundEditInput} {
          ${tw`opacity-100 top-0 right-0`}
        }
      }
    `
  }}
`

type StyleProps = React.HTMLAttributes<HTMLHeadingElement>
export const StyledTitle = styled.h1.attrs<StyleProps>(addClasses('tp-h5'))`
  ${({ theme }) => {
    return css`
      ${tw`m-0 py-0.5 px-6 z-10`}
      color: ${theme.color.text};
      /* background-color: ${theme.color.base1}19; */
      background-color: ${theme.color.base1}E5;
    `
  }};
`

export const StyledDescription = styled.h2.attrs<StyleProps>(
  addClasses('tp-body3'),
)`
  ${({ theme }) => {
    return css`
      ${tw`m-0 py-3 px-6`}
      color: ${theme.color.text};
    `
  }};
`

export const StyledNodeAvatarEditInput = styled(HiddenFileInput).attrs(
  (props) => {
    return {
      accept: '*.png,*.jpg,*.jpeg,*.svg',
      ...props,
    }
  },
)`
  ${({ theme }) => {
    return css`
      ${tw`absolute inset-0 flex items-center justify-center opacity-0 cursor-pointer`}
      transition: all ease-in-out 0.25s 0s;
      background-color: ${theme.color.base1}66;
      border-radius: 50%;
    `
  }};
`

export const StyledNodeAvatarContainer = styled.div`
  ${tw`my-4 mx-6 relative inline-flex overflow-hidden z-10`}

  &:hover > ${StyledNodeAvatarEditInput} {
    ${tw`opacity-100`}
  }
`

export const StyledNodeAvatar = styled(NodeAvatar).attrs((props) => {
  return {
    size: 'lg',
    Image,
    ...props,
  }
})``
