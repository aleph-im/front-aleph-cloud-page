export enum InstanceImageId {
  Debian11 = '5fbe9f437454601d27ef60d2fabb3fde302d4a7777a7035195658b4a6a34ac0a',
  Debian12 = '3b42891b0c40a1e6ed931f49b34baef18135d8addaaf0c9a66656d630957aa6b',
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
