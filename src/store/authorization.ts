import { StoreReducer } from './store'

export type AuthorizationState = {
  confidentials: boolean
}

export const initialState: AuthorizationState = {
  confidentials: false,
}

export enum AuthorizationActionType {
  AUTHORIZATION_GRANT = 'AUTHORIZATION_GRANT',
  AUTHORIZATION_DENY = 'AUTHORIZATION_DENY',
}

export class AuthorizationGrantAction {
  readonly type = AuthorizationActionType.AUTHORIZATION_GRANT
  constructor(
    public payload: {
      features: (keyof AuthorizationState)[]
    },
  ) {}
}

export class AuthorizationDenyAction {
  readonly type = AuthorizationActionType.AUTHORIZATION_DENY
  constructor(
    public payload: {
      features: (keyof AuthorizationState)[]
    },
  ) {}
}

export type AuthorizationAction =
  | AuthorizationGrantAction
  | AuthorizationDenyAction

export type AuthorizationReducer = StoreReducer<
  AuthorizationState,
  AuthorizationAction
>

export function getAuthorizationReducer(): AuthorizationReducer {
  return (state = initialState, action) => {
    const { type, payload } = action

    switch (type) {
      case AuthorizationActionType.AUTHORIZATION_GRANT: {
        return {
          ...state,
          ...payload.features.reduce(
            (acc, feature) => ({ ...acc, [feature]: true }),
            {},
          ),
        }
      }
      case AuthorizationActionType.AUTHORIZATION_DENY: {
        return {
          ...state,
          ...payload.features.reduce(
            (acc, feature) => ({ ...acc, [feature]: false }),
            {},
          ),
        }
      }
      default: {
        return state
      }
    }
  }
}
