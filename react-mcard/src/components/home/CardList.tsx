import React, { useCallback } from 'react'
import ListRow from '@shared/ListRow'
import { useInfiniteQuery } from 'react-query'
import { getCards } from '@/remote/card'
import { flatten } from 'lodash'
import InfiniteScroll from 'react-infinite-scroll-component'
import Badge from '@shared/Badge'
import { useNavigate } from 'react-router-dom'
//내 모니터 화면이 더 커서 데이터가 안불러와져;;;;

const CardList = () => {
  const navigate = useNavigate()
  const {
    data,
    hasNextPage = false,
    //hasMore는 boolean이어서 undefined일 경우가 있으니 없으면 false로
    fetchNextPage,
    isFetching,
  } = useInfiniteQuery(
    //데이터, 다음페이지가 있는지 여부, 다음페이지 불러옴
    ['cards'],
    ({ pageParam }) => {
      //(4)리턴한 커서요소가 pageParam으로 들어감
      return getCards(pageParam) //(5) getCards에 pageParam이 들어가 다음에 불러올때는 최초쿼리가 아닌 다음 쿼리로 실행
      //(1) 카드 호출
    },
    {
      getNextPageParam: (snapshot) => {
        //snapshot에는 새롭게 불러온 데이터가 들어있음
        //(2) 불러진 데이터 snapshot으로 들어옴
        return snapshot.lastVisible //(3)snapshot의 마지막 데이터(커서요소)를 리턴
      },
    },
  )

  const loadMore = useCallback(() => {
    if (hasNextPage === false || isFetching) {
      return //아무것도 안할거야
    }
    fetchNextPage()
  }, [fetchNextPage, hasNextPage, isFetching])

  const cards = flatten(data?.pages.map(({ items }) => items))
  //데이터가 pages안에 데이터로 배열안에 배열이 있는 구조라 평평하게 만들어 사용 [[1페이지],[2페이지],...] => [1페이지, 2페이지]

  return (
    <div>
      <InfiniteScroll
        dataLength={cards.length}
        hasMore={hasNextPage}
        loader={<></>}
        next={loadMore}
        scrollThreshold="100px"
      >
        <ul>
          {/* dataLength는 데이터의 개수, hasMore은 다음 페이지를 부를 수 있는지 여부, loader는 로딩중에 대체제, next는 fetch함수를 넣어주면 됨, scrollThreshold는 특정 부분에서 어떻게 불러올지*/}
          {cards?.map((card, i) => {
            return (
              <ListRow
                key={i}
                contents={
                  <ListRow.Texts title={`${i + 1}위`} subTitle={card.name} />
                }
                right={card.payback && <Badge label={card.payback} />}
                withArrow={true}
                onClick={() => {
                  navigate(`/card/${card.id}`)
                }}
              />
            )
          })}
        </ul>
      </InfiniteScroll>
    </div>
  )
}

export default CardList
