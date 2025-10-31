const defaultApiServer = 'https://api.aleph.im'
const defaultWsServer = 'wss://api.aleph.im'

/**
 * Normalizes API server input by adding protocol if missing
 * Assumes https:// by default unless http:// is explicitly specified
 */
export const normalizeApiServer = (server: string): string => {
  const trimmed = server.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  return `https://${trimmed}`
}

/**
 * Returns the API server for display purposes
 * Strips https:// and wss:// (secure protocols assumed by default)
 * Shows http:// and ws:// for insecure connections
 */
export const getApiServerDisplay = (server: string): string => {
  if (server.startsWith('https://')) {
    return server.replace('https://', '')
  }
  return server
}

/**
 * Gets the full API server URL from localStorage or default
 */
export const getApiServer = (): string => {
  if (typeof window === 'undefined') return defaultApiServer
  const stored = localStorage.getItem('apiServer')
  if (!stored) return defaultApiServer
  return normalizeApiServer(stored)
}

/**
 * Gets the WebSocket server URL based on the API server
 */
export const getWsServer = (): string => {
  const apiServer = getApiServer()
  if (apiServer === defaultApiServer) return defaultWsServer
  return apiServer.replace('https://', 'wss://').replace('http://', 'ws://')
}

export const apiServer = getApiServer()
export const wsServer = getWsServer()
