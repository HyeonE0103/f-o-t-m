import {
  getProviders,
  LiteralUnion,
  ClientSafeProvider,
  signIn,
} from 'next-auth/react'

import Flex from '@shared/Flex'
import Text from '@shared/Text'
import Button from '@shared/Button'
import Spacing from '@shared/Spacing'
import { BuiltInProviderType } from 'next-auth/providers/index'

function SigninPage({
  providers,
}: {
  providers: Record<LiteralUnion<BuiltInProviderType>, ClientSafeProvider>
}) {
  return (
    <div>
      <Spacing size={100} />
      <Flex direction="column" align="center">
        <Text bold={true}>My Account</Text>
        <Spacing size={80} />
        <ul>
          {Object.values(providers).map((provider) => (
            <li key={provider.id}>
              <Button onClick={() => signIn(provider.id, { callbackUrl: '/' })}>
                {/* signIn에다가 provider.id만 주고 로그인 성공시 이동할 callbackUrl을 넣어줌 */}
                {provider.name} LOGIN
              </Button>
            </li>
          ))}
        </ul>
      </Flex>
    </div>
  )
}

export async function getServerSideProps() {
  const providers = await getProviders()
  //확장성을 위해 하드 코딩이 아닌 provider의 정보를 가져와 그에 따른 버튼을 구현할것
  //getProviders 이용하면 애플리케이션에서 적용하고 있는 provider들에 정보를 가지고 올 수 있음

  return {
    props: {
      providers,
    },
  }
}

export default SigninPage
