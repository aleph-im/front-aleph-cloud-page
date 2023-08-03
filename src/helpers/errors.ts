// eslint-disable-next-line import/no-anonymous-default-export
export default {
  ChainNotYetSupported: new Error('Chain is not yet supported'),
  RequestTimeout: new Error('Request timed out'),
  RequestFailed: (cause: unknown) => new Error('Request failed', { cause }),
}

export type FormErrorsRuleId = 'required' | 'requiredBoolean'

export const formValidationRules: Record<FormErrorsRuleId, any> = {
  required: {
    value: true,
    message: 'Required field',
  },

  requiredBoolean: (v: boolean | undefined) =>
    typeof v === 'boolean' || 'Required field',
}
