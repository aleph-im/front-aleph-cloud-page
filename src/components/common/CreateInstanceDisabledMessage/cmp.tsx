import { memo, useCallback, useState } from 'react'
import { Icon, useTransition } from '@aleph-front/core'
import BorderBox from '@/components/common/BorderBox'
import { CreateInstanceDisabledMessageProps } from './types'
import tw from 'twin.macro'
import styled, { css } from 'styled-components'

const StyledToggleBar = styled.div`
  ${tw`flex items-center justify-end gap-2 cursor-pointer mt-4`}
`

const StyledIcon = styled(Icon)<{ $isOpen: boolean }>`
  ${({ $isOpen }) => css`
    ${tw`transition-transform duration-200`}
    transform: rotate(${$isOpen ? 180 : 0}deg);
  `}
`

const StyledDetailsContainer = styled.div<{ $isOpen: boolean }>`
  ${({ $isOpen }) => css`
    ${tw`overflow-hidden transition-all duration-200`}
    max-height: ${$isOpen ? '500px' : '0'};
    opacity: ${$isOpen ? 1 : 0};
  `}
`

const StyledReasonsList = styled.ul`
  ${tw`mt-4 pl-4 space-y-1`}
  list-style-type: disc;
`

export const CreateInstanceDisabledMessage = ({
  title,
  description,
  details,
}: CreateInstanceDisabledMessageProps) => {
  const [open, setOpen] = useState(false)

  const { shouldMount, stage } = useTransition(open, 200)
  const isOpen = stage === 'enter'

  const handleToggle = useCallback(() => setOpen((prev) => !prev), [])

  return (
    <BorderBox $color="warning">
      <p className="tp-body3 fs-18 text-base2">{title}</p>
      <p className="tp-body1 fs-14 text-base2">{description}</p>
      {details && details.length > 0 && (
        <>
          <StyledToggleBar onClick={handleToggle}>
            <span className="tp-body3 fs-14">View details</span>
            <StyledIcon name="angle-down" size="sm" $isOpen={isOpen} />
          </StyledToggleBar>
          {shouldMount && (
            <StyledDetailsContainer $isOpen={isOpen}>
              <StyledReasonsList>
                {details.map((detail, index) => (
                  <li key={index} className="tp-body1 fs-12">
                    {detail}
                  </li>
                ))}
              </StyledReasonsList>
            </StyledDetailsContainer>
          )}
        </>
      )}
    </BorderBox>
  )
}

CreateInstanceDisabledMessage.displayName = 'CreateInstanceDisabledMessage'

export default memo(CreateInstanceDisabledMessage)
