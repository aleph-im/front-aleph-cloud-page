import { Control, UseControllerReturn, useController } from 'react-hook-form'

export const defaultAddIPFSFileOrCidValue: DefaultAddIPFSFileOrCid = {
  type: 'file',
  cid: undefined,
  file: undefined,
}

export type DefaultAddIPFSFileOrCid = {
  type: 'file' | 'cid'
  cid?: string
  file?: File
}

export type UseAddFileOrCidProps = {
  name?: string
  control: Control
  defaultValue?: DefaultAddIPFSFileOrCid
}

export type UseAddFileOrCidReturn = {
  typeCtrl: UseControllerReturn<any, any>
}

export function useAddIPFSFileOrCid({
  name = 'code',
  control,
  defaultValue = defaultAddIPFSFileOrCidValue,
}: UseAddFileOrCidProps): UseAddFileOrCidReturn {
  const typeCtrl = useController({
    control,
    name: `${name}.type`,
    defaultValue: defaultValue?.type,
  })

  return {
    typeCtrl,
  }
}
