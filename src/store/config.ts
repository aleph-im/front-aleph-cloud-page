import { themes } from '@aleph-front/core'
import { StoreReducer } from './store'

export type ConfigState = {
  theme: keyof typeof themes | 'twentysixDark'
}

export const initialState: ConfigState = {
  theme: 'twentysix',
}

export enum ConfigActionType {
  SWITCH_THEME = 'SWITCH_THEME',
}

export class ConfigSwitchThemeAction {
  readonly type = ConfigActionType.SWITCH_THEME
  constructor(
    public payload: {
      theme: ConfigState['theme']
    },
  ) {}
}

export type ConfigAction = ConfigSwitchThemeAction

export type ConfigReducer = StoreReducer<ConfigState, ConfigAction>

export function getConfigReducer(): ConfigReducer {
  return (state = initialState, action) => {
    const { type, payload } = action

    switch (type) {
      case ConfigActionType.SWITCH_THEME: {
        return {
          ...state,
          theme: payload.theme,
        }
      }
      default: {
        return state
      }
    }
  }
}
