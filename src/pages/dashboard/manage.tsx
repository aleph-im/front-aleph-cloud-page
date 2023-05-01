import AutoBreadcrumb from '@/components/AutoBreadcrumb'
import CenteredSection from '@/components/CenteredContainer'
import NoisyContainer from '@/components/NoisyContainer'
import { useAppState } from '@/contexts/appState'
import { deleteVM, getMessage } from '@/helpers/aleph'
import {
  breadcrumbNames,
  defaultVMURL,
  programStorageURL,
} from '@/helpers/constants'
import {
  ellipseAddress,
  getExplorerURL,
  humanReadableSize,
  isVolume,
} from '@/helpers/utils'
import { Button, Icon, Tag, TextGradient } from '@aleph-front/aleph-core'
import {
  MessageType,
  ProgramMessage,
  StoreMessage,
} from 'aleph-sdk-ts/dist/messages/message'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'

const Separator = styled.hr`
  ${tw`my-5`}
  border: 0;
  border-top: 1px solid #fff;
  opacity: 0.25;
`

export default function DashboardManage() {
  const router = useRouter()
  const { hash } = router.query

  useEffect(() => {
    if (!hash || typeof hash !== 'string') router.replace('../')
  }, [hash, router])

  const [message, setMessage] = useState<
    ProgramMessage | StoreMessage | undefined
  >(undefined)

  useEffect(() => {
    const dispatchMsg = async () => {
      const msg = await getMessage(hash as string)
      if (isVolume(msg as StoreMessage | ProgramMessage))
        setMessage(msg as StoreMessage)
      else setMessage(msg as ProgramMessage)
    }
    dispatchMsg()
  }, [hash])

  const [globalState] = useAppState()

  const handleDelete = async () => {
    const { account } = globalState

    if (!account) throw new Error('Invalid account')
    if (!message || message.type !== MessageType.program)
      throw new Error('Invalid message')

    await deleteVM(account, message)
  }

  type DisplayedInformation = {
    name: string
    downloadLink: string
    itemType: string
    linkedVolumes: any[]
    date: string[]
  }

  const displayedInformation: DisplayedInformation | undefined = useMemo(() => {
    if (!message) return

    const di: DisplayedInformation = {
      name: '',
      downloadLink: '',
      itemType: '',
      linkedVolumes: [],
      date: new Date(message.time * 1000).toISOString().split('T'),
    }

    if (isVolume(message)) {
      di.name = ellipseAddress(message.item_hash)
      di.downloadLink = programStorageURL + message.item_hash
      di.itemType = 'Volume'
    } else {
      di.name =
        (message as ProgramMessage).content?.metadata?.name || '<Unknown>'
      di.downloadLink =
        programStorageURL + (message as ProgramMessage).content.code?.ref
      di.itemType = 'Function'
      di.linkedVolumes = (message as ProgramMessage).content.volumes
    }

    return di
  }, [message])

  if (!message || !displayedInformation)
    return (
      <>
        <CenteredSection>
          <NoisyContainer>Loading...</NoisyContainer>
        </CenteredSection>
      </>
    )

  return (
    <>
      <AutoBreadcrumb
        names={breadcrumbNames}
        name={displayedInformation.name.toUpperCase()}
      />
      <CenteredSection>
        <div tw="flex justify-between py-4">
          <div tw="flex items-center">
            <Icon name="alien-8bit" tw="mr-4" />
            <div>{displayedInformation.name}</div>
          </div>
          <div>
            <Button
              size="regular"
              variant="tertiary"
              color="main0"
              kind="neon"
              tw="!mr-4"
              forwardedAs="a"
              href={displayedInformation.downloadLink}
              target="_blank"
            >
              Download
            </Button>
            <Button
              size="regular"
              variant="tertiary"
              color="main2"
              kind="neon"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>

        <NoisyContainer>
          <div tw="flex items-start">
            <Tag className="tp-body2 fs-sm" tw="mr-4">
              {displayedInformation.itemType}
            </Tag>
            <div>
              <TextGradient type="info">ITEM HASH</TextGradient>
              <div>{hash}</div>
            </div>
          </div>

          <Separator />
          {!isVolume(message) && (
            <div tw="my-5">
              <TextGradient type="info">FUNCTION LINE</TextGradient>
              <div>
                <a
                  className="tp-body1 fs-sm"
                  href={defaultVMURL + hash}
                  target="_blank"
                  referrerPolicy="no-referrer"
                >
                  {defaultVMURL + ellipseAddress(hash as string)}

                  <Icon name="arrow-up-right-from-square" tw="ml-2.5" />
                </a>
              </div>
            </div>
          )}

          <div tw="my-5">
            <TextGradient type="info">EXPLORER</TextGradient>
            <div>
              <a
                className="tp-body1 fs-sm"
                href={getExplorerURL(message)}
                target="_blank"
                referrerPolicy="no-referrer"
              >
                https://explorer.aleph.im/
                <Icon name="arrow-up-right-from-square" tw="ml-2.5" />
              </a>
            </div>
          </div>

          <div tw="my-5 flex">
            <div>
              <TextGradient type="info">SIZE</TextGradient>
              <div>{humanReadableSize(message.size)}</div>
            </div>

            <div tw="ml-10">
              <TextGradient type="info">CREATED ON</TextGradient>
              <div>
                {displayedInformation.date[0]}{' '}
                {displayedInformation.date[1].split('.')[0]}
              </div>
            </div>
          </div>

          {displayedInformation.linkedVolumes.length > 0 && (
            <>
              <Separator />

              <TextGradient type="h6" color="main1">
                Linked storage
              </TextGradient>
              {displayedInformation.linkedVolumes.map((volume, i) => (
                <div tw="my-5" key={i}>
                  <TextGradient type="info">
                    {volume?.persistence === 'host'
                      ? 'Persistent '
                      : 'Immutable '}{' '}
                    volume
                  </TextGradient>

                  <pre>{JSON.stringify(volume, null, 2)}</pre>
                </div>
              ))}
            </>
          )}
        </NoisyContainer>
      </CenteredSection>
    </>
  )
}
