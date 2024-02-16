import { signOut } from 'next-auth/react'
import withAuth from '@/hooks/withAuth'

import Spacing from '@shared/Spacing'
import Flex from '@shared/Flex'
import Button from '@shared/Button'

function MyPage() {
  return (
    <div>
      <Spacing size={100} />
      <Flex justify="center">
        <Button onClick={() => signOut({ callbackUrl: '/' })}>로그아웃</Button>
        {/* 로그아웃시 '/'로 이동 */}
      </Flex>
    </div>
  )
}

export default withAuth(MyPage)
