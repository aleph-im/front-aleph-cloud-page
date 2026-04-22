import { useCallback, useEffect, useRef, useState } from 'react'
import { getApiServer } from '@/helpers/server'

export type TransferStatus = 'pending' | 'processed' | 'rejected' | 'unknown'

export type UseTransferStatusReturn = {
  status: TransferStatus
  loading: boolean
  error?: Error
  startPolling: (itemHash: string) => void
  stopPolling: () => void
}

const POLL_INTERVAL = 5000

export function useTransferStatus(): UseTransferStatusReturn {
  const [status, setStatus] = useState<TransferStatus>('unknown')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const itemHashRef = useRef<string | null>(null)

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const checkStatus = useCallback(async (hash: string) => {
    try {
      const apiServer = getApiServer()
      const response = await fetch(`${apiServer}/api/v0/messages/${hash}`)

      if (!response.ok) {
        if (response.status === 404) {
          setStatus('pending')
          return false
        }
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      const messageStatus = data?.status || data?.message?.status

      if (messageStatus === 'processed') {
        setStatus('processed')
        return true
      } else if (messageStatus === 'rejected') {
        setStatus('rejected')
        return true
      } else {
        setStatus('pending')
        return false
      }
    } catch (err) {
      console.error('Error checking transfer status:', err)
      setError(err as Error)
      return false
    }
  }, [])

  const startPolling = useCallback(
    (itemHash: string) => {
      stopPolling()
      setStatus('pending')
      setLoading(true)
      setError(undefined)
      itemHashRef.current = itemHash

      const poll = async () => {
        const isDone = await checkStatus(itemHash)
        if (isDone) {
          stopPolling()
          setLoading(false)
        }
      }

      poll()

      intervalRef.current = setInterval(poll, POLL_INTERVAL)
    },
    [checkStatus, stopPolling],
  )

  useEffect(() => {
    return () => {
      stopPolling()
    }
  }, [stopPolling])

  return {
    status,
    loading,
    error,
    startPolling,
    stopPolling,
  }
}
