import AutoBreadcrumb from "@/components/AutoBreadcrumb";
import CenteredSection from "@/components/CenteredSection";
import NoisyContainer from "@/components/NoisyContainer";
import { deleteVM, getMessage } from "@/helpers/aleph";
import { defaultVMURL, programStorageURL } from "@/helpers/constants";
import { ActionTypes } from "@/helpers/store";
import { ellipseAddress, getExplorerURL } from "@/helpers/utils";
import { AppStateContext } from "@/pages/_app";
import { Button, Icon, Tag, TextGradient } from "@aleph-front/aleph-core";
import { ProgramMessage } from "aleph-sdk-ts/dist/messages/message";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";


const Separator = styled.hr.attrs({ className: 'my-md' })`
  border: 0;
  border-top: 1px solid #FFF;
  opacity: .25;
`

export default function Home( ){
  const router = useRouter()
  const { hash } = router.query
  if(!hash || typeof hash !== 'string') 
    router.replace('../')

  const [ message, setMessage ] = useState<ProgramMessage | undefined>(undefined)

  useEffect(() => {
    const dispatchMsg = async () => {
      const msg = await getMessage(hash as string)
      setMessage(msg as ProgramMessage)
    }
    dispatchMsg()
  }, [])

  if(!message) return (
    <>
      <AutoBreadcrumb name="..." />

      <CenteredSection>
        <NoisyContainer>Loading...</NoisyContainer>
      </CenteredSection>
    </>
  )

  const [ globalState, dispatchGlobal ] = useContext(AppStateContext)
  
  
  const handleDelete = async () => {
    // Account is instanciated in useConnected hook
    // @ts-ignore
    await deleteVM(globalState.account, message);
  }

  return (
    <>
      <AutoBreadcrumb name={message.content?.metadata?.name} />

      <CenteredSection>
        <div className="d-flex flex-jc-sb py-sm">
          <div className="d-flex flex-ai-c">
            <Icon name="alien-8bit" className="mr-sm" />
            <div>{message.content?.metadata?.name}</div>
          </div>
          <div>
            <Button 
              size="regular" 
              variant="tertiary" 
              color="main0" 
              kind="neon" 
              className="mr-sm" 
              as="a" 
              href={programStorageURL + message.item_hash}>
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
            <Tag className="tp-body2 fs-sm mr-sm">Function</Tag>
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

          <Separator />
        </NoisyContainer>
      </CenteredSection>
    </>
  )
}