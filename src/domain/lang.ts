import { FunctionRuntimeId } from './runtime'

export enum FunctionLangId {
  Python = 'python',
  Node = 'node',
  Other = 'other',
}

export type FunctionLang = {
  id: FunctionLangId
  lang: 'python' | 'javascript' | 'text'
  runtime: string
}

export const FunctionLanguage: Record<FunctionLangId, FunctionLang> = {
  [FunctionLangId.Python]: {
    id: FunctionLangId.Python,
    lang: 'python',
    runtime: FunctionRuntimeId.Runtime1,
  },
  [FunctionLangId.Node]: {
    id: FunctionLangId.Node,
    lang: 'javascript',
    runtime: FunctionRuntimeId.Runtime3,
  },
  [FunctionLangId.Other]: {
    id: FunctionLangId.Other,
    lang: 'text',
    runtime: FunctionRuntimeId.Custom,
  },
}
