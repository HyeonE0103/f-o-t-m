import { ComponentType } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

// 이 페이지로 진입을 했는데 세션이 비어있다면(로그인하지 않은 상태) 로그인 페이지로 이동하도록 만듬
function withAuth<Props = Record<string, never>>(
  WrappedComponent: ComponentType<Props>,
) {
  return function AuthenticatedComponent(props: Props) {
    const { data, status } = useSession()
    const router = useRouter()

    if (status !== 'loading' && data == null) {
      //로딩이 아닌데 세션이 비어있는 로그인하지 않은 상태라면 로그인페이지로
      router.replace('/auth/signin')

      return null
    }

    return <WrappedComponent {...(props as any)} />
  }
}

export default withAuth
