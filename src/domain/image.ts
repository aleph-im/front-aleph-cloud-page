export enum InstanceImageId {
  Debian11 = '887957042bb0e360da3485ed33175882ce72a70d79f1ba599400ff4802b7cee7',
  Debian12 = '6e30de68c6cedfa6b45240c2b51e52495ac6fb1bd4b36457b3d5ca307594d595',
  Ubuntu22 = '77fef271aa6ff9825efa3186ca2e715d19e7108279b817201c69c34cedc74c27',
}

export type InstanceImage = {
  id: string
  name: string
  dist: string

  // @todo: Remove this once we have all premade images
  disabled?: boolean
}

export const InstanceImages: Record<InstanceImageId, InstanceImage> = {
  [InstanceImageId.Debian11]: {
    id: InstanceImageId.Debian11,
    name: 'Debian 11 “Bullseye”',
    dist: 'debian',
  },
  [InstanceImageId.Debian12]: {
    id: InstanceImageId.Debian12,
    name: 'Debian 12 “Bookworm”',
    dist: 'debian',
  },
  [InstanceImageId.Ubuntu22]: {
    id: InstanceImageId.Ubuntu22,
    name: 'Ubuntu 22.04 LTS',
    dist: 'ubuntu',
  },
}
