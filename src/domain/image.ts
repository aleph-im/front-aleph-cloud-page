export enum InstanceImageId {
  Debian11 = '3c61a98e0a40ee50c4c9270634814a4fcf5cbb2baff6407f506b85e52b8c7af9',
  Debian12 = '6756096dbaf56fad07ad4d8a309110da15ac3b5f3ebcaa1d10ee8115a090e722',
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
