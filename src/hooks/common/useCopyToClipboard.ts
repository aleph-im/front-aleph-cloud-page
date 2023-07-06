import { useNotification } from '@aleph-front/aleph-core'
import { useCallback, useState } from 'react'

export type CopiedValue = string | null
export type CopyFn = (text: string) => Promise<boolean> // Return success
export type CopyAndNotifyFn = (text: string) => Promise<void>

export function useCopyToClipboard(): [CopiedValue, CopyFn] {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null)

  const copy: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported')
      return false
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      return true
    } catch (error) {
      console.warn('Copy failed', error)
      setCopiedText(null)
      return false
    }
  }

  return [copiedText, copy]
}

export function useCopyToClipboardAndNotify(): [CopiedValue, CopyAndNotifyFn] {
  const [copiedText, copyToClipboard] = useCopyToClipboard()
  const noti = useNotification()

  const copyAndNotify = useCallback(
    (text: string) => {
      const success = copyToClipboard(text)

      if (!success) return
      if (!noti) return

      noti.add({
        variant: 'success',
        title: 'Copied to clipboard',
      })
    },
    [copyToClipboard, noti],
  )

  return [copiedText, copyAndNotify]
}

export default useCopyToClipboard
