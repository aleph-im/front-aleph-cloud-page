import { useAppState } from '@/contexts/appState'
import { useConfidentialsAuthorization } from './useConfidentialsAuthorization'
import { useMemo } from 'react'
import {
  AuthorizationDenyAction,
  AuthorizationGrantAction,
  AuthorizationState,
} from '@/store/authorization'

export function useAuthorization(): AuthorizationState {
  const [{ authorization }, dispatch] = useAppState()

  const authzConfidentials = useConfidentialsAuthorization()

  useMemo(() => {
    authzConfidentials
      ? dispatch(new AuthorizationGrantAction({ features: ['confidentials'] }))
      : dispatch(new AuthorizationDenyAction({ features: ['confidentials'] }))
  }, [dispatch, authzConfidentials])

  return authorization
}
