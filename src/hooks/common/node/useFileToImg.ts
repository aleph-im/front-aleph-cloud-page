import { apiServer } from '@/helpers/constants'
import { fileToImg } from '@/helpers/utils'
import { useEffect, useState } from 'react'

export type UseFileToImgProps = {
  file?: File | string
}

export type UseFileToImgReturn = {
  img?: HTMLImageElement
}

export function useFileToImg({ file }: UseFileToImgProps): UseFileToImgReturn {
  const [img, setImg] = useState<HTMLImageElement>()

  useEffect(() => {
    async function load() {
      if (!file) {
        setImg(undefined)
        return
      }

      let img: HTMLImageElement | undefined

      if (file instanceof File) {
        img = await fileToImg(file)
      }

      if (typeof file === 'string') {
        img = new Image()
        img.src = `${apiServer}/api/v0/storage/raw/${file}`
      }

      if (!img) return

      setImg(img)
    }

    load()
  }, [file])

  return { img }
}
