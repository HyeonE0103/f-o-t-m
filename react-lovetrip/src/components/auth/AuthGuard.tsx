import { useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { useSetRecoilState } from 'recoil'

import { auth } from '@remote/firebase'
import { userAtom } from '@store/atom/user'

function AuthGuard({ children }: { children: React.ReactNode }) {
  //user 로그인 여부를 판단하여 해당 정보를 전역 유저 정보에 업데이트
  const [initialize, setInitialize] = useState(false)
  //인증이 완료되었는지 여부
  const setUser = useSetRecoilState(userAtom)

  onAuthStateChanged(auth, (user) => {
    console.log('user', user)

    if (user == null) {
      //로그인하지 않았다면 전역유저정보를 null로 변경
      setUser(null)
    } else {
      //로그인했다면 유저의 정보를 전역유저상태로 변경
      setUser({
        uid: user.uid,
        email: user.email ?? '',
        displayName: user.displayName ?? '',
        photoURL: user.photoURL ?? '',
      })
    }

    setInitialize(true)
  })

  if (initialize === false) {
    return null
  }

  return <>{children}</>
}

export default AuthGuard
