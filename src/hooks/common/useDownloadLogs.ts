import { downloadBlob } from '@/helpers/utils'
import { useNotification } from '@aleph-front/core'
import { useCallback, useEffect, useRef, useState } from 'react'
import { UseRequestExecutableLogsFeedReturn } from './useRequestEntity/useRequestExecutableLogsFeed'

export type UseDownloadLogsProps = {
  fileName: string
  logs: UseRequestExecutableLogsFeedReturn
}

export type UseDownloadLogsReturn = {
  handleDownloadLogs: () => void
  isDownloadingLogs: boolean
}

export default function useDownloadLogs({
  fileName,
  logs,
}: UseDownloadLogsProps): UseDownloadLogsReturn {
  const noti = useNotification()

  const [downloadingLogs, setDownloadingLogs] = useState(false)
  const [handlingLogsDownloading, setHandlingLogsDownloading] = useState(false)
  const downloadTimeoutRef = useRef<NodeJS.Timeout>()

  const handleDownloadLogs = useCallback(() => {
    // If already downloading, don't start another download
    if (handlingLogsDownloading || downloadingLogs) return

    try {
      // Set UI feedback state
      setHandlingLogsDownloading(true)

      // Set flag to trigger logs subscription without changing tab
      setDownloadingLogs(true)

      // Set a timeout to handle case where logs don't become available
      downloadTimeoutRef.current = setTimeout(() => {
        // If logs haven't been downloaded by this time, show error
        setDownloadingLogs(false)
        setHandlingLogsDownloading(false)

        noti?.add({
          variant: 'warning',
          title: 'Download failed',
          text: 'Logs could not be retrieved in time. Please try again.',
        })
      }, 30000) // 30 second timeout to allow for wallet authentication
    } catch (e) {
      console.error('Error initiating logs download:', e)

      // Show error notification
      noti?.add({
        variant: 'error',
        title: 'Error downloading logs',
        text: (e as Error)?.message,
      })

      // Reset states
      setDownloadingLogs(false)
      setHandlingLogsDownloading(false)

      // Clear timeout
      if (downloadTimeoutRef.current) {
        clearTimeout(downloadTimeoutRef.current)
        downloadTimeoutRef.current = undefined
      }
    }
  }, [handlingLogsDownloading, downloadingLogs, noti])

  // This effect handles downloading logs when they become available during download mode
  useEffect(() => {
    const downloadLogFiles = (
      fileName: string,
      stdout: string,
      stderr: string,
    ) => {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const sanitizedName = fileName.replace(/\s+/g, '_').toLowerCase()

      // Download stdout file
      if (stdout.trim()) {
        downloadBlob(
          new Blob([stdout], { type: 'text/plain' }),
          `stdout_${sanitizedName}_${timestamp}.log`,
        )
      }

      // Download stderr file
      if (stderr.trim()) {
        downloadBlob(
          new Blob([stderr], { type: 'text/plain' }),
          `stderr_${sanitizedName}_${timestamp}.log`,
        )
      }
    }

    if (downloadingLogs && logs) {
      const { stdout, stderr } = logs

      // If we have some content to download
      if (stdout.length > 0 || stderr.length > 0) {
        // Download the logs
        downloadLogFiles(fileName, stdout, stderr)

        // Clear the timeout
        if (downloadTimeoutRef.current) {
          clearTimeout(downloadTimeoutRef.current)
          downloadTimeoutRef.current = undefined
        }

        // Reset states
        setDownloadingLogs(false)
        setHandlingLogsDownloading(false)
      }
    }

    return () => {
      if (downloadTimeoutRef.current) {
        clearTimeout(downloadTimeoutRef.current)
      }
    }
  }, [downloadingLogs, logs, fileName])

  return {
    handleDownloadLogs,
    isDownloadingLogs: downloadingLogs || handlingLogsDownloading,
  }
}
