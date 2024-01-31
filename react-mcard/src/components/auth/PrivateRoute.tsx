import useUser from '@/hooks/auth/useUser'
import React from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  //유저의 정보를 받아서 어떤 페이지로 보낼지를 결정해주는 컴포넌트
  const user = useUser()

  if (user == null) {
    //로그인 안된 상태라면
    return <Navigate to="/signin" replace={true} />
    //replace를 해서 push를 안함(페이지 이동시 현재 페이지를 페이지 기록에 남기지 않음)
  }

  return <>{children}</>
}

export default PrivateRoute
