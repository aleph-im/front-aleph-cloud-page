import { memo } from 'react'
import { IconTextProps } from './types'
import { Text } from '@/components/pages/console/common'
import { StyledContainer, StyledIcon } from './styles'

export const IconText = ({ children, onClick, iconName }: IconTextProps) => {
  return (
    <StyledContainer onClick={onClick}>
      <Text tw="break-all">{children}</Text>
      <StyledIcon
        name={iconName}
        tw="cursor-pointer ml-2"
        className="text-purple4"
      />
    </StyledContainer>
  )
}
IconText.displayName = 'IconText'

export default memo(IconText) as typeof IconText
