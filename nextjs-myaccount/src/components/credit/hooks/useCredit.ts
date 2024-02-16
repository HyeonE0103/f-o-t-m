import { useQuery } from 'react-query'

import { getCredit } from '@remote/credit'
import useUser from '@hooks/useUser'

function useCredit() {
  const user = useUser()

  return useQuery(['credit', user?.id], () => getCredit(user?.id as string), {
    enabled: user != null,
    //로그인한 유저가 있을 경우에만 동작하도록 함
  })
}

export default useCredit
