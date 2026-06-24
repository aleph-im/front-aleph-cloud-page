import { apiServer } from './server'

/**
 * Lifecycle of an aleph message as reported by the node, independent of
 * on-chain anchoring (`confirmed`). Mirrors the backend `MessageStatus` enum.
 *
 * - `pending`: received, waiting to be processed.
 * - `processed`: processed successfully.
 * - `rejected`: invalid, rejected by the network.
 * - `forgotten`: content deleted by a FORGET message (user-initiated delete).
 * - `removing`: resources will be removed soon unless the wallet is refilled
 *   (transitional state between `processed` and `removed`).
 * - `removed`: resources have been removed (deleted permanently).
 */
export type EntityMessageStatus =
  | 'pending'
  | 'processed'
  | 'rejected'
  | 'forgotten'
  | 'removing'
  | 'removed'

const VALID_STATUSES: ReadonlySet<string> = new Set<EntityMessageStatus>([
  'pending',
  'processed',
  'rejected',
  'forgotten',
  'removing',
  'removed',
])

/**
 * Narrows an arbitrary backend value to a known status, returning `undefined`
 * for anything outside the union (e.g. a status added by a newer backend) so an
 * unexpected value never reaches the display logic unchecked.
 */
export function parseMessageStatus(
  value: unknown,
): EntityMessageStatus | undefined {
  return typeof value === 'string' && VALID_STATUSES.has(value)
    ? (value as EntityMessageStatus)
    : undefined
}

/**
 * Statuses that still change over time, so they should keep being polled.
 * `processed` is intentionally excluded: it only moves to `removing`/`removed`
 * on rare balance events, which are picked up on the next load rather than
 * polled every tick.
 */
const POLLABLE_STATUSES: ReadonlySet<EntityMessageStatus | undefined> = new Set(
  [undefined, 'pending', 'removing'],
)

export function shouldPollMessageStatus(
  status: EntityMessageStatus | undefined,
): boolean {
  return POLLABLE_STATUSES.has(status)
}

/**
 * Whether the resource's message has been processed successfully — the signal
 * that it is usable/ready (modulo executables still being created on a CRN).
 */
export function isMessageProcessed(
  status: EntityMessageStatus | undefined,
): boolean {
  return status === 'processed'
}

export type MessageStatusVariant = 'success' | 'warning' | 'error'

export type MessageStatusDisplay = {
  label: string
  variant: MessageStatusVariant
  spinner: boolean
}

export type MessageStatusDisplayOptions = {
  /**
   * For executables (instances/functions): a `processed` message only means the
   * message is accepted — the resource still has to be created on its host CRN.
   * Pass `false` until that creation is verified, to keep showing "CREATING".
   */
  ready?: boolean
}

/**
 * Maps a message status to its user-facing label, color, and spinner state.
 * Single source of truth so every view renders the lifecycle the same way.
 */
export function getMessageStatusDisplay(
  status: EntityMessageStatus | undefined,
  { ready = true }: MessageStatusDisplayOptions = {},
): MessageStatusDisplay {
  switch (status) {
    case 'pending':
      return { label: 'REQUESTING', variant: 'warning', spinner: true }
    case 'processed':
      return ready
        ? { label: 'READY', variant: 'success', spinner: false }
        : { label: 'CREATING', variant: 'warning', spinner: true }
    case 'removing':
      return { label: 'REMOVING', variant: 'warning', spinner: true }
    case 'rejected':
      return { label: 'REJECTED', variant: 'error', spinner: false }
    case 'forgotten':
    case 'removed':
      return { label: 'DELETED', variant: 'error', spinner: false }
    // `undefined` (not loaded yet) and any unknown/new backend status fall back
    // to the neutral loading state so a caller destructuring the result never
    // hits an undefined return.
    default:
      return { label: 'LOADING', variant: 'warning', spinner: true }
  }
}

/**
 * Fetches the processing status of a message by item hash.
 *
 * Uses the dedicated `/messages/{hash}/status` endpoint (not yet in the SDK),
 * which is lightweight and returns the full lifecycle status. Returns
 * `undefined` on any failure so callers can keep the previous value.
 */
export async function getMessageStatus(
  itemHash: string,
): Promise<EntityMessageStatus | undefined> {
  try {
    const res = await fetch(`${apiServer}/api/v0/messages/${itemHash}/status`)
    if (!res.ok) return undefined
    const data = await res.json()
    return parseMessageStatus(data?.status)
  } catch {
    return undefined
  }
}
