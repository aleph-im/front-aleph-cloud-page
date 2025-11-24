import React, { useRef } from 'react'
import tw, { css } from 'twin.macro'
import { PermissionsTabContentProps } from './types'
import ButtonLink from '@/components/common/ButtonLink'
import { ellipseAddress } from '@/helpers/utils'
import EntityTable from '@/components/common/EntityTable'
import {
  FloatPosition,
  Icon,
  useClickOutside,
  useFloatPosition,
  useTransition,
  useWindowScroll,
  useWindowSize,
} from '@aleph-front/core'
import CopyToClipboard from '@/components/common/CopyToClipboard'
import { Portal } from '@/components/common/Portal'
import styled from 'styled-components'

type StyledPortalProps = {
  $position: FloatPosition
  $isOpen: boolean
}

const StyledPortal = styled.div<StyledPortalProps>`
  ${({ theme, $position: { x, y }, $isOpen }) => {
    const { background, shadow } = theme.component.walletPicker

    return css`
      ${tw`fixed -top-1 left-1 z-20`}
      min-width: 8rem;
      background: ${background};
      box-shadow: ${shadow};
      backdrop-filter: blur(50px);
      transform: ${`translate3d(${x}px, ${y}px, 0)`};
      opacity: ${$isOpen ? 1 : 0};
      will-change: opacity transform;
      transition: opacity ease-in-out 250ms 0s;
    `
  }}
`

const ActionButton = styled.button`
  ${({ theme }) => {
    return css`
      &:hover {
        background-color: ${theme.color.purple2};
      }
    `
  }}
`

const RowActionsButton = React.memo(({ row }: { row: unknown }) => {
  const [showRowActions, setShowRowActions] = React.useState(false)

  const rowActionsElementRef = useRef<HTMLDivElement>(null)
  const rowActionsButtonRef = useRef<HTMLButtonElement>(null)

  const windowSize = useWindowSize(0)
  const windowScroll = useWindowScroll(0)

  const { shouldMount: shouldMountRowActions, stage: stageRowActions } =
    useTransition(showRowActions, 250)

  const rowActionsOpen = stageRowActions === 'enter'

  const {
    myRef: rowActionsRef,
    atRef: rowActionsTriggerRef,
    position: rowActionsPosition,
  } = useFloatPosition({
    my: 'top-right',
    at: 'bottom-right',
    myRef: rowActionsElementRef,
    atRef: rowActionsButtonRef,
    deps: [windowSize, windowScroll, shouldMountRowActions],
  })

  useClickOutside(() => {
    if (showRowActions) setShowRowActions(false)
  }, [rowActionsRef, rowActionsTriggerRef])

  return (
    <span onClick={(e) => e.stopPropagation()}>
      <button
        ref={rowActionsButtonRef}
        tw="px-4 py-1.5"
        className="bg-background"
        onClick={() => {
          setShowRowActions(!showRowActions)
        }}
      >
        <Icon name="ellipsis" />
      </button>
      {/* <ButtonLink
                          kind="functional"
                          variant="secondary"
                          href={`#`}
                        >
                          <Icon name="angle-right" size="lg" />
                        </ButtonLink> */}
      <Portal>
        {showRowActions && (
          <StyledPortal
            $isOpen={rowActionsOpen}
            $position={rowActionsPosition}
            ref={rowActionsRef}
          >
            <div tw="flex flex-col items-start w-full">
              <ActionButton tw="px-4 py-3 w-full text-left">
                Configure
              </ActionButton>
              <ActionButton tw="px-4 py-3 w-full text-left">
                Revoke
              </ActionButton>
            </div>
          </StyledPortal>
        )}
      </Portal>
    </span>
  )
})
RowActionsButton.displayName = 'RowActionsButton'

export const PermissionsTabContent = React.memo(
  ({ data }: PermissionsTabContentProps) => {
    return (
      <>
        {data.length > 0 ? (
          <>
            <div tw="overflow-auto max-w-full">
              <EntityTable
                borderType="none"
                rowNoise
                rowKey={({ address }) => address}
                data={data}
                columns={[
                  {
                    label: 'Address',
                    sortable: true,
                    render: ({ address }) => {
                      return (
                        <span onClick={(e) => e.stopPropagation()}>
                          <CopyToClipboard
                            text={ellipseAddress(address)}
                            textToCopy={address}
                          />
                        </span>
                      )
                    },
                  },
                  {
                    label: 'Alias',
                    sortable: true,
                    render: ({ alias }) => alias || '-',
                  },
                  {
                    label: 'Channels',
                    render: ({ channels }) => {
                      if (!channels?.length) return 'All'

                      return <>channels.length</>
                    },
                  },
                  {
                    label: 'Permissions',
                    sortable: true,
                    render: ({ types }) => {
                      if (!types?.length) return 'All'

                      return types?.join(', ')
                    },
                  },
                  {
                    label: '',
                    width: '100%',
                    align: 'right',
                    render: (row) => <RowActionsButton row={row} />,
                    cellProps: () => ({
                      css: tw`pl-3!`,
                    }),
                  },
                ]}
                rowProps={(row, i) => ({
                  onClick: () => {
                    alert(`row click ${i}`)
                  },
                })}
              />
            </div>

            <div tw="mt-20 text-center">
              <ButtonLink variant="primary" href="/console/permissions/new">
                Create permissions
              </ButtonLink>
            </div>
          </>
        ) : (
          <div tw="mt-10 text-center">
            <ButtonLink variant="primary" href="/console/permissions/new">
              Create permissions
            </ButtonLink>
          </div>
        )}
      </>
    )
  },
)
PermissionsTabContent.displayName = 'PermissionsTabContent'

export default PermissionsTabContent
