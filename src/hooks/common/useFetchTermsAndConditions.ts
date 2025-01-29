import { useAppState } from '@/contexts/appState'
import { StoreContent } from '@aleph-sdk/message'
import { useEffect, useState } from 'react'

export type TermsAndConditions = {
  cid: string
  name: string
  url: string
}

export type UseFetchTermsAndConditionsProps = {
  termsAndConditionsMessageHash?: string
}

export type UseFetchTermsAndConditionsReturn = {
  loading: boolean
  termsAndConditions?: TermsAndConditions
}

export default function useFetchTermsAndConditions({
  termsAndConditionsMessageHash,
}: UseFetchTermsAndConditionsProps): UseFetchTermsAndConditionsReturn {
  const [state] = useAppState()
  const {
    manager: { messageManager },
  } = state

  const [loading, setLoading] = useState(true)
  const [termsAndConditions, setTermsAndConditions] = useState<
    TermsAndConditions | undefined
  >()

  useEffect(() => {
    const fetchTermsAndConditions = async () => {
      try {
        if (!messageManager) return setTermsAndConditions(undefined)
        if (!termsAndConditionsMessageHash)
          return setTermsAndConditions(undefined)

        setLoading(true)

        let storeMessageContent
        try {
          const { content } = await messageManager.get(
            termsAndConditionsMessageHash,
          )
          storeMessageContent = content as StoreContent
        } catch (e) {
          console.error(e)
        }

        if (!storeMessageContent) return setTermsAndConditions(undefined)

        const cid = storeMessageContent.item_hash
        const name = storeMessageContent.metadata?.name as string

        setTermsAndConditions({
          cid,
          name,
          url: `https://ipfs.aleph.im/ipfs/${cid}?filename=${name}`,
        })
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchTermsAndConditions()
  }, [messageManager, termsAndConditionsMessageHash])

  return {
    loading,
    termsAndConditions,
  }
}
