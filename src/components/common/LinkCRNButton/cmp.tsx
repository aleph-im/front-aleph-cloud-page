import { memo, useCallback, useMemo } from 'react'
import { Button } from '@aleph-front/core'
import { CCN, CRN } from '@/domain/node'
import { UseLinkingReturn, useLinking } from '@/hooks/common/node/useLinking'
import ButtonWithInfoTooltip, {
  ButtonWithInfoTooltipProps,
} from '@/components/common/ButtonWithInfoTooltip'

export type LinkCRNButtonProps = {
  node: CRN
  userNode?: CCN
  accountBalance?: number
  onLink?: UseLinkingReturn['handleLink']
  onUnlink?: UseLinkingReturn['handleUnlink']
}

// https://github.com/aleph-im/aleph-account/blob/main/src/components/NodesTable.vue#L298
export const LinkCRNButton = ({
  node,
  userNode,
  onLink,
  onUnlink,
}: LinkCRNButtonProps) => {
  const {
    isLinkableByUser: isLinkableByUserCheck,
    isUnlinkableByUser: isUnlinkableByUserCheck,
    handleLink: defaultHandleLink,
    handleUnlink: defaultHandleUnlink,
    isEthereumNetwork,
    getEthereumNetworkTooltip,
  } = useLinking()

  const handleLink = onLink || defaultHandleLink
  const handleUnlink = onUnlink || defaultHandleUnlink

  const isLinkableByUser = useMemo(
    () => node && userNode && isLinkableByUserCheck(node, userNode),
    [isLinkableByUserCheck, node, userNode],
  )

  const isUnlinkableByUser = useMemo(
    () => node && isUnlinkableByUserCheck(node),
    [isUnlinkableByUserCheck, node],
  )

  const handleOnClick = useCallback(() => {
    if (!userNode) return

    if (isUnlinkableByUser) {
      handleUnlink(node.hash)
    } else {
      handleLink(node, userNode)
    }
  }, [handleLink, handleUnlink, isUnlinkableByUser, node, userNode])

  const buttonDisabled =
    (!isLinkableByUser && !isUnlinkableByUser) || !isEthereumNetwork
  const tooltipContent = getEthereumNetworkTooltip()

  const buttonProps: Omit<ButtonWithInfoTooltipProps, 'children'> = {
    kind: 'gradient',
    size: 'md',
    variant: 'secondary',
    color: isUnlinkableByUser ? 'main1' : 'main0',
    onClick: handleOnClick,
    disabled: buttonDisabled,
  }

  if (!isEthereumNetwork) {
    return (
      <ButtonWithInfoTooltip
        {...buttonProps}
        tooltipContent={tooltipContent}
        tooltipPosition={{
          my: 'bottom-center',
          at: 'top-center',
        }}
      >
        {isUnlinkableByUser ? 'Unlink' : 'Link'}
      </ButtonWithInfoTooltip>
    )
  }

  return (
    <>
      {!isUnlinkableByUser ? (
        <Button
          kind="gradient"
          size="md"
          variant="secondary"
          color="main0"
          onClick={handleOnClick}
          disabled={!isLinkableByUser}
        >
          Link
        </Button>
      ) : (
        <Button
          kind="gradient"
          size="md"
          variant="secondary"
          color="main0"
          onClick={handleOnClick}
        >
          Unlink
        </Button>
      )}
    </>
  )
}
LinkCRNButton.displayName = 'LinkCRNButton'

export default memo(LinkCRNButton)
