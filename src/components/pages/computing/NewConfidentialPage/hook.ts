import { useAppState } from '@/contexts/appState'
import { useForm } from '@/hooks/common/useForm'
import { useCopyToClipboardAndNotify, useNotification } from '@aleph-front/core'
import { ItemType, StoreMessage } from '@aleph-sdk/message'
import { useRouter } from 'next/router'
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useController, UseControllerReturn, useWatch } from 'react-hook-form'

export type EncryptedFileDiskFormState = {
  encryptedDiskImage?: File | undefined
}

export type EncryptedFileDiskFormResponse = StoreMessage | undefined

export type UseNewConfidentialPageReturn = {
  commands: {
    retrieveScriptsCommand: string
    fetchBaseImageCommand: string
    mountImageCommand: string
    copyRootFileSystemCommand: string
    cleanUpMountCommand: string
    createEncryptedDiskCommand: string
    createConfidentialInstanceCommand: string
    secureChannelWithInstanceCommand: string
    startInstanceCommand: string
  }
  encryptedDiskImageFormValues: EncryptedFileDiskFormState
  encryptedDiskImageCtrl: UseControllerReturn<
    EncryptedFileDiskFormState,
    'encryptedDiskImage'
  >
  encryptedDiskImageItemHash: string | undefined
  disabledUploadEncryptedDiskImage: boolean
  isUploadingFile: boolean
  uploadedFileMessage: StoreMessage | undefined
  uploadEncryptedDiskImageButtonRef: React.RefObject<HTMLInputElement>
  uploadEncryptedDiskImageButtonToolip: string | undefined
  handleUploadEncryptedDiskImage: (e: FormEvent) => Promise<void>
  handleCopyEncryptedDiskImageHash: () => void
  handleBack: () => void
}

export function useNewConfidentialPage(): UseNewConfidentialPageReturn {
  const [state] = useAppState()
  const router = useRouter()
  const notification = useNotification()

  const {
    connection: { account },
    manager: { fileManager },
  } = state

  const [isUploadingFile, setIsUploadingFile] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | undefined>()
  const [uploadedFileMessage, setUploadedFileMessage] = useState<
    StoreMessage | undefined
  >()

  const disabledUploadEncryptedDiskImage = useMemo(() => {
    if (!account) return true
    if (isUploadingFile) return true

    return false
  }, [account, isUploadingFile])

  const encryptedDiskImageItemHash = useMemo(
    () => uploadedFileMessage?.item_hash,
    [uploadedFileMessage],
  )

  const uploadEncryptedDiskImageButtonRef = useRef<HTMLInputElement>(null)
  const uploadEncryptedDiskImageButtonToolip = useMemo(() => {
    if (!disabledUploadEncryptedDiskImage) return

    if (!account) return 'Connect your wallet'
  }, [disabledUploadEncryptedDiskImage, account])

  const onSubmitEncryptedDiskImage = useCallback(
    async (state: EncryptedFileDiskFormState) => {
      if (!fileManager) return
      if (!account) alert('Connect your wallet')

      const { encryptedDiskImage } = state

      if (!encryptedDiskImage) return

      try {
        setIsUploadingFile(true)

        const response = await fileManager.uploadFile(
          encryptedDiskImage,
          ItemType.ipfs,
        )

        setUploadedFile(encryptedDiskImage)

        return response
      } catch (err) {
        console.error(err)
      } finally {
        setIsUploadingFile(false)
      }
    },
    [account, fileManager],
  )

  const onSuccessfulUpload = useCallback(
    async (response: EncryptedFileDiskFormResponse) => {
      if (!response) return

      setUploadedFileMessage(response)

      notification?.add({
        variant: 'success',
        title: 'File uploaded',
        text: 'Encrypted disk image uploaded successfully',
      })
    },
    [notification],
  )

  const {
    control,
    handleSubmit: handleUploadEncryptedDiskImage,
    reset: resetForm,
  } = useForm<EncryptedFileDiskFormState, EncryptedFileDiskFormResponse>({
    defaultValues: {},
    onSubmit: onSubmitEncryptedDiskImage,
    onSuccess: onSuccessfulUpload,
    readyDeps: [],
  })

  const encryptedDiskImageFormValues = useWatch({ control })

  const encryptedDiskImageCtrl = useController({
    control,
    name: 'encryptedDiskImage',
  })

  const handleCopyEncryptedDiskImageHash = useCopyToClipboardAndNotify(
    encryptedDiskImageItemHash || '',
  )

  const handleBack = () => {
    router.push('/computing/confidential/')
  }

  const createConfidentialInstanceCommand = useMemo(() => {
    let command = `aleph instance create --confidential`

    if (encryptedDiskImageItemHash) {
      command += ` \\ \n    --rootfs ${encryptedDiskImageItemHash}`
    }
    return command
  }, [encryptedDiskImageItemHash])

  const commands = {
    retrieveScriptsCommand: `wget https://raw.githubusercontent.com/aleph-im/aleph-vm/main/examples/example_confidential_image/build_debian_image.sh
wget https://raw.githubusercontent.com/aleph-im/aleph-vm/main/examples/example_confidential_image/setup_debian_rootfs.sh`,

    fetchBaseImageCommand: `wget https://cloud.debian.org/images/cloud/bookworm/latest/debian-12-genericcloud-amd64.qcow2`,

    mountImageCommand: `sudo mkdir -p /mnt/debian
sudo guestmount \\
    --format=qcow2 \\
    -a ./debian-12-genericcloud-amd64.qcow2 \\
    -o allow_other \\
    -i /mnt/debian`,

    copyRootFileSystemCommand: `export ROOT_DIR=./extracted
mkdir \${ROOT_DIR}
sudo cp --archive /mnt/debian/* \${ROOT_DIR}`,

    cleanUpMountCommand: `sudo guestunmount /mnt/debian
sudo rm -r /mnt/debian`,

    createEncryptedDiskCommand: `bash ./build_debian_image.sh \\
    --rootfs-dir $ROOT_DIR \\
    -o ~/destination-image.img \\
    --password your-password`,

    createConfidentialInstanceCommand,

    secureChannelWithInstanceCommand: `aleph instance confidential-init-session <vmhash>`,

    startInstanceCommand: `aleph instance confidential-start <vmhash>`,
  }

  useEffect(() => {
    if (!uploadedFile) return

    if (uploadedFile === encryptedDiskImageFormValues.encryptedDiskImage)
      resetForm()
  }, [uploadedFile, resetForm, encryptedDiskImageFormValues.encryptedDiskImage])

  return {
    commands,
    encryptedDiskImageFormValues,
    encryptedDiskImageCtrl,
    encryptedDiskImageItemHash,
    disabledUploadEncryptedDiskImage,
    isUploadingFile,
    uploadedFileMessage,
    uploadEncryptedDiskImageButtonRef,
    uploadEncryptedDiskImageButtonToolip,
    handleUploadEncryptedDiskImage,
    handleCopyEncryptedDiskImageHash,
    handleBack,
  }
}
