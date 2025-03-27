/**
 * Creates downloadable log files from stdout and stderr content
 *
 * @param instanceName Name of the instance for the filename
 * @param stdout Standard output logs content
 * @param stderr Standard error logs content
 */
export function downloadLogFiles(
  instanceName: string,
  stdout: string,
  stderr: string,
): void {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const sanitizedName = instanceName.replace(/\s+/g, '_').toLowerCase()

  // Download stdout file
  if (stdout.trim()) {
    downloadFile(`stdout_${sanitizedName}_${timestamp}.log`, stdout)
  }

  // Download stderr file
  if (stderr.trim()) {
    downloadFile(`stderr_${sanitizedName}_${timestamp}.log`, stderr)
  }
}

/**
 * Helper function to download a file with the given content
 */
function downloadFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
