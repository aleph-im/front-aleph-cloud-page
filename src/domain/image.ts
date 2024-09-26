export enum InstanceImageId {
  Debian11 = 'f7e68c568906b4ebcd3cd3c4bfdff96c489cd2a9ef73ba2d7503f244dfd578de',
  Debian12 = 'b6ff5c3a8205d1ca4c7c3369300eeafff498b558f71b851aa2114afd0a532717',
  Ubuntu22 = '4a0f62da42f4478544616519e6f5d58adb1096e069b392b151d47c3609492d0c',
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
