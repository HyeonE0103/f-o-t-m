import { atom } from 'recoil'

import { User } from '@models/user'

export const userAtom = atom<User | null>({
  key: 'auth/user',
  default: null,
})
