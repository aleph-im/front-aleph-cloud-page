import AutoBreadcrumb from "@/components/AutoBreadcrumb";
import CenteredSection from "@/components/CenteredSection";
import NoisyContainer from "@/components/NoisyContainer";
import { useAppState } from "@/contexts/appState";
import { deleteVM, getMessage } from "@/helpers/aleph";
import { defaultVMURL, programStorageURL } from "@/helpers/constants";
import { ellipseAddress, getExplorerURL, isVolume } from "@/helpers/utils";
import { Button, Icon, Tag, TextGradient } from "@aleph-front/aleph-core";
import { ProgramMessage, StoreMessage } from "aleph-sdk-ts/dist/messages/message";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Separator = styled.hr.attrs({ className: 'my-md' })`
  border: 0;
  border-top: 1px solid #FFF;
  opacity: .25;
`

export default function DashboardManage() {
  const router = useRouter()
  const { hash } = router.query

  useEffect(() => {
    if (!hash || typeof hash !== 'string')
      router.replace('../')
  }, [hash, router])

  const [message, setMessage] = useState<ProgramMessage | StoreMessage | undefined>(undefined)

  useEffect(() => {
    const dispatchMsg = async () => {
      const msg = await getMessage(hash as string)
      if(isVolume(msg as StoreMessage | ProgramMessage))
        setMessage(msg as StoreMessage)
      else
        setMessage(msg as ProgramMessage)
    }
    dispatchMsg()
  }, [])

  const [globalState, dispatchGlobal] = useAppState()

  if (!message) return (
    <>
      <AutoBreadcrumb name="..." />

      <CenteredSection>
        <NoisyContainer>Loading...</NoisyContainer>
      </CenteredSection>
    </>
  )


  const handleDelete = async () => {
    // Account is instanciated in useConnected hook
    // @ts-ignore
    await deleteVM(globalState.account, message);
  }

  type DisplayedInformation = {
    name: string,
    downloadLink: string,
    itemType: string,
    linkedVolumes: any[]
  }
  const displayedInformation: DisplayedInformation = {
    name: "",
    downloadLink: "",
    itemType: "",
    linkedVolumes: []
  }
  if(isVolume(message)) {
    displayedInformation.name = ellipseAddress(message.item_hash)
    displayedInformation.downloadLink = programStorageURL + message.item_hash
    displayedInformation.itemType = "Volume"
  } else {
    displayedInformation.name = (message as ProgramMessage).content?.metadata?.name || "<Unknown>"
    displayedInformation.downloadLink = programStorageURL + (message as ProgramMessage).content.code.ref
    displayedInformation.itemType = "Function"
    displayedInformation.linkedVolumes = (message as ProgramMessage).content.volumes
  }

  return (
    <>
      <AutoBreadcrumb name={displayedInformation.name} />

      <CenteredSection>
        <div className="d-flex flex-jc-sb py-sm">
          <div className="d-flex flex-ai-c">
            <Icon name="alien-8bit" className="mr-sm" />
            <div>{displayedInformation.name}</div>
          </div>
          <div>
            <Button
              size="regular"
              variant="tertiary"
              color="main0"
              kind="neon"
              className="mr-sm"
              as="a"
              href={displayedInformation.downloadLink}>
              Download
            </Button>
            <Button
              size="regular"
              variant="tertiary"
              color="main2"
              kind="neon"
              onClick={handleDelete}>Delete</Button>
          </div>
        </div>

        <NoisyContainer>
          <div className="d-flex flex-ai-s">
            <Tag className="tp-body2 fs-sm mr-sm">{displayedInformation.itemType}</Tag>
            <div>
              <TextGradient type="info">ITEM HASH</TextGradient>
              <div>{hash}</div>
            </div>
          </div>

          <Separator />

          <div className="my-md">
            <TextGradient type="info">FUNCTION LINE</TextGradient>
            <div>
              <a className="tp-body1 fs-sm" href={defaultVMURL + hash} target="_blank" referrerPolicy="no-referrer">
                {defaultVMURL + ellipseAddress(hash as string)}

                <Icon name="arrow-up-right-from-square" className="ml-xs" />
              </a>
            </div>
          </div>

          <div className="my-md">
            <TextGradient type="info">EXPLORER</TextGradient>
            <div>
              <a className="tp-body1 fs-sm" href={getExplorerURL(message)} target="_blank" referrerPolicy="no-referrer">
                https://explorer.aleph.im/

                <Icon name="arrow-up-right-from-square" className="ml-xs" />
              </a>
            </div>
          </div>

          { displayedInformation.linkedVolumes.length > 0 &&
            <>
              <Separator />

              <TextGradient type="h6" color="main1">Linked storage</TextGradient>
              { displayedInformation.linkedVolumes.map((volume, i) => (
                  <div className="my-md" key={i}>
                    <TextGradient type="info">
                      {volume?.persistence === 'host' ? "Persistent " : "Immutable "} volume
                    </TextGradient>

                    <pre>
                      {JSON.stringify(volume, null, 2)}
                    </pre>
                  </div>
                ))
              }
          </>
          }
          </NoisyContainer>
      </CenteredSection>
    </>
  )
}
