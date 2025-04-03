import { HTMLAttributes, memo } from 'react'
import {
  StyledBackgroundEditInput,
  StyledContainer,
  StyledDescription,
  StyledNodeAvatar,
  StyledNodeAvatarContainer,
  StyledNodeAvatarEditInput,
  StyledTitle,
} from './styles'
import { AlephNode } from '@/domain/node'
import { UseCoreChannelNodeDetailPageReturn } from '@/components/pages/account/earn/CoreChannelNodeDetailPage/hook'
import NodeDetailEditableField from '../NodeDetailEditableField'
import { Icon } from '@aleph-front/core'
import { useFileToImg } from '@/hooks/common/node/useFileToImg'

export type NodeDetailHeaderProps = HTMLAttributes<HTMLDivElement> & {
  node?: AlephNode
} & Pick<
    UseCoreChannelNodeDetailPageReturn,
    'nameCtrl' | 'descriptionCtrl' | 'pictureCtrl' | 'bannerCtrl' | 'isOwner'
  >

export const NodeDetailHeader = ({
  nameCtrl,
  descriptionCtrl,
  bannerCtrl,
  pictureCtrl,
  isOwner,
  node,
  ...rest
}: NodeDetailHeaderProps) => {
  const { img: pictureImg } = useFileToImg({ file: pictureCtrl.field.value })
  const { img: bannerImg } = useFileToImg({ file: bannerCtrl.field.value })

  return (
    <div {...rest}>
      <StyledContainer
        {...{
          $hash: node?.hash,
          $backgroundUrl: bannerImg?.src,
        }}
      >
        {isOwner && (
          <StyledBackgroundEditInput
            {...bannerCtrl.field}
            {...bannerCtrl.fieldState}
            resetValue={node?.banner}
          >
            {bannerCtrl.field.value !== node?.banner ? (
              <Icon name="trash" />
            ) : (
              <Icon name="edit" />
            )}
          </StyledBackgroundEditInput>
        )}
        <div>
          <StyledNodeAvatarContainer>
            <StyledNodeAvatar src={pictureImg?.src} />
            {isOwner && (
              <StyledNodeAvatarEditInput
                {...pictureCtrl.field}
                {...pictureCtrl.fieldState}
                resetValue={node?.picture}
              >
                {pictureCtrl.field.value !== node?.picture ? (
                  <Icon name="trash" />
                ) : (
                  <Icon name="edit" />
                )}
              </StyledNodeAvatarEditInput>
            )}
          </StyledNodeAvatarContainer>
        </div>
        <StyledTitle>
          <NodeDetailEditableField
            {...nameCtrl.field}
            {...nameCtrl.fieldState}
            placeholder="name"
            isOwner={isOwner}
          />
        </StyledTitle>
      </StyledContainer>
      {(descriptionCtrl.field.value || isOwner) && (
        <StyledDescription>
          <NodeDetailEditableField
            {...descriptionCtrl.field}
            {...descriptionCtrl.fieldState}
            placeholder="description"
            isOwner={isOwner}
            wrap
          />
        </StyledDescription>
      )}
    </div>
  )
}
NodeDetailHeader.displayName = 'NodeDetailHeader'

export default memo(NodeDetailHeader)
