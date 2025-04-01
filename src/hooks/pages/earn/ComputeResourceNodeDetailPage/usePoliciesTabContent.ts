import { useCallback, useEffect, useMemo, useState } from 'react'
import { UseComputeResourceNodeDetailPageReturn } from '@/hooks/pages/earn/ComputeResourceNodeDetailPage/useComputeResourceNodeDetailPage'
import { apiServer } from '@/helpers/constants'
import { MessageManager } from '@/domain/message'
import { MessageType } from '@aleph-sdk/message'
import { FileManager } from '@/domain/file'

export type usePoliciesTabContentProps = Pick<
  UseComputeResourceNodeDetailPageReturn,
  'termsAndConditionsCtrl' | 'handleRemovePolicies' | 'node' | 'isOwner'
>

export type usePoliciesTabContentReturn = {
  isOwner?: boolean
  documentName: string
  documentCID: string
  documentLink: string
  policiesHistory: PoliciesHistory | undefined
  termsAndConditionsCtrl: UseComputeResourceNodeDetailPageReturn['termsAndConditionsCtrl']
  isLoadingHistoryMessages: boolean
  fileValue: any
  removePoliciesDisabled: boolean
  isCurrentVersion: (policies: PoliciesRecord) => boolean
  handleFileChange: (files?: any) => void
  handleDownloadFile: (fileHash: string, fileName: string) => Promise<void>
  handleRemovePolicies: () => void
}

type PoliciesRecord = {
  time: Date
  cid: string
  name: string
}
type PoliciesHistory = Map<string, PoliciesRecord>

export function usePoliciesTabContent({
  node,
  termsAndConditionsCtrl,
  handleRemovePolicies,
  ...props
}: usePoliciesTabContentProps): usePoliciesTabContentReturn {
  const {
    field: { onChange, value },
  } = termsAndConditionsCtrl

  // -----------------------------
  // States

  const [amendMessages, setAmendMessages] = useState<any[]>()
  const [isLoadingAmendMessages, setIsLoadingAmendMessages] = useState(true)
  const [policiesHistory, setPoliciesHistory] = useState<PoliciesHistory>()
  const [isLoadingHistoryMessages, setIsLoadingHistoryMessages] = useState(true)

  // -----------------------------
  // Memos

  const messageManager = useMemo(() => {
    return new MessageManager()
  }, [])

  const fileManager = useMemo(() => {
    return new FileManager()
  }, [])

  const currentPolicies = useMemo(() => {
    if (!policiesHistory) return

    const lastPolicies = policiesHistory?.entries().next().value
    if (!lastPolicies) return

    return lastPolicies[1]
  }, [policiesHistory])

  const documentName = useMemo(
    () => (isLoadingHistoryMessages ? '' : currentPolicies?.name || ' '),
    [isLoadingHistoryMessages, currentPolicies],
  )

  const documentCID = useMemo(
    () => (isLoadingHistoryMessages ? '' : currentPolicies?.cid || ' '),
    [isLoadingHistoryMessages, currentPolicies],
  )

  const documentLink = useMemo(
    () =>
      isLoadingHistoryMessages
        ? ''
        : currentPolicies
          ? `${apiServer}/api/v0/storage/raw/${currentPolicies?.cid}`
          : ' ',
    [isLoadingHistoryMessages, currentPolicies],
  )

  const removePoliciesDisabled = useMemo(
    () => !policiesHistory?.size,
    [policiesHistory],
  )

  // @todo: Refactor FileInputProps to accept File too
  // Adjust the file value to match FileInputProps
  const fileValue = useMemo(() => {
    if (value instanceof File) {
      return value as any
    }
    return undefined
  }, [value])

  // -----------------------------
  // Callbacks

  const isCurrentVersion = useCallback(
    (policies: PoliciesRecord) => {
      if (!currentPolicies) return false

      return policies === currentPolicies
    },
    [currentPolicies],
  )

  // -----------------------------
  // Handlers

  // Adjust the onChange function to accept ExtFile | ExtFile[] | undefined
  const handleFileChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (files?: any) => {
      const file = Array.isArray(files) ? files[0] : files
      onChange(file)
    },
    [onChange],
  )

  const handleDownloadFile = useCallback(
    async (fileHash: string, fileName: string) => {
      const downloadedFile = await fileManager.downloadFile(fileHash)
      const customDownloadUrl = window.URL.createObjectURL(downloadedFile)
      const a = document.createElement('a')
      a.href = customDownloadUrl
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(customDownloadUrl)
    },
    [fileManager],
  )

  // -----------------------------
  // Effects

  // Fetch all amend messages related to the node
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoadingAmendMessages(true)
      if (!messageManager) return setAmendMessages(undefined)
      if (!node) return setAmendMessages(undefined)

      try {
        const { messages } = await messageManager?.getAll({
          messageTypes: [MessageType['post']],
          refs: [node.hash],
          addresses: [node.owner],
        })

        setAmendMessages(messages)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoadingAmendMessages(false)
      }
    }

    fetchMessages()
  }, [messageManager, node])

  // Fetch all policies messages related to the node
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoadingHistoryMessages(true)

      if (isLoadingAmendMessages) return setPoliciesHistory(undefined)
      if (!messageManager) return setPoliciesHistory(undefined)
      if (!amendMessages) return setPoliciesHistory(undefined)

      try {
        const history = new Map<string, PoliciesRecord>()
        for (const message of amendMessages) {
          const policiesMessageHash =
            message.content?.content?.details.terms_and_conditions

          if (!policiesMessageHash) break

          let storeMessageContent
          try {
            const { content } =
              await messageManager?.get<MessageType.store>(policiesMessageHash)
            storeMessageContent = content
          } catch (e) {
            console.error(e)
          }

          if (!storeMessageContent) continue

          history.set(policiesMessageHash, {
            time: new Date(message.content.time * 1000),
            cid: storeMessageContent.item_hash,
            name: storeMessageContent.metadata?.name as string,
          })
        }

        const sortedHistory = new Map(
          Array.from(history).sort(
            ([, { time: a }], [, { time: b }]) => b.getTime() - a.getTime(),
          ),
        )

        setPoliciesHistory(sortedHistory)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoadingHistoryMessages(false)
      }
    }

    fetchMessages()
  }, [amendMessages, isLoadingAmendMessages, messageManager])

  return {
    documentName,
    documentCID,
    documentLink,
    policiesHistory,
    termsAndConditionsCtrl,
    isLoadingHistoryMessages,
    fileValue,
    removePoliciesDisabled,
    isCurrentVersion,
    handleFileChange,
    handleDownloadFile,
    handleRemovePolicies,
    ...props,
  }
}