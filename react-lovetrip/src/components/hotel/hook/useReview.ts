import { useQuery, useMutation, useQueryClient } from 'react-query'

import { getReviews, writeReview, removeReview } from '@remote/review'
import useUser from '@hooks/auth/useUser'

function useReview({ hotelId }: { hotelId: string }) {
  const user = useUser()
  const client = useQueryClient()

  const { data, isLoading } = useQuery(['reviews', hotelId], () =>
    getReviews({ hotelId }),
  )

  const { mutateAsync: write } = useMutation(
    //mutateAsync는 promise를 반환하기 때문에 사용처에서 흐름을 제어할 수 있음
    async (text: string) => {
      const newReview = {
        createdAt: new Date(),
        hotelId,
        userId: user?.uid as string,
        text,
      }

      await writeReview(newReview)

      return true
    },
    {
      onSuccess: () => {
        client.invalidateQueries(['reviews', hotelId])
        //invalidateQueries를 이용해 쿼리를 다시 갱신하도록
      },
    },
  )

  const { mutate: remove } = useMutation(
    ({ reviewId, hotelId }: { reviewId: string; hotelId: string }) => {
      return removeReview({ reviewId, hotelId })
    },
    {
      onSuccess: () => {
        client.invalidateQueries(['reviews', hotelId])
      },
    },
  )

  return { data, isLoading, write, remove }
}

export default useReview
