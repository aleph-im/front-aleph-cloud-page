import AutoBreadcrumb from '@/components/AutoBreadcrumb'
import BaseContainer from '@/components/Container'
import ButtonLink from '@/components/ButtonLink'
import IconText from '@/components/IconText'
import NoisyContainer from '@/components/NoisyContainer'
import { useAppState } from '@/contexts/appState'
import { deleteVM, getMessage } from '@/helpers/aleph'
import {
  breadcrumbNames,
  defaultVMURL,
  programStorageURL,
} from '@/helpers/constants'
import {
  convertBitUnits,
  downloadBlob,
  ellipseAddress,
  getExplorerURL,
  isVolume,
  isVolumePersistent,
} from '@/helpers/utils'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'
import {
  Button,
  Col,
  Icon,
  Row,
  Tag,
  TextGradient,
  useNotification,
} from '@aleph-front/aleph-core'
import {
  ProgramMessage,
  StoreMessage,
} from 'aleph-sdk-ts/dist/messages/message'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'

const Separator = styled.hr`
  ${tw`my-5`}
  border: 0;
  border-top: 1px solid #fff;
  opacity: 0.25;
`

const Container = ({ children }: { children: ReactNode }) => (
  <Row xs={1} lg={12} gap="0">
    <Col xs={1} lg={12} xl={8} xlOffset={3}>
      <BaseContainer>
        <div tw="max-w-[961px] mx-auto">{children}</div>
      </BaseContainer>
    </Col>
  </Row>
)

export default function DashboardManage() {
  const router = useRouter()
  const { hash } = router.query

  const [, copyToClipboard] = useCopyToClipboard()
  const noti = useNotification()

  const copyAndNotify = (value: string) => {
    copyToClipboard(value)
    if (noti) {
      noti.add({
        variant: 'success',
        title: 'Copied to clipboard',
      })
    }
  }

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
    if (!message) throw new Error('Invalid message')

    await deleteVM(account, message)
  }

  const handleDownload = async () => {
    if (!message) return

    if (!isVolume(message)) {
      const ref = (message as ProgramMessage).content.code.ref
      const storeMessageRef = await getMessage(ref)

      const req = await fetch(
        programStorageURL + (storeMessageRef as StoreMessage).content.item_hash,
      )
      const blob = await req.blob()

      return downloadBlob(blob, `VM_${message.item_hash.slice(-12)}.zip`)
    }

    const req = await fetch(
      programStorageURL + (message as StoreMessage).content.item_hash,
    )
    const blob = await req.blob()

    return downloadBlob(blob, `Volume_${message.item_hash.slice(-12)}.sqsh`)
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
        <Container>
          <NoisyContainer>Loading...</NoisyContainer>
        </Container>
      </>
    )

  return (
    <>
      <AutoBreadcrumb
        names={breadcrumbNames}
        name={displayedInformation.name.toUpperCase()}
      />
      <section tw="px-0 pt-20 pb-6 md:py-10">
        <Container>
          <div tw="flex justify-between pb-5">
            <div tw="flex items-center">
              <Icon
                name={
                  displayedInformation.itemType === 'Volume'
                    ? 'spider-web'
                    : 'alien-8bit'
                }
                tw="mr-4"
                className="text-main1"
              />
              <div className="tp-body2">{displayedInformation.name}</div>
            </div>
            <div>
              <Button
                size="regular"
                variant="tertiary"
                color="main0"
                kind="neon"
                tw="!mr-4"
                forwardedAs="a"
                onClick={handleDownload}
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
            <div tw="flex items-center justify-start overflow-hidden">
              <Tag className="tp-body2 fs-sm" tw="mr-4">
                {displayedInformation.itemType}
              </Tag>
              <div tw="flex-1">
                <span className="tp-info text-main0">ITEM HASH</span>
                <div tw="text-ellipsis overflow-hidden whitespace-nowrap">
                  {hash}
                </div>
              </div>
            </div>

            <Separator />

            {!isVolume(message) && (
              <div tw="my-5">
                <span className="tp-info text-main0">FUNCTION LINE</span>
                <div>
                  <a
                    className="tp-body1 fs-sm"
                    href={defaultVMURL + hash}
                    target="_blank"
                    referrerPolicy="no-referrer"
                  >
                    {defaultVMURL + ellipseAddress(hash as string)}

                    <Icon name="square-up-right" tw="ml-2.5" />
                  </a>
                </div>
              </div>
            )}

            <div tw="my-5">
              <span className="tp-info text-main0">EXPLORER</span>
              <div>
                <a
                  className="tp-body1 fs-sm"
                  href={getExplorerURL(message)}
                  target="_blank"
                  referrerPolicy="no-referrer"
                >
                  https://explorer.aleph.im/
                  <Icon name="square-up-right" tw="ml-2.5" />
                </a>
              </div>
            </div>

            <div tw="my-5 flex">
              <div>
                <span className="tp-info text-main0">CREATED ON</span>
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
                    {isVolumePersistent(volume) ? (
                      <>
                        <span className="tp-info text-main0">
                          PERSISTENT VOLUME
                        </span>
                        <div>
                          {convertBitUnits(volume.size_mib, {
                            from: 'mb',
                            to: 'gb',
                            displayUnit: true,
                          })}
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="tp-info text-main0">
                          IMMUTABLE VOLUME
                        </span>
                        <div>
                          <Link
                            className="tp-body1 fs-sm"
                            href={`/dashboard/manage?hash=${volume.ref}`}
                          >
                            Volume details
                            <Icon name="square-up-right" tw="ml-2.5" />
                          </Link>
                        </div>
                        <IconText
                          text={volume.ref}
                          iconName="copy"
                          callback={() => copyAndNotify(volume.ref)}
                        />
                      </>
                    )}
                  </div>
                ))}
              </>
            )}
          </NoisyContainer>
          <div tw="mt-20 text-center">
            {isVolume(message) ? (
              <ButtonLink variant="primary" href="/dashboard/volume">
                Create volume
              </ButtonLink>
            ) : (
              <ButtonLink variant="primary" href="/dashboard/function">
                Create function
              </ButtonLink>
            )}
          </div>
          <p tw="my-24 text-center">
            Acquire aleph.im tokens for versatile access to resources within a
            defined duration. These tokens remain in your wallet without being
            locked or consumed, providing you with flexibility in utilizing
            aleph.im&apos;s infrastructure. If you choose to remove the tokens
            from your wallet, the allocated resources will be efficiently
            reclaimed. Feel free to use or hold the tokens according to your
            needs, even when not actively using Aleph.im&apos;s resources.
          </p>
        </Container>
      </section>
    </>
  )
}