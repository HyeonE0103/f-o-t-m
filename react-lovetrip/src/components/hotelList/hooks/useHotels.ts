import { useInfiniteQuery } from 'react-query'

import { getHotels } from '@remote/hotel'
import { useCallback } from 'react'

const useHotels = () => {
  const {
    data,
    hasNextPage = false,
    fetchNextPage,
    isFetching,
  } = useInfiniteQuery(['hotels'], ({ pageParam }) => getHotels(pageParam), {
    getNextPageParam: (snapshot) => {
      return snapshot.lastVisible
    }, //첫번째 인자: 키값, 두번째 인자: 패치함수, 세번째 인자: 다음 pageParam을 어떻게 만들어줄지
    suspense: true, //데이터가 불러올때는 suspense방출
  })

  const loadMore = useCallback(() => {
    if (hasNextPage === false || isFetching) {
      return //다음페이지가 없거나 Fetching중이라면 아무일도 하지 않음
    }

    fetchNextPage() //페이지가 있고 Fetching중이 아니라면 다음 페이지를 받아옴
  }, [fetchNextPage, hasNextPage, isFetching])

  const hotels = data?.pages.map(({ items }) => items).flat()
  //데이터를 실제로 쓰기 위해서 flat하게 펼쳐서 평준하게 만듬
  //[{{},{},{}},{{},{},{}}] -> [{},{},{}]로 page로 나눠진것을 평평하게

  return { data: hotels, loadMore, isFetching, hasNextPage }
}

export default useHotels
