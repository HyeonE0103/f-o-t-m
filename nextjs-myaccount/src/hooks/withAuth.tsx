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

    if (status === 'loading') {
      //SEO를 위하여 AuthGuard와 withAuth를 통합
      //AuthGuard의 useSession이 여러단계에 걸쳐서 인증을 체크하기 때문에
      //첫 상태는 loading으로 판단되어 원하는 카드 컴포넌트를 전달해주는 것이 아닌
      //null을 그려버려 내가 원하는 SEO가 아닌 기본 SEO에 대한 정보만 있음
      return null
    }

    if (data == null) {
      router.replace('/auth/signin')
      return null
    }

    return <WrappedComponent {...(props as any)} />
  }
}

export default withAuth
