import { FileManager } from '@/domain/file'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { defaultValues } from './useNewDomainPage'
import { useCallback, useState } from 'react'
import useConnectedWard from '@/hooks/common/useConnectedWard'
import { useRouter } from 'next/router'
import { useAppState } from '@/contexts/appState'
import { useFileManager } from '@/hooks/common/useManager/useFileManager'
import { RequireOnlyOne } from '@/domain/program'
import { LocalFS } from '@/helpers/ipfs'
import { useHelia } from '@/hooks/common/useHelia'

export type NewIPFSPinningFormState = RequireOnlyOne<
  {
    name: string
    cid: string
    file: FileList
  },
  'cid' | 'file'
>

export function useNewIPFSPinningPage() {
  useConnectedWard()

  const router = useRouter()
  const manager = useFileManager()
  const { fs } = useHelia()
  const [appState, dispatch] = useAppState()
  const [originalFileName, setOriginalFileName] = useState<string | null>(null)

  const onSubmit = useCallback(
    async (state: NewIPFSPinningFormState) => {
      if (!manager) throw new Error('Manager not ready')

      const newFile = await manager.add(state)

      router.push('/dashboard')
    },
    [router, manager],
  )

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    onSubmit,
    resolver: zodResolver(FileManager.addSchema),
  })
  const values = useWatch({ control }) as NewIPFSPinningFormState

  const handleFileChange = useCallback(async (file: File | FileList) => {
    if (!fs) throw new Error('The local FileSystem is not ready')

    const localFS = new LocalFS(fs)
    await localFS.reset()

    console.log(file)
    if (file instanceof FileList) {
      await localFS.addDirectory(file)
      setOriginalFileName(file[0].webkitRelativePath.split('/')[0])
    } else if (file instanceof File) {
      await localFS.addFile(file)
      setOriginalFileName(file.name)
    }

    console.log(await localFS.getRootCID())
  }, [])

  return {
    control,
    handleSubmit,
    errors,
    values,
    handleFileChange,
    originalFileName,
  }
}
