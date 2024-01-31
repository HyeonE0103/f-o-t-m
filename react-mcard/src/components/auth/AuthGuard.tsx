import { userAtom } from '@/atoms/user'
import { auth } from '@/remote/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import React, { useState } from 'react'
import { useSetRecoilState } from 'recoil'

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  //인증처리
  const [initialize, setInitialize] = useState(false)
  //true인 경우 인증 처리가 완료됨
  const setUser = useSetRecoilState(userAtom)

  onAuthStateChanged(auth, (user) => {
    //첫번째 인자로 auth를 두번째 인자로 유저의 정보를 받게 됨

    if (user != null) {
      //유저가 로그인한 상태
      setUser({
        uid: user.uid,
        email: user.email ?? '',
        displayName: user.displayName ?? '',
        //email과 displayName이 옵셔널이기 때문에 없다면 빈문자열
      })
    } else {
      //유저가 로그인하지 않은 상태
      setUser(null)
    }

    setInitialize(true)
    //콜백이 한번 실행되면 초기화를 거쳤다고 판단 = 인증 처리가 완료됨
  })

  if (initialize === false) {
    //initializ가 false라면 인증 처리가 되지 않았다 = 즉 인증 로딩중
    return null
  }

  return <>{children}</>
  /*Its return type 'ReactNode' is not a valid JSX element.
  Type 'undefined' is not assignable to type 'Element | null'
  로 안감싸면 type 오류 남*/
}

export default AuthGuard
