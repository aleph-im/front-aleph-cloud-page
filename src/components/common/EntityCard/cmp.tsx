import React, { memo } from 'react'
import { Icon, NoisyContainer, ObjectImg } from '@aleph-front/core'
import ButtonLink from '../ButtonLink'
import { EntityCardProps } from './types'

export const EntityCard = ({
  title,
  img,
  children,
  link,
  entity,
}: EntityCardProps) => {
  return (
    <NoisyContainer
      type="grain-2"
      tw="flex flex-col max-w-[16rem] h-[14.75rem]"
    >
      <div>
        <div tw="flex items-center gap-2.5 mb-2.5" className="tp-header fs-16">
          <ObjectImg shape color="main0" size={36} id={img as any} /> {title}
        </div>
        <div className="fs-12">{children}</div>
      </div>
      <div tw="mt-auto">
        <ButtonLink variant="textOnly" size="sm" href={link}>
          <Icon name="plus-circle" /> Create your {entity}
        </ButtonLink>
      </div>
    </NoisyContainer>
  )
}
EntityCard.displayName = 'EntityCard'

export default memo(EntityCard) as typeof EntityCard
