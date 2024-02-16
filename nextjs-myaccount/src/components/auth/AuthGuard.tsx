import { useSession } from 'next-auth/react'

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  // useSession은 data, status를 제공해줌

  if (status === 'loading') {
    // 인증에 대한 처리를 하는 중
    return null
  }

  return <>{children}</>
}

export default AuthGuard
