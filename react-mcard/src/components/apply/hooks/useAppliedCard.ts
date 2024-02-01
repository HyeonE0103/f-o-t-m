import { useQuery, UseQueryOptions } from 'react-query'

import { getAppliedCard } from '@remote/apply'
import { ApplyValues } from '@models/apply'

const useAppliedCard = ({
  userId,
  cardId,
  options,
}: {
  userId: string
  cardId: string
  options?: Pick<
    UseQueryOptions<ApplyValues | null>,
    'onSuccess' | 'onError' | 'suspense'
  > //react-query 옵션을 가리키며 그중 3개의 type을 가져다 씀
  //getAppliedCard 어떤 값을 반환하는지 옵션까지 흘러가도록 tyep 명시함
}) => {
  return useQuery(
    ['applied', userId, cardId],
    () => getAppliedCard({ userId, cardId }),
    options,
  )
}

export default useAppliedCard
