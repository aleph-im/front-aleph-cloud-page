import { Buffer } from 'buffer'
import type { AuthPubKeyToken } from '@/domain/executable'

const KEY_PREFIX = 'aleph_auth_'

function storageKey(address: string): string {
  return `${KEY_PREFIX}${address.toLowerCase()}`
}

function isExpired(token: AuthPubKeyToken): boolean {
  try {
    const decoded = Buffer.from(token.pubKeyHeader.payload, 'hex').toString(
      'utf-8',
    )
    const { expires } = JSON.parse(decoded)
    return new Date(expires).valueOf() < Date.now()
  } catch {
    return true
  }
}

export function getStoredToken(address: string): AuthPubKeyToken | undefined {
  try {
    const raw = sessionStorage.getItem(storageKey(address))
    if (!raw) return undefined
    const token = JSON.parse(raw) as AuthPubKeyToken
    if (isExpired(token)) {
      sessionStorage.removeItem(storageKey(address))
      return undefined
    }
    return token
  } catch {
    return undefined
  }
}

export function setStoredToken(address: string, token: AuthPubKeyToken): void {
  try {
    sessionStorage.setItem(storageKey(address), JSON.stringify(token))
  } catch {
    // sessionStorage may be blocked (private browsing, quota exceeded)
  }
}

export function clearStoredToken(address: string): void {
  try {
    sessionStorage.removeItem(storageKey(address))
  } catch {}
}
