import { useInfiniteQuery } from 'react-query'

import { getTransactions } from '@remote/transaction'
import useUser from '@hooks/useUser'
import { TransactionFilterType } from '@models/transaction'

function useTransactions({
  suspense,
  filter,
}: { suspense?: boolean; filter?: TransactionFilterType } = {}) {
  //없을수도 있어서 기본값을 빈객체로
  const user = useUser()

  return useInfiniteQuery(
    ['transactions', user?.id, filter],
    ({ pageParam }) =>
      getTransactions({ userId: user?.id as string, pageParam, filter }),
    {
      getNextPageParam: (snapshot) => {
        return snapshot.lastVisible
      },
      suspense,
    },
  )
}

export default useTransactions
